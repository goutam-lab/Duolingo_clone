from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.unit import Unit
    from app.models.lesson import Lesson
    from app.models.skill_progress import SkillProgress


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    unit_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("units.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    icon_key: Mapped[str] = mapped_column(String(50), default="default", nullable=False)
    node_type: Mapped[str] = mapped_column(String(20), default="skill", nullable=False)
    total_lessons: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("unit_id", "order_index", name="uq_skills_unit_order"),
    )

    # Relationships
    unit: Mapped["Unit"] = relationship("Unit", back_populates="skills")
    lessons: Mapped[List["Lesson"]] = relationship(
        "Lesson", back_populates="skill", cascade="all, delete-orphan", order_by="Lesson.order_index"
    )
    progress_records: Mapped[List["SkillProgress"]] = relationship(
        "SkillProgress", back_populates="skill", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Skill id={self.id} unit_id={self.unit_id} title='{self.title}' order={self.order_index}>"
