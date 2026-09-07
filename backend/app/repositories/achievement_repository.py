from typing import List, Tuple
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement


class AchievementRepository:
    def get_all_achievements(self, db: Session) -> List[Achievement]:
        """Fetch all defined achievements in deterministic order."""
        stmt = select(Achievement).order_by(Achievement.id.asc())
        return db.execute(stmt).scalars().all()

    def get_user_achievements(
        self, db: Session, user_id: int
    ) -> List[Tuple[UserAchievement, Achievement]]:
        """Fetch achievements unlocked by a specific user with achievement definitions."""
        stmt = (
            select(UserAchievement, Achievement)
            .join(Achievement, Achievement.id == UserAchievement.achievement_id)
            .where(UserAchievement.user_id == user_id)
            .order_by(UserAchievement.unlocked_at.desc())
        )
        return db.execute(stmt).all()


achievement_repository = AchievementRepository()
