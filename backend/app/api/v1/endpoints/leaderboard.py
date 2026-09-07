from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
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
    db: Session = Depends(get_db),
):
    """
    Return leaderboard sorted by total_xp DESC with indexed database ordering.
    """
    return leaderboard_service.get_leaderboard(db, limit=limit)
