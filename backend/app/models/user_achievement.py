from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.achievement import Achievement


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    achievement_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False
    )
    unlocked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="uq_user_achievements_user_achievement"),
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="achievements")
    achievement: Mapped["Achievement"] = relationship("Achievement", back_populates="user_achievements")

    def __repr__(self) -> str:
        return f"<UserAchievement id={self.id} user_id={self.user_id} achievement_id={self.achievement_id}>"
