from datetime import datetime
from typing import Any, List, TYPE_CHECKING
from sqlalchemy import Integer, String, Text, DateTime, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user_achievement import UserAchievement


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    icon_key: Mapped[str] = mapped_column(String(50), default="default", nullable=False)
    requirement_json: Mapped[Any] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user_achievements: Mapped[List["UserAchievement"]] = relationship(
        "UserAchievement", back_populates="achievement", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Achievement id={self.id} code='{self.code}' title='{self.title}'>"
