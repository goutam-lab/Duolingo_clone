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


class LessonAttemptStartResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    attempt_id: int
    lesson_id: int
    started_at: str
    hearts_remaining: int


class ExerciseAnswerRequest(BaseModel):
    exercise_id: int
    answer: Any


class ExerciseAnswerResponse(BaseModel):
    is_correct: bool
    feedback: str
    hearts_remaining: int
    exercise_completed: bool
    correct_answer: Optional[Any] = None


class LessonCompleteSkillSummary(BaseModel):
    lessons_completed: int
    total_lessons: int
    crown_level: int


class LessonCompleteStreakSummary(BaseModel):
    current: int
    longest: int


class LessonCompleteDailyGoalSummary(BaseModel):
    progress: int
    goal: int
    completed: bool


class LessonCompleteResponse(BaseModel):
    completed: bool
    xp_earned: int
    total_xp: int
    score: int
    hearts_remaining: int
    skill_progress: LessonCompleteSkillSummary
    streak: LessonCompleteStreakSummary
    daily_goal: LessonCompleteDailyGoalSummary
    new_achievements: List[str] = []

