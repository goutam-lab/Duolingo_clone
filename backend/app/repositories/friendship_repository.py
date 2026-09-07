from typing import List, Optional
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session, joinedload
from app.models.friendship import Friendship
from app.models.user import User


class FriendshipRepository:
    def get_by_id(self, db: Session, friendship_id: int) -> Optional[Friendship]:
        return db.execute(
            select(Friendship).where(Friendship.id == friendship_id)
        ).scalar_one_or_none()

    def get_pair(self, db: Session, user_a_id: int, user_b_id: int) -> Optional[Friendship]:
        stmt = select(Friendship).where(
            or_(
                and_(
                    Friendship.requester_id == user_a_id,
                    Friendship.addressee_id == user_b_id,
                ),
                and_(
                    Friendship.requester_id == user_b_id,
                    Friendship.addressee_id == user_a_id,
                ),
            )
        )
        return db.execute(stmt).scalar_one_or_none()

    def list_accepted_for_user(self, db: Session, user_id: int) -> List[Friendship]:
        stmt = (
            select(Friendship)
            .where(
                Friendship.status == "accepted",
                or_(
                    Friendship.requester_id == user_id,
                    Friendship.addressee_id == user_id,
                ),
            )
            .options(
                joinedload(Friendship.requester).joinedload(User.stats),
                joinedload(Friendship.addressee).joinedload(User.stats),
            )
            .order_by(Friendship.updated_at.desc())
        )
        return list(db.execute(stmt).unique().scalars().all())

    def list_incoming(self, db: Session, user_id: int) -> List[Friendship]:
        stmt = (
            select(Friendship)
            .where(
                Friendship.addressee_id == user_id,
                Friendship.status == "pending",
            )
            .options(joinedload(Friendship.requester).joinedload(User.stats))
            .order_by(Friendship.created_at.desc())
        )
        return list(db.execute(stmt).unique().scalars().all())

    def list_outgoing(self, db: Session, user_id: int) -> List[Friendship]:
        stmt = (
            select(Friendship)
            .where(
                Friendship.requester_id == user_id,
                Friendship.status == "pending",
            )
            .options(joinedload(Friendship.addressee).joinedload(User.stats))
            .order_by(Friendship.created_at.desc())
        )
        return list(db.execute(stmt).unique().scalars().all())

    def search_users(
        self, db: Session, query: str, exclude_user_id: int, limit: int = 20
    ) -> List[User]:
        pattern = f"%{query.strip().lower()}%"
        stmt = (
            select(User)
            .where(
                User.is_active.is_(True),
                User.id != exclude_user_id,
                func.lower(User.username).like(pattern),
            )
            .options(joinedload(User.stats))
            .order_by(User.username.asc())
            .limit(limit)
        )
        return list(db.execute(stmt).unique().scalars().all())

    def get_user(self, db: Session, user_id: int) -> Optional[User]:
        return db.execute(
            select(User).where(User.id == user_id).options(joinedload(User.stats))
        ).unique().scalar_one_or_none()


friendship_repository = FriendshipRepository()
