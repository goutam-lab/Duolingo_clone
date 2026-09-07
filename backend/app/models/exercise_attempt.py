from datetime import datetime
from typing import Any, TYPE_CHECKING
from sqlalchemy import Integer, Boolean, DateTime, ForeignKey, Index, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.lesson_attempt import LessonAttempt
    from app.models.exercise import Exercise


class ExerciseAttempt(Base):
    __tablename__ = "exercise_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lesson_attempt_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("lesson_attempts.id", ondelete="CASCADE"), nullable=False
    )
    exercise_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("exercises.id", ondelete="CASCADE"), nullable=False
    )
    answer_data_json: Mapped[Any] = mapped_column(JSON, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    answered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_exercise_attempts_attempt_exercise", "lesson_attempt_id", "exercise_id"),
        Index("ix_exercise_attempts_exercise_id", "exercise_id"),
    )

    # Relationships
    lesson_attempt: Mapped["LessonAttempt"] = relationship("LessonAttempt", back_populates="exercise_attempts")
    exercise: Mapped["Exercise"] = relationship("Exercise", back_populates="attempts")

    def __repr__(self) -> str:
        return f"<ExerciseAttempt id={self.id} attempt_id={self.lesson_attempt_id} exercise_id={self.exercise_id} correct={self.is_correct}>"
