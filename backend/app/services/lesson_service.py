import re
from datetime import datetime, timezone, timedelta
from typing import Any, List, Optional
from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.user_stats import UserStats
from app.models.lesson import Lesson
from app.models.exercise import Exercise
from app.models.lesson_attempt import LessonAttempt
from app.models.exercise_attempt import ExerciseAttempt
from app.models.lesson_progress import LessonProgress
from app.models.skill_progress import SkillProgress
from app.models.daily_activity import DailyActivity
from app.models.unit import Unit
from app.models.skill import Skill
from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement
from app.repositories.course_repository import course_repository
from app.services.course_path_service import course_path_service
from app.schemas.lesson import (
    LessonDetailResponse,
    ExercisePublic,
    LessonAttemptStartResponse,
    ExerciseAnswerRequest,
    ExerciseAnswerResponse,
    LessonCompleteSkillSummary,
    LessonCompleteStreakSummary,
    LessonCompleteDailyGoalSummary,
    LessonCompleteResponse,
)


def normalize_text(text: Any) -> str:
    """
    Standardize text input for fair language evaluation.
    Trims whitespace, collapses repeated inner whitespace, lowercases,
    and strips trailing sentence punctuation.
    """
    if text is None:
        return ""
    if not isinstance(text, str):
        text = str(text)
    text = text.strip().lower()
    text = re.sub(r"\s+", " ", text)
    # Strip common sentence punctuation from end
    text = re.sub(r"[.?!,;:\'\"।]+$", "", text).strip()
    return text


