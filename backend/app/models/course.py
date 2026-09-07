from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.unit import Unit


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    source_language: Mapped[str] = mapped_column(String(50), nullable=False)
    target_language: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Cascading deletion to Units
    units: Mapped[List["Unit"]] = relationship(
        "Unit", back_populates="course", cascade="all, delete-orphan", order_by="Unit.order_index"
    )

    def __repr__(self) -> str:
        return f"<Course id={self.id} code='{self.code}' title='{self.title}'>"
