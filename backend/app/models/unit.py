from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.skill import Skill


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("course_id", "order_index", name="uq_units_course_order"),
    )

    # Relationships
    course: Mapped["Course"] = relationship("Course", back_populates="units")
    skills: Mapped[List["Skill"]] = relationship(
        "Skill", back_populates="unit", cascade="all, delete-orphan", order_by="Skill.order_index"
    )

    def __repr__(self) -> str:
        return f"<Unit id={self.id} course_id={self.course_id} title='{self.title}' order={self.order_index}>"
