from typing import List
from sqlalchemy.orm import Session
from app.repositories.achievement_repository import achievement_repository
from app.schemas.achievement import AchievementPublic, UserAchievementPublic


class AchievementService:
    def get_all_achievements(self, db: Session) -> List[AchievementPublic]:
        """
        Fetch all predefined achievement definitions.
        """
        achievements = achievement_repository.get_all_achievements(db)
        return [
            AchievementPublic(
                id=a.id,
                code=a.code,
                title=a.title,
                description=a.description,
                icon_key=a.icon_key,
                requirement_json=a.requirement_json,
            )
            for a in achievements
        ]

    def get_user_achievements(
        self, db: Session, user_id: int
    ) -> List[UserAchievementPublic]:
        """
        Fetch all unlocked achievements for a specific user.
        """
        records = achievement_repository.get_user_achievements(db, user_id)
        return [
            UserAchievementPublic(
                id=uach.id,
                achievement_id=ach.id,
                code=ach.code,
                title=ach.title,
                description=ach.description,
                icon_key=ach.icon_key,
                unlocked_at=uach.unlocked_at,
            )
            for uach, ach in records
        ]


achievement_service = AchievementService()
