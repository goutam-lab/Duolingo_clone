from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict


class AchievementPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    title: str
    description: str
    icon_key: str
    requirement_json: Any


class UserAchievementPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    achievement_id: int
    code: str
    title: str
    description: str
    icon_key: str
    unlocked_at: datetime
