from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.achievement import AchievementPublic
from app.services.achievement_service import achievement_service

router = APIRouter()


@router.get(
    "/achievements",
    response_model=List[AchievementPublic],
    summary="Get all achievement definitions",
)
def get_achievements(
    db: Session = Depends(get_db),
):
    """
    Return all available achievement badges and criteria.
    """
    return achievement_service.get_all_achievements(db)
