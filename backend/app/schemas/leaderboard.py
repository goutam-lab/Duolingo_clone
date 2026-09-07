from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class LeaderboardEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rank: int
    user_id: int
    username: str
    avatar_key: Optional[str] = "default"
    total_xp: int
    xp: int


class LeaderboardUnlockInfo(BaseModel):
    required_lessons: int = 1
    completed_lessons: int = 0
    is_unlocked: bool = False


class LeaderboardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    entries: List[LeaderboardEntry]
    total_count: Optional[int] = None
    unlock: LeaderboardUnlockInfo
