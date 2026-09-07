from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.skill import Skill


class SkillProgress(Base):
    __tablename__ = "skill_progress"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    skill_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False
    )
    lessons_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    crown_level: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_xp_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    best_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "skill_id", name="uq_skill_progress_user_skill"),
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="skill_progress")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="progress_records")

    def __repr__(self) -> str:
        return f"<SkillProgress id={self.id} user_id={self.user_id} skill_id={self.skill_id} completed={self.lessons_completed}>"
