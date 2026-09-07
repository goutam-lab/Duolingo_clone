from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserMeResponse, HeartRefillResponse, UserSettingsUpdate
from app.schemas.achievement import UserAchievementPublic
from app.services.user_service import user_service
from app.services.achievement_service import achievement_service

router = APIRouter()


@router.get("/me", response_model=UserMeResponse, summary="Get current authenticated user")
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return consolidated current user state including XP, streak, hearts, gems,
    and daily goal progress. Applies date rollover and streak evaluation ephemerally.
    """
    return user_service.get_me(db, current_user)


@router.patch("/me/settings", response_model=UserMeResponse, summary="Update current user settings")
def update_settings(
    payload: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update preferences such as daily goal XP and avatar key.
    """
    return user_service.update_settings(db, current_user, payload)


@router.post("/me/refill-hearts", response_model=HeartRefillResponse, summary="Refill user hearts")
def refill_hearts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Refill current user's hearts to maximum (backend authoritative).
    """
    return user_service.refill_hearts(db, current_user)


@router.get(
    "/me/achievements",
    response_model=List[UserAchievementPublic],
    summary="Get user's unlocked achievements",
)
def get_my_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return list of achievements unlocked by the current user.
    """
    return achievement_service.get_user_achievements(db, current_user.id)
