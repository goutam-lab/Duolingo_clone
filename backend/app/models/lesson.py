from datetime import datetime
from typing import List, TYPE_CHECKING
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.skill import Skill
    from app.models.exercise import Exercise
    from app.models.lesson_progress import LessonProgress
    from app.models.lesson_attempt import LessonAttempt


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    skill_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    xp_reward: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    estimated_seconds: Mapped[int] = mapped_column(Integer, default=180, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("skill_id", "order_index", name="uq_lessons_skill_order"),
    )

    # Relationships
    skill: Mapped["Skill"] = relationship("Skill", back_populates="lessons")
    exercises: Mapped[List["Exercise"]] = relationship(
        "Exercise", back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order_index"
    )
    progress_records: Mapped[List["LessonProgress"]] = relationship(
        "LessonProgress", back_populates="lesson", cascade="all, delete-orphan"
    )
    attempts: Mapped[List["LessonAttempt"]] = relationship(
        "LessonAttempt", back_populates="lesson", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Lesson id={self.id} skill_id={self.skill_id} title='{self.title}' order={self.order_index}>"
