from datetime import datetime, date
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Integer, DateTime, Date, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class UserStats(Base):
    __tablename__ = "user_stats"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    total_xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_activity_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    hearts: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    max_hearts: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    gems: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    daily_goal_xp: Mapped[int] = mapped_column(Integer, default=20, nullable=False)
    daily_goal_progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    daily_goal_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_user_stats_total_xp", "total_xp"),
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="stats")

    def __repr__(self) -> str:
        return f"<UserStats user_id={self.user_id} total_xp={self.total_xp} streak={self.current_streak} hearts={self.hearts}>"
