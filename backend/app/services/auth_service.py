from fastapi import HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.user_stats import UserStats
from app.models.course import Course
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import (
    UserSignupRequest,
    UserLoginRequest,
    OnboardingRequest,
    AuthResponse,
    UserPublic,
)


class AuthService:
    def signup(self, db: Session, request: UserSignupRequest) -> tuple[User, str]:
        """
        Create a new user and initial UserStats atomically within a transaction.
        Returns the created User model and generated JWT access token string.
        """
        # 1. Check uniqueness of username
        existing_username = db.execute(
            select(User).where(User.username == request.username)
        ).scalar_one_or_none()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this username already exists.",
            )

        # 2. Check uniqueness of email
        existing_email = db.execute(
            select(User).where(User.email == request.email)
        ).scalar_one_or_none()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email address already exists.",
            )

        # 3. Transactional atomic creation of User + UserStats
        try:
            user = User(
                username=request.username,
                email=request.email,
                password_hash=hash_password(request.password),
                avatar_key="default",
                is_active=True,
                onboarding_completed=False,
                experience_level=None,
                selected_course_id=None,
            )
            db.add(user)
            db.flush()  # Generate user.id

            stats = UserStats(
                user_id=user.id,
                total_xp=0,
                current_streak=0,
                longest_streak=0,
                hearts=5,
                max_hearts=5,
                gems=100,
                daily_goal_xp=20,
                daily_goal_progress=0,
            )
            db.add(stats)
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to register user account. Please try again.",
            ) from e

        access_token = create_access_token(user.id)
        return user, access_token

    def login(self, db: Session, request: UserLoginRequest) -> tuple[User, str]:
        """
        Authenticate user by username or email and password.
        Returns the authenticated User model and generated JWT access token string.
        """
        identifier = request.username_or_email.strip()

        stmt = select(User).where(
            or_(User.username == identifier, User.email == identifier.lower())
        )
        user = db.execute(stmt).scalar_one_or_none()

        # Reject nonexistent user or missing password hash
        if not user or not user.password_hash:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials. Please verify your username/email and password.",
            )

        # Verify password securely against stored hash
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials. Please verify your username/email and password.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deactivated.",
            )

        access_token = create_access_token(user.id)
        return user, access_token

    def complete_onboarding(
        self, db: Session, user_id: int, request: OnboardingRequest
    ) -> User:
        """
        Persist first-time onboarding selections: target course, daily goal, experience level.
        Marks onboarding_completed = True.
        """
        user = db.execute(
            select(User).where(User.id == user_id, User.is_active.is_(True))
        ).scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found.",
            )

        # Validate course existence
        course = db.execute(
            select(Course).where(Course.id == request.course_id, Course.is_active.is_(True))
        ).scalar_one_or_none()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with ID {request.course_id} not found.",
            )

        user.selected_course_id = request.course_id
        user.experience_level = request.experience_level
        user.onboarding_completed = True

        # Update or create user stats with selected daily goal
        if user.stats:
            user.stats.daily_goal_xp = request.daily_goal_xp
        else:
            stats = UserStats(
                user_id=user.id,
                daily_goal_xp=request.daily_goal_xp,
            )
            db.add(stats)

        db.commit()
        db.refresh(user)
        return user



auth_service = AuthService()
