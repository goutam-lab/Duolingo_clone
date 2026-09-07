from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User


def get_current_user(
    db: Session = Depends(get_db),
    x_user_id: Optional[int] = Header(default=None, alias="X-User-Id"),
) -> User:
    """
    Centralized current user dependency abstraction.
    Allows header-based user switching for testing/demonstration,
    falling back to the default seeded 'learner'.
    """
    if x_user_id is not None:
        user = db.execute(select(User).where(User.id == x_user_id, User.is_active.is_(True))).scalar_one_or_none()
        if user:
            return user
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {x_user_id} not found.",
        )

    # Fallback to the default seeded learner
    user = db.execute(select(User).where(User.username == "learner", User.is_active.is_(True))).scalar_one_or_none()
    if user:
        return user

    # Fallback to any active user if learner is not yet seeded
    user = db.execute(select(User).where(User.is_active.is_(True)).order_by(User.id)).scalars().first()
    if user:
        return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No active development user found. Please run seed script.",
    )
