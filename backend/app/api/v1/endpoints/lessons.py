from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.lesson import LessonDetailResponse
from app.services.lesson_service import lesson_service

router = APIRouter()


@router.get(
    "/lessons/{lesson_id}",
    response_model=LessonDetailResponse,
    summary="Get lesson metadata and safe exercises",
)
def get_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    """
    Fetch a lesson and its ordered exercises.
    STRICT SECURITY: Authoritative answer keys and validation metadata are stripped.
    """
    return lesson_service.get_lesson(db, lesson_id=lesson_id)
