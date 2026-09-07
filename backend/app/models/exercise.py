from datetime import datetime
from typing import Any, List, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.lesson import Lesson
    from app.models.exercise_attempt import ExerciseAttempt


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lesson_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    type: Mapped[str] = mapped_column(String(30), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    question_data_json: Mapped[Any] = mapped_column(JSON, nullable=False)
    answer_data_json: Mapped[Any] = mapped_column(JSON, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("lesson_id", "order_index", name="uq_exercises_lesson_order"),
    )

    # Relationships
    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="exercises")
    attempts: Mapped[List["ExerciseAttempt"]] = relationship(
        "ExerciseAttempt", back_populates="exercise", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Exercise id={self.id} lesson_id={self.lesson_id} type='{self.type}' order={self.order_index}>"
