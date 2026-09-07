from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserSignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username between 3 and 50 characters")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, max_length=128, description="Password min 6 characters")

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        clean = v.strip()
        if not clean.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username may only contain letters, numbers, hyphens, and underscores.")
        return clean

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class UserLoginRequest(BaseModel):
    username_or_email: str = Field(..., min_length=1, description="Username or email address")
    password: str = Field(..., min_length=1, description="Account password")


class OnboardingRequest(BaseModel):
    course_id: int = Field(..., description="Selected course ID")
    daily_goal_xp: int = Field(default=20, ge=5, le=100, description="Target daily XP goal (e.g., 10, 20, 30)")
    experience_level: Literal["beginner", "intermediate", "advanced"] = Field(
        default="beginner", description="Prior language familiarity"
    )


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    avatar_key: Optional[str] = "default"
    onboarding_completed: bool
    experience_level: Optional[str] = None
    selected_course_id: Optional[int] = None
    is_active: bool


class AuthResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user: UserPublic
    access_token: str
    token_type: str = "bearer"
    onboarding_completed: bool
    message: str = "Authentication successful"
