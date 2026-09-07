from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user_stats import UserStats
    from app.models.skill_progress import SkillProgress
    from app.models.lesson_progress import LessonProgress
    from app.models.lesson_attempt import LessonAttempt
    from app.models.daily_activity import DailyActivity
    from app.models.user_achievement import UserAchievement
    from app.models.friendship import Friendship


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    avatar_key: Mapped[Optional[str]] = mapped_column(String(100), default="default", nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    experience_level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    selected_course_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships with cascading deletion for user-owned state
    stats: Mapped[Optional["UserStats"]] = relationship(
        "UserStats", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    skill_progress: Mapped[List["SkillProgress"]] = relationship(
        "SkillProgress", back_populates="user", cascade="all, delete-orphan"
    )
    lesson_progress: Mapped[List["LessonProgress"]] = relationship(
        "LessonProgress", back_populates="user", cascade="all, delete-orphan"
    )
    lesson_attempts: Mapped[List["LessonAttempt"]] = relationship(
        "LessonAttempt", back_populates="user", cascade="all, delete-orphan"
    )
    daily_activities: Mapped[List["DailyActivity"]] = relationship(
        "DailyActivity", back_populates="user", cascade="all, delete-orphan"
    )
    achievements: Mapped[List["UserAchievement"]] = relationship(
        "UserAchievement", back_populates="user", cascade="all, delete-orphan"
    )
    sent_friendships: Mapped[List["Friendship"]] = relationship(
        "Friendship",
        foreign_keys="Friendship.requester_id",
        back_populates="requester",
        cascade="all, delete-orphan",
    )
    received_friendships: Mapped[List["Friendship"]] = relationship(
        "Friendship",
        foreign_keys="Friendship.addressee_id",
        back_populates="addressee",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} username='{self.username}'>"
