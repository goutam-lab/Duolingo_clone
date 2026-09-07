from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.course import CoursePathResponse
from app.services.course_path_service import course_path_service

router = APIRouter()


@router.get(
    "/courses/{course_id}/path",
    response_model=CoursePathResponse,
    summary="Get complete learning path for course",
)
def get_course_path(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return complete course hierarchy (Course -> Units -> Skills -> Lessons)
    along with current user's unlock statuses and progress metrics.
    Completely avoids N+1 queries.
    """
    return course_path_service.get_course_path(db, course_id=course_id, user_id=current_user.id)
