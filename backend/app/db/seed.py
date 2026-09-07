"""Deterministic, idempotent seed orchestrator for Duolingo fullstack clone."""
import logging
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.init_db import create_tables
from app.models import (
    User,
    UserStats,
    Achievement,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    LessonProgress,
)
from app.db.seed_data import (
    USERS_SEED_DATA,
    ACHIEVEMENTS_SEED_DATA,
    COURSE_SEED_DATA,
)

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("seed")


def seed_users(session: Session) -> int:
    """Seed default learner and leaderboard demo users idempotently."""
    count = 0
    for user_data in USERS_SEED_DATA:
        username = user_data["username"]
        stmt = select(User).where(User.username == username)
        user = session.execute(stmt).scalar_one_or_none()

        stats_data = user_data["stats"]
        if not user:
            user = User(
                username=username,
                email=user_data["email"],
                password_hash=user_data.get("password_hash"),
                avatar_key=user_data["avatar_key"],
                is_active=user_data["is_active"],
                onboarding_completed=user_data.get("onboarding_completed", True),
                experience_level=user_data.get("experience_level", "beginner"),
                selected_course_id=user_data.get("selected_course_id", 1),
            )
            session.add(user)
            session.flush()  # Generate user.id for 1:1 user_stats

            stats = UserStats(
                user_id=user.id,
                total_xp=stats_data["total_xp"],
                current_streak=stats_data["current_streak"],
                longest_streak=stats_data["longest_streak"],
                last_activity_date=stats_data.get("last_activity_date"),
                hearts=stats_data["hearts"],
                max_hearts=stats_data["max_hearts"],
                gems=stats_data["gems"],
                daily_goal_xp=stats_data["daily_goal_xp"],
                daily_goal_progress=stats_data["daily_goal_progress"],
                daily_goal_date=stats_data.get("daily_goal_date"),
            )
            session.add(stats)
            count += 1
        else:
            # User already exists - update auth fields if missing
            if not user.password_hash:
                user.password_hash = user_data.get("password_hash")
            user.onboarding_completed = user_data.get("onboarding_completed", True)
            if not user.experience_level:
                user.experience_level = user_data.get("experience_level", "beginner")
            if not user.selected_course_id:
                user.selected_course_id = user_data.get("selected_course_id", 1)

            # Ensure user_stats exists
            if not user.stats:
                stats = UserStats(
                    user_id=user.id,
                    total_xp=stats_data["total_xp"],
                    current_streak=stats_data["current_streak"],
                    longest_streak=stats_data["longest_streak"],
                    last_activity_date=stats_data.get("last_activity_date"),
                    hearts=stats_data["hearts"],
                    max_hearts=stats_data["max_hearts"],
                    gems=stats_data["gems"],
                    daily_goal_xp=stats_data["daily_goal_xp"],
                    daily_goal_progress=stats_data["daily_goal_progress"],
                    daily_goal_date=stats_data.get("daily_goal_date"),
                )
                session.add(stats)

    session.flush()
    logger.info("Seeded %d new users (total defined: %d).", count, len(USERS_SEED_DATA))
    return len(USERS_SEED_DATA)


def seed_achievements(session: Session) -> int:
    """Seed achievement definitions idempotently."""
    count = 0
    for ach_data in ACHIEVEMENTS_SEED_DATA:
        code = ach_data["code"]
        stmt = select(Achievement).where(Achievement.code == code)
        ach = session.execute(stmt).scalar_one_or_none()

        if not ach:
            ach = Achievement(
                code=code,
                title=ach_data["title"],
                description=ach_data["description"],
                icon_key=ach_data["icon_key"],
                requirement_json=ach_data["requirement_json"],
            )
            session.add(ach)
            count += 1
        else:
            ach.title = ach_data["title"]
            ach.description = ach_data["description"]
            ach.icon_key = ach_data["icon_key"]
            ach.requirement_json = ach_data["requirement_json"]

    session.flush()
    logger.info("Seeded %d new achievements (total defined: %d).", count, len(ACHIEVEMENTS_SEED_DATA))
    return len(ACHIEVEMENTS_SEED_DATA)


