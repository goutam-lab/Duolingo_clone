from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.friendship import (
    FriendRequestCreate,
    FriendRequestsResponse,
    FriendshipRecord,
    FriendsListResponse,
    UserSearchResponse,
)
from app.services.friendship_service import friendship_service

router = APIRouter()


@router.get(
    "/users/search",
    response_model=UserSearchResponse,
    summary="Search users by username",
)
def search_users(
    q: str = Query("", max_length=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return friendship_service.search_users(db, current_user, q)


@router.get("/friends", response_model=FriendsListResponse, summary="List accepted friends")
def list_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return friendship_service.list_friends(db, current_user)


@router.get(
    "/friends/requests",
    response_model=FriendRequestsResponse,
    summary="List incoming and outgoing friend requests",
)
def list_friend_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return friendship_service.list_requests(db, current_user)


@router.post(
    "/friends/requests",
    response_model=FriendshipRecord,
    status_code=201,
    summary="Send a friend request",
)
def send_friend_request(
    payload: FriendRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return friendship_service.send_request(db, current_user, payload)


@router.post(
    "/friends/requests/{request_id}/accept",
    response_model=FriendshipRecord,
    summary="Accept a friend request",
)
def accept_friend_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return friendship_service.accept_request(db, current_user, request_id)


@router.post(
    "/friends/requests/{request_id}/reject",
    response_model=FriendshipRecord,
    summary="Reject a friend request",
)
def reject_friend_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return friendship_service.reject_request(db, current_user, request_id)


@router.delete(
    "/friends/{user_id}",
    status_code=204,
    summary="Remove an accepted friendship",
)
def unfriend(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    friendship_service.unfriend(db, current_user, user_id)
    return Response(status_code=204)
