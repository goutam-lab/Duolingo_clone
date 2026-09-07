from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.models.course import Course
from app.models.unit import Unit
from app.models.skill import Skill
from app.models.lesson import Lesson


class CourseRepository:
    def get_course_by_id(self, db: Session, course_id: int) -> Optional[Course]:
        """Fetch course by ID."""
        stmt = select(Course).where(Course.id == course_id, Course.is_active.is_(True))
        return db.execute(stmt).scalar_one_or_none()

    def get_course_by_code(self, db: Session, code: str) -> Optional[Course]:
        """Fetch course by code."""
        stmt = select(Course).where(Course.code == code, Course.is_active.is_(True))
        return db.execute(stmt).scalar_one_or_none()

    def get_course_path(self, db: Session, course_id: int) -> Optional[Course]:
        """
        Fetch full course tree (Course -> Units -> Skills -> Lessons)
        using bounded batch queries via selectinload to completely avoid N+1 queries.
        """
        stmt = (
            select(Course)
            .where(Course.id == course_id, Course.is_active.is_(True))
            .options(
                selectinload(Course.units)
                .selectinload(Unit.skills)
                .selectinload(Skill.lessons)
            )
        )
        return db.execute(stmt).scalar_one_or_none()

    def get_lesson_with_exercises(self, db: Session, lesson_id: int) -> Optional[Lesson]:
        """
        Fetch a lesson and its ordered exercises in a single bounded batch load.
        """
        stmt = (
            select(Lesson)
            .where(Lesson.id == lesson_id)
            .options(
                selectinload(Lesson.exercises),
                selectinload(Lesson.skill),
            )
        )
        return db.execute(stmt).scalar_one_or_none()


course_repository = CourseRepository()
