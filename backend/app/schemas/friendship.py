from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


FriendshipStatus = Literal["pending", "accepted", "rejected"]
ViewerRelation = Literal["none", "outgoing", "incoming", "friends", "self"]


class FriendUserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    avatar_key: Optional[str] = "default"
    total_xp: int = 0
    current_streak: int = 0


class FriendshipRecord(BaseModel):
    id: int
    status: FriendshipStatus
    created_at: datetime
    user: FriendUserPublic


class FriendRequestCreate(BaseModel):
    user_id: int = Field(..., gt=0)


class FriendRequestsResponse(BaseModel):
    incoming: List[FriendshipRecord]
    outgoing: List[FriendshipRecord]


class FriendsListResponse(BaseModel):
    friends: List[FriendshipRecord]


class UserSearchResult(BaseModel):
    id: int
    username: str
    avatar_key: Optional[str] = "default"
    total_xp: int = 0
    friendship_status: ViewerRelation = "none"
    friendship_id: Optional[int] = None


class UserSearchResponse(BaseModel):
    results: List[UserSearchResult]
