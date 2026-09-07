from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.core.config import settings
from app.core.security import create_access_token
from app.services.auth_service import auth_service
from app.schemas.auth import (
    UserSignupRequest,
    UserLoginRequest,
    OnboardingRequest,
    AuthResponse,
    UserPublic,
)

router = APIRouter()


def _set_auth_cookie(response: Response, token: str) -> None:
    """Helper to attach secure HttpOnly session cookie."""
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,  # False for local HTTP development
        path="/",
    )


@router.post(
    "/auth/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def signup(
    payload: UserSignupRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    """
    Atomically registers a new user with hashed password and initialized UserStats.
    Returns JWT access token and sets an HttpOnly session cookie.
    """
    user, token = auth_service.signup(db, payload)
    _set_auth_cookie(response, token)

    return AuthResponse(
        user=UserPublic.model_validate(user),
        access_token=token,
        token_type="bearer",
        onboarding_completed=user.onboarding_completed,
        message="Registration successful.",
    )


@router.post(
    "/auth/login",
    response_model=AuthResponse,
    summary="Authenticate with username/email and password",
)
def login(
    payload: UserLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    """
    Authenticates user credentials against the stored bcrypt hash.
    Returns JWT access token and sets an HttpOnly session cookie.
    """
    user, token = auth_service.login(db, payload)
    _set_auth_cookie(response, token)

    return AuthResponse(
        user=UserPublic.model_validate(user),
        access_token=token,
        token_type="bearer",
        onboarding_completed=user.onboarding_completed,
        message="Login successful.",
    )


@router.post(
    "/auth/logout",
    summary="Clear authentication session cookie",
)
def logout(response: Response):
    """Clears the HttpOnly access_token cookie."""
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logged out successfully."}


@router.get(
    "/auth/me",
    response_model=UserPublic,
    summary="Get authenticated user profile and onboarding status",
)
def get_auth_me(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user details and onboarding state."""
    return UserPublic.model_validate(current_user)


@router.post(
    "/auth/onboarding",
    response_model=UserPublic,
    summary="Complete first-time user onboarding",
)
def complete_onboarding(
    payload: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Updates user onboarding state, selected course, experience level,
    and daily XP goal.
    """
    user = auth_service.complete_onboarding(db, user_id=current_user.id, request=payload)
    return UserPublic.model_validate(user)

