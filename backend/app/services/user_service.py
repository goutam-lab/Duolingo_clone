from datetime import date, datetime, timezone, timedelta
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.user_stats import UserStats
from app.schemas.user import (
    UserMeResponse,
    UserStatsPublic,
    UserProfileResponse,
    ProfileStats,
    ProfileAchievement,
    HeartRefillResponse,
)
from app.repositories.user_repository import user_repository


class UserService:
    @staticmethod
    def get_today_utc() -> date:
        """Centralized application timezone strategy: UTC calendar date."""
        return datetime.now(timezone.utc).date()

    def get_me(self, db: Session, user: User) -> UserMeResponse:
        """
        Return current user state with ephemeral daily goal rollover and streak evaluations.
        Zero scanning of historical attempt tables.
        """
        stats = user.stats
        if not stats:
            # Create default stats if missing
            stats = UserStats(user_id=user.id)
            db.add(stats)
            db.commit()
            db.refresh(stats)

        today = self.get_today_utc()

        # 1. Daily goal rollover evaluation:
        # If the recorded daily_goal_date is before today, progress resets for the new day
        daily_goal_progress = stats.daily_goal_progress
        if stats.daily_goal_date is not None and stats.daily_goal_date < today:
            daily_goal_progress = 0

        # 2. Streak evaluation:
        # If no activity recorded: 0
        # If activity today or yesterday: current streak active
        # If activity older than yesterday: streak is broken (0)
        current_streak = stats.current_streak
        if stats.last_activity_date is None:
            current_streak = 0
        elif stats.last_activity_date < (today - timedelta(days=1)):
            current_streak = 0

        stats_public = UserStatsPublic(
            total_xp=stats.total_xp,
            current_streak=current_streak,
            longest_streak=stats.longest_streak,
            hearts=stats.hearts,
            max_hearts=stats.max_hearts,
            gems=stats.gems,
            daily_goal_xp=stats.daily_goal_xp,
            daily_goal_progress=daily_goal_progress,
            last_activity_date=stats.last_activity_date,
        )

        # Single targeted count query — avoids loading skill counts and achievements
        # (which are not needed for /me), keeping total queries <= 3
        completed_lessons = user_repository.count_completed_lessons(db, user.id)

        return UserMeResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            avatar_key=user.avatar_key or "default",
            total_xp=stats.total_xp,
            current_streak=current_streak,
            longest_streak=stats.longest_streak,
            hearts=stats.hearts,
            max_hearts=stats.max_hearts,
            gems=stats.gems,
            daily_goal_xp=stats.daily_goal_xp,
            daily_goal_progress=daily_goal_progress,
            completed_lessons=completed_lessons,
            onboarding_completed=user.onboarding_completed,
            experience_level=user.experience_level,
            selected_course_id=user.selected_course_id,
            stats=stats_public,
        )

    def refill_hearts(self, db: Session, user: User) -> HeartRefillResponse:
        """
        Refill current user's hearts to max_hearts (backend authoritative).
        """
        stats = user.stats
        if not stats:
            stats = UserStats(user_id=user.id)
            db.add(stats)

        stats.hearts = stats.max_hearts
        db.commit()
        db.refresh(stats)

        return HeartRefillResponse(
            hearts=stats.hearts,
            max_hearts=stats.max_hearts,
            message="Hearts refilled successfully",
        )

    def get_profile(self, db: Session, user_id: int) -> UserProfileResponse:
        """
        Fetch public profile and aggregate statistics.
        """
        user = user_repository.get_user_with_stats(db, user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found.",
            )

        aggregates = user_repository.get_profile_stats(db, user_id)
        stats = user.stats

        total_xp = stats.total_xp if stats else 0
        current_streak = stats.current_streak if stats else 0
        longest_streak = stats.longest_streak if stats else 0

        # Evaluate streak freshness for profile
        today = self.get_today_utc()
        if stats and stats.last_activity_date:
            if stats.last_activity_date < (today - timedelta(days=1)):
                current_streak = 0

        profile_stats = ProfileStats(
            total_xp=total_xp,
            current_streak=current_streak,
            longest_streak=longest_streak,
            completed_lessons=aggregates["completed_lessons"],
            completed_skills=aggregates["completed_skills"],
        )

        # Fetch all achievements catalog to include both unlocked and locked badges
        from app.models.achievement import Achievement
        from sqlalchemy import select
        all_catalog = db.execute(select(Achievement).order_by(Achievement.id.asc())).scalars().all()
        unlocked_by_code = {a["code"]: a for a in aggregates["achievements"]}

        achievements = []
        for ach in all_catalog:
            if ach.code in unlocked_by_code:
                u = unlocked_by_code[ach.code]
                achievements.append(
                    ProfileAchievement(
                        id=u["id"],
                        code=u["code"],
                        title=u["title"],
                        description=u["description"],
                        icon_key=u["icon_key"],
                        unlocked_at=u["unlocked_at"],
                        is_unlocked=True,
                    )
                )
            else:
                achievements.append(
                    ProfileAchievement(
                        id=ach.id,
                        code=ach.code,
                        title=ach.title,
                        description=ach.description,
                        icon_key=ach.icon_key,
                        unlocked_at=None,
                        is_unlocked=False,
                    )
                )

        return UserProfileResponse(
            id=user.id,
            username=user.username,
            avatar_key=user.avatar_key or "default",
            created_at=user.created_at,
            stats=profile_stats,
            achievements=achievements,
        )


user_service = UserService()
