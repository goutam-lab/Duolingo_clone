from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.friendship import Friendship
from app.models.user import User
from app.repositories.friendship_repository import friendship_repository
from app.schemas.friendship import (
    FriendRequestCreate,
    FriendRequestsResponse,
    FriendshipRecord,
    FriendsListResponse,
    FriendUserPublic,
    UserSearchResponse,
    UserSearchResult,
    ViewerRelation,
)


class FriendshipService:
    def _public_user(self, user: User) -> FriendUserPublic:
        stats = user.stats
        return FriendUserPublic(
            id=user.id,
            username=user.username,
            avatar_key=user.avatar_key or "default",
            total_xp=stats.total_xp if stats else 0,
            current_streak=stats.current_streak if stats else 0,
        )

    def _other_user(self, friendship: Friendship, viewer_id: int) -> User:
        if friendship.requester_id == viewer_id:
            return friendship.addressee
        return friendship.requester

    def _to_record(self, friendship: Friendship, viewer_id: int) -> FriendshipRecord:
        other = self._other_user(friendship, viewer_id)
        return FriendshipRecord(
            id=friendship.id,
            status=friendship.status,  # type: ignore[arg-type]
            created_at=friendship.created_at,
            user=self._public_user(other),
        )

    def relation_for(
        self, db: Session, viewer_id: int, other_id: int
    ) -> tuple[ViewerRelation, Optional[int]]:
        if viewer_id == other_id:
            return "self", None
        pair = friendship_repository.get_pair(db, viewer_id, other_id)
        if not pair:
            return "none", None
        if pair.status == "accepted":
            return "friends", pair.id
        if pair.status == "pending":
            if pair.requester_id == viewer_id:
                return "outgoing", pair.id
            return "incoming", pair.id
        return "none", pair.id

    def list_friends(self, db: Session, user: User) -> FriendsListResponse:
        rows = friendship_repository.list_accepted_for_user(db, user.id)
        return FriendsListResponse(
            friends=[self._to_record(row, user.id) for row in rows]
        )

    def list_requests(self, db: Session, user: User) -> FriendRequestsResponse:
        incoming = friendship_repository.list_incoming(db, user.id)
        outgoing = friendship_repository.list_outgoing(db, user.id)
        return FriendRequestsResponse(
            incoming=[self._to_record(row, user.id) for row in incoming],
            outgoing=[self._to_record(row, user.id) for row in outgoing],
        )

    def search_users(self, db: Session, user: User, query: str) -> UserSearchResponse:
        q = (query or "").strip()
        if len(q) < 1:
            return UserSearchResponse(results=[])
        found = friendship_repository.search_users(db, q, exclude_user_id=user.id)
        results: list[UserSearchResult] = []
        for other in found:
            rel, fid = self.relation_for(db, user.id, other.id)
            stats = other.stats
            results.append(
                UserSearchResult(
                    id=other.id,
                    username=other.username,
                    avatar_key=other.avatar_key or "default",
                    total_xp=stats.total_xp if stats else 0,
                    friendship_status=rel,
                    friendship_id=fid,
                )
            )
        return UserSearchResponse(results=results)

    def send_request(
        self, db: Session, user: User, payload: FriendRequestCreate
    ) -> FriendshipRecord:
        if payload.user_id == user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot send a friend request to yourself.",
            )

        target = friendship_repository.get_user(db, payload.user_id)
        if not target or not target.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        existing = friendship_repository.get_pair(db, user.id, target.id)
        if existing:
            if existing.status == "accepted":
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="You are already friends.",
                )
            if existing.status == "pending":
                if existing.requester_id == user.id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Friend request already pending.",
                    )
                existing.status = "accepted"
                db.commit()
                db.refresh(existing)
                existing.requester = existing.requester or friendship_repository.get_user(
                    db, existing.requester_id
                )
                existing.addressee = existing.addressee or target
                return self._to_record(existing, user.id)

            existing.requester_id = user.id
            existing.addressee_id = target.id
            existing.status = "pending"
            db.commit()
            db.refresh(existing)
            existing.addressee = target
            existing.requester = user
            return self._to_record(existing, user.id)

        friendship = Friendship(
            requester_id=user.id,
            addressee_id=target.id,
            status="pending",
        )
        db.add(friendship)
        db.commit()
        db.refresh(friendship)
        friendship.addressee = target
        friendship.requester = user
        return self._to_record(friendship, user.id)

    def accept_request(self, db: Session, user: User, request_id: int) -> FriendshipRecord:
        friendship = friendship_repository.get_by_id(db, request_id)
        if not friendship:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")
        if friendship.addressee_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot accept this request.",
            )
        if friendship.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This request is no longer pending.",
            )
        friendship.status = "accepted"
        db.commit()
        db.refresh(friendship)
        friendship.requester = friendship_repository.get_user(db, friendship.requester_id)
        friendship.addressee = user
        return self._to_record(friendship, user.id)

    def reject_request(self, db: Session, user: User, request_id: int) -> FriendshipRecord:
        friendship = friendship_repository.get_by_id(db, request_id)
        if not friendship:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")
        if friendship.addressee_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot reject this request.",
            )
        if friendship.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This request is no longer pending.",
            )
        friendship.status = "rejected"
        db.commit()
        db.refresh(friendship)
        friendship.requester = friendship_repository.get_user(db, friendship.requester_id)
        friendship.addressee = user
        return self._to_record(friendship, user.id)

    def unfriend(self, db: Session, user: User, other_user_id: int) -> None:
        if other_user_id == user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot unfriend yourself.",
            )
        friendship = friendship_repository.get_pair(db, user.id, other_user_id)
        if not friendship or friendship.status != "accepted":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Friendship not found.",
            )
        db.delete(friendship)
        db.commit()

    def cancel_request(self, db: Session, user: User, request_id: int) -> None:
        friendship = friendship_repository.get_by_id(db, request_id)
        if not friendship:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found.",
            )
        if friendship.requester_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot cancel a request you did not send.",
            )
        if friendship.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This request is no longer pending.",
            )
        db.delete(friendship)
        db.commit()


friendship_service = FriendshipService()
