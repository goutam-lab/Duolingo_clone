from datetime import datetime, date
from typing import TYPE_CHECKING
from sqlalchemy import Integer, DateTime, Date, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class DailyActivity(Base):
    __tablename__ = "daily_activity"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    activity_date: Mapped[date] = mapped_column(Date, nullable=False)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    lessons_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    exercises_answered: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "activity_date", name="uq_daily_activity_user_date"),
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="daily_activities")

    def __repr__(self) -> str:
        return f"<DailyActivity id={self.id} user_id={self.user_id} date={self.activity_date} xp={self.xp_earned}>"
