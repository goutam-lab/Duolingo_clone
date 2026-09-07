from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, Boolean, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.lesson import Lesson


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    lesson_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False
    )
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    attempts_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    best_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_attempt_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "lesson_id", name="uq_lesson_progress_user_lesson"),
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="lesson_progress")
    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="progress_records")

    def __repr__(self) -> str:
        return f"<LessonProgress id={self.id} user_id={self.user_id} lesson_id={self.lesson_id} completed={self.is_completed}>"
