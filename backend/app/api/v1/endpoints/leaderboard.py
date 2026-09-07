from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.leaderboard import LeaderboardResponse
from app.services.leaderboard_service import leaderboard_service

router = APIRouter()


@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_leaderboard(
    limit: int = 50,
    league: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: Optional[User] = Depends(deps.get_current_user_optional),
):
    """
    Retrieve the current league leaderboard with ranked learners and current user highlight.
    Leaderboard is unlocked after completing the required number of lessons.
    """
    return leaderboard_service.get_leaderboard(
        db=db,
        current_user_id=current_user.id if current_user else None,
        limit=limit,
        league=league,
    )