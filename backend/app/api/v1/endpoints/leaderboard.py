from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.leaderboard import LeaderboardResponse
from app.services.leaderboard_service import leaderboard_service

router = APIRouter()


@router.get(
    "/leaderboard",
    response_model=LeaderboardResponse,
    summary="Get XP leaderboard rankings",
)
def get_leaderboard(
    limit: int = Query(default=100, ge=1, le=100, description="Max entries to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return leaderboard sorted by total_xp DESC with indexed database ordering.
    Requires authentication. Only users who have completed at least 1 lesson
    appear in the rankings, and the leaderboard is hidden until the caller
    completes the required threshold.
    """
    return leaderboard_service.get_leaderboard(db, current_user, limit=limit)
