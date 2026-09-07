from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.user_repository import user_repository
from app.schemas.leaderboard import (
    LeaderboardResponse,
    LeaderboardEntry,
    LeaderboardUnlockInfo,
)

REQUIRED_LESSONS_TO_UNLOCK = 3


class LeaderboardService:
    def get_leaderboard(
        self,
        db: Session,
        current_user_id: Optional[int],
        limit: int = 100,
        league: Optional[str] = None,
    ) -> LeaderboardResponse:
        """
        Fetch top users sorted by total_xp DESC with database-level ordering and limit.
        Computes deterministic 1-indexed ranks. Includes unlock status for the
        calling user: leaderboard is only accessible once the calling user has
        completed REQUIRED_LESSONS_TO_UNLOCK lessons.

        The `league` parameter is accepted for future use but does not filter
        results at this stage.
        """
        completed_lessons = 0
        is_unlocked = False

        if current_user_id is not None:
            completed_lessons = user_repository.count_completed_lessons(
                db, current_user_id
            )
            is_unlocked = completed_lessons >= REQUIRED_LESSONS_TO_UNLOCK
        else:
            # Unauthenticated / public access: leaderboard is always visible
            is_unlocked = True

        entries: List[LeaderboardEntry] = []
        if is_unlocked:
            rows = user_repository.get_leaderboard(db, limit=limit)
            for rank, (user, stats) in enumerate(rows, start=1):
                total_xp = stats.total_xp if stats else 0
                entries.append(
                    LeaderboardEntry(
                        rank=rank,
                        user_id=user.id,
                        username=user.username,
                        avatar_key=user.avatar_key or "default",
                        total_xp=total_xp,
                        xp=total_xp,
                    )
                )

        unlock = LeaderboardUnlockInfo(
            required_lessons=REQUIRED_LESSONS_TO_UNLOCK,
            completed_lessons=completed_lessons,
            is_unlocked=is_unlocked,
        )

        return LeaderboardResponse(
            entries=entries,
            total_count=len(entries),
            unlock=unlock,
        )


leaderboard_service = LeaderboardService()
