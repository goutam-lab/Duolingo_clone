from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.course_repository import course_repository
from app.schemas.lesson import LessonDetailResponse, ExercisePublic


class LessonService:
    def get_lesson(self, db: Session, lesson_id: int) -> LessonDetailResponse:
        """
        Fetch a lesson and its ordered exercises safely.
        STRICT SECURITY: Never returns answer_data_json or authoritative answers.
        """
        lesson = course_repository.get_lesson_with_exercises(db, lesson_id)
        if not lesson or not lesson.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lesson with ID {lesson_id} not found or is inactive.",
            )

        # Sort exercises deterministically by order_index
        sorted_exercises = sorted(lesson.exercises, key=lambda e: e.order_index)

        exercises_public = [
            ExercisePublic(
                id=ex.id,
                type=ex.type,
                prompt=ex.prompt,
                question_data=ex.question_data_json,
                order_index=ex.order_index,
            )
            for ex in sorted_exercises
        ]

        return LessonDetailResponse(
            id=lesson.id,
            title=lesson.title,
            order_index=lesson.order_index,
            xp_reward=lesson.xp_reward,
            estimated_seconds=lesson.estimated_seconds,
            skill_id=lesson.skill_id,
            skill_title=lesson.skill.title if lesson.skill else None,
            exercises=exercises_public,
        )


lesson_service = LessonService()
