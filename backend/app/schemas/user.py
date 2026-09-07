from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class UserStatsPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_xp: int
    current_streak: int
    longest_streak: int
    hearts: int
    max_hearts: int
    gems: int
    daily_goal_xp: int
    daily_goal_progress: int
    last_activity_date: Optional[date] = None


class UserMeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    avatar_key: Optional[str] = "default"
    total_xp: int
    current_streak: int
    longest_streak: int
    hearts: int
    max_hearts: int
    gems: int
    daily_goal_xp: int
    daily_goal_progress: int
    completed_lessons: int = 0
    onboarding_completed: bool = False
    experience_level: Optional[str] = None
    selected_course_id: Optional[int] = None
    stats: UserStatsPublic


class ProfileStats(BaseModel):
    total_xp: int
    current_streak: int
    longest_streak: int
    completed_lessons: int
    completed_skills: int


class ProfileAchievement(BaseModel):
    id: int
    code: str
    title: str
    description: str
    icon_key: str
    unlocked_at: Optional[datetime] = None
    is_unlocked: bool = True


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    avatar_key: Optional[str] = "default"
    created_at: datetime
    stats: ProfileStats
    achievements: List[ProfileAchievement] = []
    friendship_status: Optional[str] = None
    friendship_id: Optional[int] = None


class HeartRefillResponse(BaseModel):
    hearts: int
    max_hearts: int
    message: str = "Hearts refilled successfully"


class UserSettingsUpdate(BaseModel):
    daily_goal_xp: Optional[int] = None
    avatar_key: Optional[str] = None
