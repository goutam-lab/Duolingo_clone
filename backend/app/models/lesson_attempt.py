from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Integer, Boolean, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.lesson import Lesson
    from app.models.exercise_attempt import ExerciseAttempt


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    lesson_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    hearts_lost: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    __table_args__ = (
        Index("ix_lesson_attempts_user_lesson_started", "user_id", "lesson_id", "started_at"),
        Index("ix_lesson_attempts_user_started", "user_id", "started_at"),
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="lesson_attempts")
    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="attempts")
    exercise_attempts: Mapped[List["ExerciseAttempt"]] = relationship(
        "ExerciseAttempt", back_populates="lesson_attempt", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<LessonAttempt id={self.id} user_id={self.user_id} lesson_id={self.lesson_id} completed={self.is_completed}>"
