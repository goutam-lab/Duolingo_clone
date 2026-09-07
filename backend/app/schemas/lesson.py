from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ExercisePublic(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    type: str
    prompt: str
    question_data: Any = Field(..., validation_alias="question_data_json", serialization_alias="question_data")
    order_index: int

    # STRICT SECURITY: answer_data_json is explicitly excluded from public response


class LessonDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    order_index: int
    xp_reward: int
    estimated_seconds: int
    skill_id: int
    skill_title: Optional[str] = None
    exercises: List[ExercisePublic]
