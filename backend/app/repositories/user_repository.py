from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload, selectinload
from app.models.user import User
from app.models.user_stats import UserStats
from app.models.lesson_progress import LessonProgress
from app.models.skill_progress import SkillProgress
from app.models.user_achievement import UserAchievement
from app.models.achievement import Achievement


class UserRepository:
    def get_user_with_stats(self, db: Session, user_id: int) -> Optional[User]:
        """Fetch user joined with user_stats in a single joined query."""
        stmt = select(User).where(User.id == user_id).options(joinedload(User.stats))
        return db.execute(stmt).scalar_one_or_none()

    def get_leaderboard(
        self, db: Session, limit: int = 100
    ) -> List[Tuple[User, UserStats]]:
        """
        Fetch top active users ordered by total_xp DESC.
        Uses aggregate user_stats join with deterministic limit and secondary sort on user.id.
        """
        stmt = (
            select(User, UserStats)
            .join(UserStats, UserStats.user_id == User.id)
            .where(User.is_active.is_(True))
            .order_by(UserStats.total_xp.desc(), User.id.asc())
            .limit(limit)
        )
        return db.execute(stmt).all()

    def count_completed_lessons(self, db: Session, user_id: int) -> int:
        return db.scalar(
            select(func.count(LessonProgress.id)).where(
                LessonProgress.user_id == user_id,
                LessonProgress.is_completed.is_(True),
            )
        ) or 0

    def get_profile_stats(self, db: Session, user_id: int) -> dict:
        """
        Fetch aggregate profile metrics without scanning historical attempt logs.
        Uses aggregate lesson_progress and skill_progress tables.
        """
        completed_lessons = db.scalar(
            select(func.count(LessonProgress.id)).where(
                LessonProgress.user_id == user_id,
                LessonProgress.is_completed.is_(True),
            )
        ) or 0

        completed_skills = db.scalar(
            select(func.count(SkillProgress.id)).where(
                SkillProgress.user_id == user_id,
                SkillProgress.crown_level > 0,
            )
        ) or 0

        # Fetch unlocked achievements joined with master achievement catalog
        stmt = (
            select(UserAchievement, Achievement)
            .join(Achievement, Achievement.id == UserAchievement.achievement_id)
            .where(UserAchievement.user_id == user_id)
            .order_by(UserAchievement.unlocked_at.desc())
        )
        achievements_rows = db.execute(stmt).all()

        achievements = [
            {
                "id": uach.id,
                "code": ach.code,
                "title": ach.title,
                "description": ach.description,
                "icon_key": ach.icon_key,
                "unlocked_at": uach.unlocked_at,
            }
            for uach, ach in achievements_rows
        ]

        return {
            "completed_lessons": completed_lessons,
            "completed_skills": completed_skills,
            "achievements": achievements,
        }


user_repository = UserRepository()
