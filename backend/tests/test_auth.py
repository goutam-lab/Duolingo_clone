import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from app.main import app
from app.db.session import SessionLocal
from app.models.user import User
from app.models.user_stats import UserStats
from app.core.security import verify_password, create_access_token


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# 1. Password Hashing & Plaintext Isolation Tests
# ---------------------------------------------------------------------------
def test_signup_hashes_password_and_creates_stats(client, db_session):
    test_username = "authtest_user1"
    test_email = "authtest1@example.com"
    raw_password = "SecurePassword123!"

    # Clean up if existing from previous run
    existing = db_session.execute(
        select(User).where(User.username == test_username)
    ).scalar_one_or_none()
    if existing:
        db_session.delete(existing)
        db_session.commit()

    response = client.post(
        "/api/v1/auth/signup",
        json={
            "username": test_username,
            "email": test_email,
            "password": raw_password,
        },
    )
    assert response.status_code == 201
    data = response.json()

    # 1. Verify token & cookie returned
    assert "access_token" in data
    assert data["user"]["username"] == test_username
    assert data["user"]["email"] == test_email
    assert data["onboarding_completed"] is False
    assert "access_token" in response.cookies

    # 2. Verify password hash never exposed in API response
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]
    assert "password_hash" not in data

    # 3. Direct database verification: verify bcrypt hash and NO plaintext
    db_user = db_session.execute(
        select(User).where(User.username == test_username)
    ).scalar_one_or_none()
    assert db_user is not None
    assert db_user.password_hash != raw_password
    assert db_user.password_hash.startswith("$2b$") or db_user.password_hash.startswith("$2a$")
    assert verify_password(raw_password, db_user.password_hash) is True
    assert verify_password("WrongPassword123", db_user.password_hash) is False

    # 4. Atomic transaction verification: UserStats was initialized
    stats = db_session.execute(
        select(UserStats).where(UserStats.user_id == db_user.id)
    ).scalar_one_or_none()
    assert stats is not None
    assert stats.total_xp == 0
    assert stats.hearts == 5
    assert stats.gems == 100
    assert stats.daily_goal_xp == 20


# ---------------------------------------------------------------------------
# 2. Duplicate Validation
# ---------------------------------------------------------------------------
def test_signup_duplicate_username_rejected(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "username": "authtest_user1",
            "email": "different_email@example.com",
            "password": "Password123!",
        },
    )
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"].lower()


def test_signup_duplicate_email_rejected(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "username": "unique_username_99",
            "email": "authtest1@example.com",
            "password": "Password123!",
        },
    )
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"].lower()


# ---------------------------------------------------------------------------
# 3. Login Verification
# ---------------------------------------------------------------------------
def test_login_success_with_username(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username_or_email": "authtest_user1",
            "password": "SecurePassword123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["username"] == "authtest_user1"
    assert "access_token" in data
    assert "access_token" in response.cookies


def test_login_success_with_email(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username_or_email": "authtest1@example.com",
            "password": "SecurePassword123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "authtest1@example.com"


def test_login_invalid_password_fails(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username_or_email": "authtest_user1",
            "password": "IncorrectPassword!",
        },
    )
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


def test_login_nonexistent_user_fails(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username_or_email": "nobody_exists_12345",
            "password": "SomePassword!",
        },
    )
    assert response.status_code == 401


# ---------------------------------------------------------------------------
# 4. Protected Endpoint & Security Tests
# ---------------------------------------------------------------------------
def test_protected_endpoints_reject_unauthenticated(client):
    # Ensure client has no auth cookie
    client.cookies.clear()

    res_me = client.get("/api/v1/me")
    assert res_me.status_code == 401

    res_path = client.get("/api/v1/courses/1/path")
    assert res_path.status_code == 401

    res_refill = client.post("/api/v1/me/refill-hearts")
    assert res_refill.status_code == 401

    res_achievements = client.get("/api/v1/me/achievements")
    assert res_achievements.status_code == 401

    res_auth_me = client.get("/api/v1/auth/me")
    assert res_auth_me.status_code == 401

    res_onboarding = client.post(
        "/api/v1/auth/onboarding",
        json={"course_id": 1, "daily_goal_xp": 20, "experience_level": "beginner"},
    )
    assert res_onboarding.status_code == 401



def test_impersonation_via_x_user_id_rejected_without_valid_token(client, db_session):
    client.cookies.clear()
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one_or_none()
    assert learner is not None

    # Attempt to spoof learner via X-User-Id header without JWT
    response = client.get("/api/v1/me", headers={"X-User-Id": str(learner.id)})
    assert response.status_code == 401
    assert "authentication required" in response.json()["detail"].lower()


def test_bearer_token_authentication(client, db_session):
    client.cookies.clear()
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one_or_none()
    token = create_access_token({"sub": str(learner.id)})

    response = client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "learner"
    assert data["email"] == "learner@example.com"
    # Verify password hash is never in user me response
    assert "password_hash" not in data


def test_cookie_authentication(client, db_session):
    client.cookies.clear()
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one_or_none()
    token = create_access_token({"sub": str(learner.id)})

    client.cookies.set("access_token", token)
    response = client.get("/api/v1/me")
    assert response.status_code == 200
    assert response.json()["username"] == "learner"


def test_logout_clears_cookie(client):
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    # Cookie should be deleted/expired in response
    assert 'access_token=""' in response.headers.get("set-cookie", "") or "max-age=0" in response.headers.get("set-cookie", "").lower()


# ---------------------------------------------------------------------------
# 5. Onboarding Completion Flow
# ---------------------------------------------------------------------------
def test_onboarding_flow(client, db_session):
    # Signup a new user specifically for onboarding test
    username = "onboard_tester"
    email = "onboard_tester@example.com"
    existing = db_session.execute(select(User).where(User.username == username)).scalar_one_or_none()
    if existing:
        db_session.delete(existing)
        db_session.commit()

    signup_res = client.post(
        "/api/v1/auth/signup",
        json={"username": username, "email": email, "password": "Password123!"},
    )
    assert signup_res.status_code == 201
    user_data = signup_res.json()["user"]
    token = signup_res.json()["access_token"]
    assert user_data["onboarding_completed"] is False

    # Complete onboarding
    onboard_res = client.post(
        "/api/v1/auth/onboarding",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "course_id": 1,
            "daily_goal_xp": 30,
            "experience_level": "intermediate",
        },
    )
    assert onboard_res.status_code == 200
    updated = onboard_res.json()
    assert updated["onboarding_completed"] is True
    assert updated["selected_course_id"] == 1
    assert updated["experience_level"] == "intermediate"

    # Verify user stats daily goal was updated
    stats = db_session.execute(
        select(UserStats).where(UserStats.user_id == user_data["id"])
    ).scalar_one_or_none()
    assert stats is not None
    assert stats.daily_goal_xp == 30
