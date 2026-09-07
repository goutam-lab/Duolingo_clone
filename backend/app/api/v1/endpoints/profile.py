from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user, get_current_user_optional
from app.models.user import User
from app.schemas.user import UserProfileResponse
from app.services.user_service import user_service
from app.services.friendship_service import friendship_service

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
    profile = user_service.get_profile(db, user_id=current_user.id)
    profile.friendship_status = "self"
    profile.friendship_id = None
    return profile


@router.get(
    "/profile/{user_id}",
    response_model=UserProfileResponse,
    summary="Get user public profile and stats",
)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Return user's public profile, badges, aggregate counts, and activity streak.
    Email and authentication secrets are never included.
    """
    profile = user_service.get_profile(db, user_id=user_id)
    if current_user:
        rel, fid = friendship_service.relation_for(db, current_user.id, user_id)
        profile.friendship_status = rel
        profile.friendship_id = fid
    return profile