class LessonService:
    def get_lesson(self, db: Session, lesson_id: int) -> LessonDetailResponse:
        """
        Fetch a lesson and its ordered exercises safely.
        STRICT SECURITY: Never returns answer_data_json or authoritative answers.
        """
        lesson = course_repository.get_lesson_with_exercises(db, lesson_id)
        if not lesson or not lesson.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lesson with ID {lesson_id} not found or is inactive.",
            )

        # Sort exercises deterministically by order_index
        sorted_exercises = sorted(lesson.exercises, key=lambda e: e.order_index)

        exercises_public = [
            ExercisePublic(
                id=ex.id,
                type=ex.type,
                prompt=ex.prompt,
                question_data=ex.question_data_json,
                order_index=ex.order_index,
            )
            for ex in sorted_exercises
        ]

        return LessonDetailResponse(
            id=lesson.id,
            title=lesson.title,
            order_index=lesson.order_index,
            xp_reward=lesson.xp_reward,
            estimated_seconds=lesson.estimated_seconds,
            skill_id=lesson.skill_id,
            skill_title=lesson.skill.title if lesson.skill else None,
            exercises=exercises_public,
        )

    def start_lesson_attempt(
        self, db: Session, user: User, lesson_id: int
    ) -> LessonAttemptStartResponse:
        """
        Start a new authoritative lesson attempt.
        Validates lesson exists, is accessible/unlocked for current user,
        and user has enough hearts to play.
        """
        lesson = course_repository.get_lesson_with_exercises(db, lesson_id)
        if not lesson or not lesson.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lesson with ID {lesson_id} not found or is inactive.",
            )

        # Check sequential unlocking state
        course_id = db.scalar(
            select(Unit.course_id)
            .join(Skill, Skill.unit_id == Unit.id)
            .where(Skill.id == lesson.skill_id)
        )
        if course_id:
            course_path = course_path_service.get_course_path(db, course_id, user.id)
            is_accessible = False
            for unit in course_path.units:
                for skill in unit.skills:
                    for l in skill.lessons:
                        if l.id == lesson_id:
                            if l.status in ("available", "completed"):
                                is_accessible = True
                            break
            if not is_accessible:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="This lesson is locked. Complete prerequisite lessons first.",
                )

        # Ensure user stats and hearts
        user_stats = db.execute(
            select(UserStats).where(UserStats.user_id == user.id)
        ).scalar_one_or_none()
        if not user_stats:
            user_stats = UserStats(user_id=user.id)
            db.add(user_stats)
            db.commit()
            db.refresh(user_stats)

        if user_stats.hearts <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have 0 hearts. Please refill hearts before starting a lesson.",
            )

        attempt = LessonAttempt(
            user_id=user.id,
            lesson_id=lesson_id,
            started_at=datetime.now(timezone.utc),
            is_completed=False,
            hearts_lost=0,
            score=0,
            xp_earned=0,
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)

        return LessonAttemptStartResponse(
            attempt_id=attempt.id,
            lesson_id=lesson_id,
            started_at=attempt.started_at.isoformat(),
            hearts_remaining=user_stats.hearts,
        )

    def submit_exercise_answer(
        self,
        db: Session,
        user: User,
        lesson_id: int,
        attempt_id: int,
        payload: ExerciseAnswerRequest,
    ) -> ExerciseAnswerResponse:
        """
        Validate an exercise submission authoritatively against server-side answer keys.
        Deducts a heart upon incorrect submission (down to 0 floor).
        Persists ExerciseAttempt record.
        """
        # 1. Verify Attempt Ownership and State
        attempt = db.execute(
            select(LessonAttempt).where(
                LessonAttempt.id == attempt_id, LessonAttempt.user_id == user.id
            )
        ).scalar_one_or_none()
        if not attempt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson attempt not found or does not belong to you.",
            )
        if attempt.lesson_id != lesson_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attempt does not correspond to this lesson.",
            )
        if attempt.is_completed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This lesson attempt has already been completed.",
            )

        # 2. Verify Exercise Belongs to Lesson
        exercise = db.execute(
            select(Exercise).where(
                Exercise.id == payload.exercise_id, Exercise.lesson_id == lesson_id
            )
        ).scalar_one_or_none()
        if not exercise:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exercise not found in this lesson.",
            )

        # 3. Authoritative Answer Evaluation for all 6 Exercise Types
        answer_data = exercise.answer_data_json or {}
        user_answer = payload.answer
        is_correct = False
        feedback = ""
        correct_answer_revealed: Optional[Any] = None

        ex_type = exercise.type
        if ex_type == "multiple_choice":
            correct_opt = answer_data.get("correct_option", "")
            is_correct = normalize_text(user_answer) == normalize_text(correct_opt)
            feedback = "Correct! Nicely done." if is_correct else f"Correct answer: {correct_opt}"
            correct_answer_revealed = correct_opt

        elif ex_type == "translate":
            accepted = answer_data.get("accepted_answers", [])
            norm_accepted = [normalize_text(a) for a in accepted]
            is_correct = normalize_text(user_answer) in norm_accepted
            primary_answer = accepted[0] if accepted else ""
            feedback = "Great translation!" if is_correct else f"Correct translation: {primary_answer}"
            correct_answer_revealed = primary_answer

        elif ex_type == "word_bank":
            correct_order = answer_data.get("correct_order", [])
            correct_str = " ".join(correct_order)
            if isinstance(user_answer, list):
                norm_user = [normalize_text(w) for w in user_answer]
                norm_exp = [normalize_text(w) for w in correct_order]
                is_correct = (norm_user == norm_exp) or (" ".join(norm_user) == " ".join(norm_exp))
            else:
                is_correct = normalize_text(user_answer) == normalize_text(correct_str)
            feedback = "Awesome arrangement!" if is_correct else f"Correct order: {correct_str}"
            correct_answer_revealed = correct_order

        elif ex_type == "match_pairs":
            pairs = answer_data.get("pairs", [])
            expected_sets = {
                frozenset([normalize_text(p[0]), normalize_text(p[1])])
                for p in pairs
                if isinstance(p, (list, tuple)) and len(p) >= 2
            }
            user_sets = set()
            if isinstance(user_answer, list):
                for item in user_answer:
                    if isinstance(item, (list, tuple)) and len(item) >= 2:
                        user_sets.add(frozenset([normalize_text(item[0]), normalize_text(item[1])]))
            is_correct = (user_sets == expected_sets) and len(expected_sets) > 0
            feedback = "All pairs matched perfectly!" if is_correct else "Some pairs were mismatched."
            correct_answer_revealed = pairs

        elif ex_type == "fill_blank":
            accepted = answer_data.get("accepted_answers", [])
            norm_accepted = [normalize_text(a) for a in accepted]
            is_correct = normalize_text(user_answer) in norm_accepted
            primary_answer = accepted[0] if accepted else ""
            feedback = "Spot on! Perfect fit." if is_correct else f"Correct answer: {primary_answer}"
            correct_answer_revealed = primary_answer

        elif ex_type == "type_answer":
            accepted = answer_data.get("accepted_answers", [])
            norm_accepted = [normalize_text(a) for a in accepted]
            is_correct = normalize_text(user_answer) in norm_accepted
            primary_answer = accepted[0] if accepted else ""
            feedback = "Spot on!" if is_correct else f"Correct answer: {primary_answer}"
            correct_answer_revealed = primary_answer

        else:
            # Fallback for generic exercise types
            is_correct = normalize_text(user_answer) == normalize_text(str(answer_data))
            feedback = "Submitted."

        # 4. Handle Heart Deduction
        user_stats = db.execute(
            select(UserStats).where(UserStats.user_id == user.id)
        ).scalar_one()

        if not is_correct:
            user_stats.hearts = max(0, user_stats.hearts - 1)
            attempt.hearts_lost += 1

        # 5. Upsert ExerciseAttempt
        ex_attempt = db.execute(
            select(ExerciseAttempt).where(
                ExerciseAttempt.lesson_attempt_id == attempt.id,
                ExerciseAttempt.exercise_id == exercise.id,
            )
        ).scalar_one_or_none()

        if not ex_attempt:
            ex_attempt = ExerciseAttempt(
                lesson_attempt_id=attempt.id,
                exercise_id=exercise.id,
                answer_data_json=payload.answer,
                is_correct=is_correct,
                answered_at=datetime.now(timezone.utc),
            )
            db.add(ex_attempt)
        else:
            ex_attempt.answer_data_json = payload.answer
            ex_attempt.is_correct = is_correct
            ex_attempt.answered_at = datetime.now(timezone.utc)

        db.commit()

        return ExerciseAnswerResponse(
            is_correct=is_correct,
            feedback=feedback,
            hearts_remaining=user_stats.hearts,
            exercise_completed=True,
            correct_answer=correct_answer_revealed if not is_correct else None,
        )

    def complete_lesson_attempt(
        self, db: Session, user: User, lesson_id: int, attempt_id: int
    ) -> LessonCompleteResponse:
        """
        Finalize a completed lesson attempt transactionally.
        Awards XP, updates streak, progress, and achievements.
        IDEMPOTENCY: Repeated calls return cached state without re-awarding XP or streak.
        """
        # 1. Fetch Attempt
        attempt = db.execute(
            select(LessonAttempt).where(
                LessonAttempt.id == attempt_id, LessonAttempt.user_id == user.id
            )
        ).scalar_one_or_none()
        if not attempt:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson attempt not found or does not belong to you.",
            )
        if attempt.lesson_id != lesson_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attempt does not correspond to this lesson.",
            )

        lesson = course_repository.get_lesson_with_exercises(db, lesson_id)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found.",
            )

        user_stats = db.execute(
            select(UserStats).where(UserStats.user_id == user.id)
        ).scalar_one()

        # 2. Idempotency Check: if already completed, return cached response
        if attempt.is_completed:
            sp = db.execute(
                select(SkillProgress).where(
                    SkillProgress.user_id == user.id,
                    SkillProgress.skill_id == lesson.skill_id,
                )
            ).scalar_one_or_none()
            total_lessons = len(lesson.skill.lessons) if lesson.skill else 1
            lessons_comp = sp.lessons_completed if sp else 1
            crown = sp.crown_level if sp else 1

            return LessonCompleteResponse(
                completed=True,
                xp_earned=attempt.xp_earned,
                total_xp=user_stats.total_xp,
                score=attempt.score,
                hearts_remaining=user_stats.hearts,
                skill_progress=LessonCompleteSkillSummary(
                    lessons_completed=lessons_comp,
                    total_lessons=total_lessons,
                    crown_level=crown,
                ),
                streak=LessonCompleteStreakSummary(
                    current=user_stats.current_streak,
                    longest=user_stats.longest_streak,
                ),
                daily_goal=LessonCompleteDailyGoalSummary(
                    progress=user_stats.daily_goal_progress,
                    goal=user_stats.daily_goal_xp,
                    completed=user_stats.daily_goal_progress >= user_stats.daily_goal_xp,
                ),
                new_achievements=[],
            )

        # 3. Calculate Score and Status
        exercise_attempts = db.execute(
            select(ExerciseAttempt).where(
                ExerciseAttempt.lesson_attempt_id == attempt.id
            )
        ).scalars().all()

        total_exercises = len(lesson.exercises)
        correct_count = sum(1 for ea in exercise_attempts if ea.is_correct)
        score = int(round((correct_count / max(1, total_exercises)) * 100))
        xp_earned = lesson.xp_reward
        now = datetime.now(timezone.utc)
        today = now.date()

        # 4. Transactional Updates
        attempt.is_completed = True
        attempt.completed_at = now
        attempt.score = score
        attempt.xp_earned = xp_earned

        # Upsert LessonProgress
        lp = db.execute(
            select(LessonProgress).where(
                LessonProgress.user_id == user.id, LessonProgress.lesson_id == lesson_id
            )
        ).scalar_one_or_none()
        if not lp:
            lp = LessonProgress(
                user_id=user.id,
                lesson_id=lesson_id,
                is_completed=True,
                attempts_count=1,
                best_score=score,
                completed_at=now,
                last_attempt_at=now,
            )
            db.add(lp)
        else:
            lp.is_completed = True
            lp.attempts_count += 1
            lp.best_score = max(lp.best_score, score)
            lp.last_attempt_at = now
            if not lp.completed_at:
                lp.completed_at = now

        db.flush()

        # Upsert SkillProgress
        completed_in_skill = db.scalar(
            select(func.count(LessonProgress.id))
            .join(Lesson, Lesson.id == LessonProgress.lesson_id)
            .where(
                LessonProgress.user_id == user.id,
                Lesson.skill_id == lesson.skill_id,
                LessonProgress.is_completed.is_(True),
            )
        ) or 0
        total_in_skill = len(lesson.skill.lessons) if lesson.skill else 1
        crown_level = 1 if completed_in_skill >= total_in_skill else 0

        sp = db.execute(
            select(SkillProgress).where(
                SkillProgress.user_id == user.id,
                SkillProgress.skill_id == lesson.skill_id,
            )
        ).scalar_one_or_none()
        if not sp:
            sp = SkillProgress(
                user_id=user.id,
                skill_id=lesson.skill_id,
                lessons_completed=completed_in_skill,
                crown_level=crown_level,
                total_xp_earned=xp_earned,
                best_score=score,
                last_completed_at=now if completed_in_skill >= total_in_skill else None,
            )
            db.add(sp)
        else:
            sp.lessons_completed = completed_in_skill
            if crown_level > sp.crown_level:
                sp.crown_level = crown_level
            sp.total_xp_earned += xp_earned
            sp.best_score = max(sp.best_score, score)
            if completed_in_skill >= total_in_skill and not sp.last_completed_at:
                sp.last_completed_at = now

        db.flush()

        # Update UserStats
        user_stats.total_xp += xp_earned

        # Streak calculation
        if user_stats.last_activity_date is None:
            user_stats.current_streak = 1
        elif user_stats.last_activity_date == today:
            pass  # Already practiced today
        elif user_stats.last_activity_date == today - timedelta(days=1):
            user_stats.current_streak += 1
        else:
            user_stats.current_streak = 1

        user_stats.longest_streak = max(user_stats.longest_streak, user_stats.current_streak)
        user_stats.last_activity_date = today

        # Daily goal calculation
        if user_stats.daily_goal_date != today:
            user_stats.daily_goal_date = today
            user_stats.daily_goal_progress = xp_earned
        else:
            user_stats.daily_goal_progress += xp_earned

        # Update DailyActivity
        daily_act = db.execute(
            select(DailyActivity).where(
                DailyActivity.user_id == user.id,
                DailyActivity.activity_date == today,
            )
        ).scalar_one_or_none()
        if not daily_act:
            daily_act = DailyActivity(
                user_id=user.id,
                activity_date=today,
                xp_earned=xp_earned,
                lessons_completed=1,
                exercises_answered=len(exercise_attempts),
            )
            db.add(daily_act)
        else:
            daily_act.xp_earned += xp_earned
            daily_act.lessons_completed += 1
            daily_act.exercises_answered += len(exercise_attempts)

        # Check achievements
        new_achievements = self._check_achievements(db, user.id, user_stats)

        db.commit()

        return LessonCompleteResponse(
            completed=True,
            xp_earned=xp_earned,
            total_xp=user_stats.total_xp,
            score=score,
            hearts_remaining=user_stats.hearts,
            skill_progress=LessonCompleteSkillSummary(
                lessons_completed=completed_in_skill,
                total_lessons=total_in_skill,
                crown_level=sp.crown_level if sp else crown_level,
            ),
            streak=LessonCompleteStreakSummary(
                current=user_stats.current_streak,
                longest=user_stats.longest_streak,
            ),
            daily_goal=LessonCompleteDailyGoalSummary(
                progress=user_stats.daily_goal_progress,
                goal=user_stats.daily_goal_xp,
                completed=user_stats.daily_goal_progress >= user_stats.daily_goal_xp,
            ),
            new_achievements=new_achievements,
        )

    def _check_achievements(
        self, db: Session, user_id: int, user_stats: UserStats
    ) -> List[str]:
        """
        Check achievement thresholds and idempotently grant awards.
        """
        unlocked_ids = set(
            db.scalars(
                select(UserAchievement.achievement_id).where(
                    UserAchievement.user_id == user_id
                )
            ).all()
        )

        all_achs = db.scalars(select(Achievement)).all()
        ach_by_code = {a.code: a for a in all_achs}

        total_lessons = (
            db.scalar(
                select(func.count(LessonProgress.id)).where(
                    LessonProgress.user_id == user_id,
                    LessonProgress.is_completed.is_(True),
                )
            )
            or 0
        )

        skills_with_crown = (
            db.scalar(
                select(func.count(SkillProgress.id)).where(
                    SkillProgress.user_id == user_id,
                    SkillProgress.crown_level > 0,
                )
            )
            or 0
        )

        candidates = []
        if total_lessons >= 1:
            candidates.append("FIRST_LESSON")
        if total_lessons >= 5:
            candidates.append("FIVE_LESSONS")
        if user_stats.total_xp >= 100:
            candidates.append("100_XP")
        if user_stats.current_streak >= 3:
            candidates.append("THREE_DAY_STREAK")
        if skills_with_crown >= 1:
            candidates.append("FIRST_SKILL_COMPLETED")

        newly_unlocked = []
        for code in candidates:
            ach = ach_by_code.get(code)
            if ach and ach.id not in unlocked_ids:
                new_uach = UserAchievement(user_id=user_id, achievement_id=ach.id)
                db.add(new_uach)
                unlocked_ids.add(ach.id)
                newly_unlocked.append(code)

        return newly_unlocked


lesson_service = LessonService()
