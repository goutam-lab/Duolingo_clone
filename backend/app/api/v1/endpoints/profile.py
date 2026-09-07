from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserProfileResponse
from app.services.user_service import user_service

router = APIRouter()


@router.get(
    "/profile/me",
    response_model=UserProfileResponse,
    summary="Get current user profile and stats",
)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return current authenticated user's profile, badges, and learning statistics.
    """
    return user_service.get_profile(db, user_id=current_user.id)


@router.get(
    "/profile/{user_id}",
    response_model=UserProfileResponse,
    summary="Get user public profile and stats",
)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Return user's public profile, badges, aggregate counts, and activity streak.
    """
    return user_service.get_profile(db, user_id=user_id)
