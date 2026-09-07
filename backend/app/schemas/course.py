from typing import List, Optional, Literal
from pydantic import BaseModel, ConfigDict


class LessonPathResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    order_index: int
    xp_reward: int
    status: Literal["locked", "available", "completed"]
    is_completed: bool
    best_score: int
    attempts_count: int


class SkillProgressSummary(BaseModel):
    lessons_completed: int
    total_lessons: int
    progress_percentage: int
    crown_level: int


class SkillPathResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    icon_key: str
    node_type: str
    order_index: int
    status: Literal["locked", "available", "in_progress", "completed"]
    progress: SkillProgressSummary
    lessons: List[LessonPathResponse]


class UnitPathResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    order_index: int
    skills: List[SkillPathResponse]


class CourseSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    title: str
    source_language: str
    target_language: str


class CoursePathResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    course: CourseSummary
    units: List[UnitPathResponse]
