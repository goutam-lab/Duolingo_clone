from typing import List
from sqlalchemy.orm import Session
from app.repositories.user_repository import user_repository
from app.schemas.leaderboard import LeaderboardResponse, LeaderboardEntry


class LeaderboardService:
    def get_leaderboard(self, db: Session, limit: int = 100) -> LeaderboardResponse:
        """
        Fetch top users sorted by total_xp DESC with database-level ordering and limit.
        Computes deterministic 1-indexed ranks.
        """
        rows = user_repository.get_leaderboard(db, limit=limit)

        entries: List[LeaderboardEntry] = []
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

        return LeaderboardResponse(entries=entries, total_count=len(entries))


leaderboard_service = LeaderboardService()