def seed_course_content(session: Session) -> dict:
    """Seed course, units, skills, lessons, and exercises idempotently."""
    counts = {"courses": 0, "units": 0, "skills": 0, "lessons": 0, "exercises": 0}

    # 1. Course
    code = COURSE_SEED_DATA["code"]
    stmt = select(Course).where(Course.code == code)
    course = session.execute(stmt).scalar_one_or_none()
    if not course:
        course = Course(
            code=code,
            title=COURSE_SEED_DATA["title"],
            source_language=COURSE_SEED_DATA["source_language"],
            target_language=COURSE_SEED_DATA["target_language"],
            description=COURSE_SEED_DATA["description"],
            is_active=COURSE_SEED_DATA["is_active"],
        )
        session.add(course)
        session.flush()
        counts["courses"] += 1

    # 2. Units
    for unit_data in COURSE_SEED_DATA["units"]:
        unit_order = unit_data["order_index"]
        stmt = select(Unit).where(Unit.course_id == course.id, Unit.order_index == unit_order)
        unit = session.execute(stmt).scalar_one_or_none()
        if not unit:
            unit = Unit(
                course_id=course.id,
                title=unit_data["title"],
                description=unit_data["description"],
                order_index=unit_order,
            )
            session.add(unit)
            session.flush()
            counts["units"] += 1

        # 3. Skills
        for skill_data in unit_data["skills"]:
            skill_order = skill_data["order_index"]
            stmt = select(Skill).where(Skill.unit_id == unit.id, Skill.order_index == skill_order)
            skill = session.execute(stmt).scalar_one_or_none()
            if not skill:
                skill = Skill(
                    unit_id=unit.id,
                    title=skill_data["title"],
                    description=skill_data["description"],
                    order_index=skill_order,
                    icon_key=skill_data["icon_key"],
                    node_type=skill_data["node_type"],
                    total_lessons=skill_data["total_lessons"],
                )
                session.add(skill)
                session.flush()
                counts["skills"] += 1
            else:
                skill.total_lessons = skill_data["total_lessons"]

            # 4. Lessons
            for lesson_data in skill_data["lessons"]:
                lesson_order = lesson_data["order_index"]
                stmt = select(Lesson).where(Lesson.skill_id == skill.id, Lesson.order_index == lesson_order)
                lesson = session.execute(stmt).scalar_one_or_none()
                if not lesson:
                    lesson = Lesson(
                        skill_id=skill.id,
                        title=lesson_data["title"],
                        order_index=lesson_order,
                        xp_reward=lesson_data["xp_reward"],
                        estimated_seconds=lesson_data["estimated_seconds"],
                        is_active=True,
                    )
                    session.add(lesson)
                    session.flush()
                    counts["lessons"] += 1

                # 5. Exercises
                for ex_data in lesson_data["exercises"]:
                    ex_order = ex_data["order_index"]
                    stmt = select(Exercise).where(Exercise.lesson_id == lesson.id, Exercise.order_index == ex_order)
                    exercise = session.execute(stmt).scalar_one_or_none()
                    if not exercise:
                        exercise = Exercise(
                            lesson_id=lesson.id,
                            type=ex_data["type"],
                            prompt=ex_data["prompt"],
                            question_data_json=ex_data["question_data_json"],
                            answer_data_json=ex_data["answer_data_json"],
                            order_index=ex_order,
                        )
                        session.add(exercise)
                        counts["exercises"] += 1

    session.flush()
    logger.info("Course content seed complete: %s", counts)
    return counts


def seed_demo_progress(session: Session) -> int:
    """Seed completed lesson progress for demo users who have XP."""
    demo_usernames = ["Alex", "Sam", "Jordan", "Taylor", "Casey"]
    count = 0
    lessons = (
        session.execute(select(Lesson).order_by(Lesson.order_index.asc()).limit(3))
        .scalars()
        .all()
    )
    if not lessons:
        return 0

    for uname in demo_usernames:
        user = session.execute(select(User).where(User.username == uname)).scalar_one_or_none()
        if not user:
            continue
        for lesson in lessons:
            stmt = select(LessonProgress).where(
                LessonProgress.user_id == user.id,
                LessonProgress.lesson_id == lesson.id,
            )
            prog = session.execute(stmt).scalar_one_or_none()
            if not prog:
                prog = LessonProgress(
                    user_id=user.id,
                    lesson_id=lesson.id,
                    is_completed=True,
                    attempts_count=1,
                    best_score=100,
                )
                session.add(prog)
                count += 1
            else:
                prog.is_completed = True

    session.flush()
    logger.info("Seeded %d demo lesson progress records.", count)
    return count


def seed_all(session: Session = None) -> dict:
    """Orchestrate all seed operations within a single atomic transaction."""
    should_close = False
    if session is None:
        session = SessionLocal()
        should_close = True

    try:
        # Ensure schema tables exist
        create_tables(engine=session.get_bind())

        logger.info("Starting database seeding...")
        course_counts = seed_course_content(session)
        users_count = seed_users(session)
        seed_demo_progress(session)
        ach_count = seed_achievements(session)

        session.commit()
        logger.info("Seeding completed and committed successfully.")
        return {
            "users": users_count,
            "achievements": ach_count,
            **course_counts,
        }

    except Exception as exc:
        session.rollback()
        logger.error("Error during seeding, transaction rolled back: %s", exc)
        raise
    finally:
        if should_close:
            session.close()


if __name__ == "__main__":
    seed_all()
