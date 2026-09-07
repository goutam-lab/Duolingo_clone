import uuid
from fastapi.testclient import TestClient
from sqlalchemy import select
from app.main import app
from app.db.session import SessionLocal
from app.db.init_db import create_tables
from app.models.friendship import Friendship
from app.core.security import create_access_token

create_tables()
client = TestClient(app)


def _signup(prefix: str):
    suffix = uuid.uuid4().hex[:10]
    username = f"{prefix}_{suffix}"
    payload = {
        "username": username,
        "email": f"{username}@example.com",
        "password": "SecurePassword123!",
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201, response.text
    data = response.json()
    return data["user"]["id"], {"Authorization": f"Bearer {data['access_token']}"}, username


def _headers_for(user_id: int):
    return {"Authorization": f"Bearer {create_access_token(user_id)}"}


def test_cannot_friend_yourself():
    user_id, headers, _ = _signup("self")
    response = client.post(
        "/api/v1/friends/requests",
        headers=headers,
        json={"user_id": user_id},
    )
    assert response.status_code == 400


def test_send_request_and_duplicate_pending():
    a_id, a_headers, _ = _signup("req")
    b_id, _, _ = _signup("add")

    first = client.post(
        "/api/v1/friends/requests",
        headers=a_headers,
        json={"user_id": b_id},
    )
    assert first.status_code == 201
    data = first.json()
    assert data["status"] == "pending"
    assert data["user"]["id"] == b_id
    assert "email" not in data["user"]

    second = client.post(
        "/api/v1/friends/requests",
        headers=a_headers,
        json={"user_id": b_id},
    )
    assert second.status_code == 409


def test_recipient_can_accept_and_both_see_friendship():
    a_id, a_headers, _ = _signup("acc_a")
    b_id, b_headers, _ = _signup("acc_b")

    created = client.post(
        "/api/v1/friends/requests",
        headers=a_headers,
        json={"user_id": b_id},
    )
    request_id = created.json()["id"]

    accept = client.post(
        f"/api/v1/friends/requests/{request_id}/accept",
        headers=b_headers,
    )
    assert accept.status_code == 200
    assert accept.json()["status"] == "accepted"

    friends_a = client.get("/api/v1/friends", headers=a_headers).json()["friends"]
    friends_b = client.get("/api/v1/friends", headers=b_headers).json()["friends"]
    assert any(item["user"]["id"] == b_id for item in friends_a)
    assert any(item["user"]["id"] == a_id for item in friends_b)

    db = SessionLocal()
    try:
        row = db.execute(select(Friendship).where(Friendship.id == request_id)).scalar_one()
        assert row.status == "accepted"
    finally:
        db.close()


def test_recipient_can_reject():
    _, a_headers, _ = _signup("rej_a")
    b_id, b_headers, _ = _signup("rej_b")
    created = client.post(
        "/api/v1/friends/requests",
        headers=a_headers,
        json={"user_id": b_id},
    )
    request_id = created.json()["id"]
    rejected = client.post(
        f"/api/v1/friends/requests/{request_id}/reject",
        headers=b_headers,
    )
    assert rejected.status_code == 200
    assert rejected.json()["status"] == "rejected"
    friends = client.get("/api/v1/friends", headers=b_headers).json()["friends"]
    assert friends == []


def test_requester_cannot_accept_own_request():
    _, a_headers, _ = _signup("own_a")
    b_id, _, _ = _signup("own_b")
    created = client.post(
        "/api/v1/friends/requests",
        headers=a_headers,
        json={"user_id": b_id},
    )
    request_id = created.json()["id"]
    response = client.post(
        f"/api/v1/friends/requests/{request_id}/accept",
        headers=a_headers,
    )
    assert response.status_code == 403


def test_unauthorized_cannot_manipulate_request():
    _, a_headers, _ = _signup("un_a")
    b_id, _, _ = _signup("un_b")
    c_id, c_headers, _ = _signup("un_c")
    created = client.post(
        "/api/v1/friends/requests",
        headers=a_headers,
        json={"user_id": b_id},
    )
    request_id = created.json()["id"]

    unauth = client.post(f"/api/v1/friends/requests/{request_id}/accept")
    assert unauth.status_code == 401

    other = client.post(
        f"/api/v1/friends/requests/{request_id}/accept",
        headers=c_headers,
    )
    assert other.status_code == 403


def test_unfriend_works():
    a_id, a_headers, _ = _signup("uf_a")
    b_id, b_headers, _ = _signup("uf_b")
    created = client.post(
        "/api/v1/friends/requests",
        headers=a_headers,
        json={"user_id": b_id},
    )
    client.post(
        f"/api/v1/friends/requests/{created.json()['id']}/accept",
        headers=b_headers,
    )
    removed = client.delete(f"/api/v1/friends/{b_id}", headers=a_headers)
    assert removed.status_code == 204
    friends_a = client.get("/api/v1/friends", headers=a_headers).json()["friends"]
    friends_b = client.get("/api/v1/friends", headers=b_headers).json()["friends"]
    assert friends_a == []
    assert friends_b == []


def test_search_returns_safe_public_information():
    _, a_headers, _ = _signup("sr_a")
    _, _, b_name = _signup("sr_b")
    response = client.get(f"/api/v1/users/search?q={b_name[:6]}", headers=a_headers)
    assert response.status_code == 200
    results = response.json()["results"]
    assert len(results) >= 1
    hit = next(item for item in results if item["username"] == b_name)
    assert "email" not in hit
    assert "password" not in hit
    assert "password_hash" not in hit
    assert "id" in hit
    assert "username" in hit
    assert "total_xp" in hit
    assert "friendship_status" in hit


def test_incoming_outgoing_lists():
    _, a_headers, a_name = _signup("ls_a")
    b_id, b_headers, _ = _signup("ls_b")
    client.post(
        "/api/v1/friends/requests",
        headers=a_headers,
        json={"user_id": b_id},
    )
    incoming = client.get("/api/v1/friends/requests", headers=b_headers).json()
    outgoing = client.get("/api/v1/friends/requests", headers=a_headers).json()
    assert len(incoming["incoming"]) == 1
    assert incoming["incoming"][0]["user"]["username"] == a_name
    assert len(outgoing["outgoing"]) == 1
    assert outgoing["outgoing"][0]["user"]["id"] == b_id
    assert "email" not in incoming["incoming"][0]["user"]
