from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.lesson import (
    LessonDetailResponse,
    LessonAttemptStartResponse,
    ExerciseAnswerRequest,
    ExerciseAnswerResponse,
    LessonCompleteResponse,
)
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


@router.post(
    "/lessons/{lesson_id}/attempts",
    response_model=LessonAttemptStartResponse,
    summary="Start an authoritative lesson attempt",
)
def start_lesson_attempt(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Start a new lesson attempt for the authenticated user.
    Enforces sequential progression and heart limits.
    """
    return lesson_service.start_lesson_attempt(
        db, user=current_user, lesson_id=lesson_id
    )


@router.post(
    "/lessons/{lesson_id}/attempts/{attempt_id}/answers",
    response_model=ExerciseAnswerResponse,
    summary="Submit an exercise answer for server validation",
)
def submit_exercise_answer(
    lesson_id: int,
    attempt_id: int,
    payload: ExerciseAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit an exercise answer to be evaluated by the backend authority.
    Deducts a heart upon incorrect submission (floor at 0).
    """
    return lesson_service.submit_exercise_answer(
        db,
        user=current_user,
        lesson_id=lesson_id,
        attempt_id=attempt_id,
        payload=payload,
    )


@router.post(
    "/lessons/{lesson_id}/attempts/{attempt_id}/complete",
    response_model=LessonCompleteResponse,
    summary="Complete a lesson attempt and award XP",
)
def complete_lesson(
    lesson_id: int,
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Complete an active lesson attempt.
    Transactionally updates score, XP, streak, daily goal, progress, and achievements.
    Idempotent against duplicate requests.
    """
    return lesson_service.complete_lesson_attempt(
        db, user=current_user, lesson_id=lesson_id, attempt_id=attempt_id
    )
