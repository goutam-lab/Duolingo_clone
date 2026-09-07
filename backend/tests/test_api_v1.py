import pytest
from datetime import date, timedelta, timezone, datetime
from fastapi.testclient import TestClient
from sqlalchemy import select
from app.main import app
from app.db.session import SessionLocal
from app.models.user import User
from app.models.user_stats import UserStats
from app.models.course import Course
from app.models.lesson import Lesson
from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement


from app.core.security import create_access_token


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


@pytest.fixture
def auth_headers(db_session):
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    token = create_access_token(learner.id)
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# 1. GET /api/v1/me & POST /api/v1/me/refill-hearts
# ---------------------------------------------------------------------------
def test_get_me_default_learner(client, auth_headers):
    response = client.get("/api/v1/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "learner"
    assert "email" in data
    assert "avatar_key" in data
    assert "total_xp" in data
    assert "current_streak" in data
    assert "longest_streak" in data
    assert "hearts" in data
    assert "max_hearts" in data
    assert "gems" in data
    assert "daily_goal_xp" in data
    assert "daily_goal_progress" in data
    assert "stats" in data
    assert data["stats"]["total_xp"] == data["total_xp"]


def test_get_me_with_header_user_switching(client, db_session):
    # Fetch demo user Alex
    alex = db_session.execute(select(User).where(User.username == "Alex")).scalar_one_or_none()
    assert alex is not None
    token = create_access_token(alex.id)

    response = client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "Alex"
    assert data["id"] == alex.id


def test_get_me_nonexistent_user_header(client):
    token = create_access_token(999999)
    response = client.get("/api/v1/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
    data = response.json()
    assert "error" in data or "detail" in data


def test_me_daily_goal_rollover(client, db_session, auth_headers):
    """If daily_goal_date < today, daily_goal_progress should report 0 without database corruption."""
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    stats = learner.stats
    yesterday = datetime.now(timezone.utc).date() - timedelta(days=1)

    # Set daily_goal_date to yesterday and progress to 15
    original_progress = stats.daily_goal_progress
    original_date = stats.daily_goal_date
    stats.daily_goal_date = yesterday
    stats.daily_goal_progress = 15
    db_session.commit()

    try:
        response = client.get("/api/v1/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["daily_goal_progress"] == 0
        assert data["stats"]["daily_goal_progress"] == 0
    finally:
        # Restore
        stats.daily_goal_date = original_date
        stats.daily_goal_progress = original_progress
        db_session.commit()


def test_me_streak_evaluation_expired(client, db_session, auth_headers):
    """If last_activity_date < yesterday, streak evaluates to 0."""
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    stats = learner.stats
    three_days_ago = datetime.now(timezone.utc).date() - timedelta(days=3)

    original_date = stats.last_activity_date
    original_streak = stats.current_streak
    stats.last_activity_date = three_days_ago
    stats.current_streak = 5
    db_session.commit()

    try:
        response = client.get("/api/v1/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["current_streak"] == 0
        assert data["stats"]["current_streak"] == 0
    finally:
        stats.last_activity_date = original_date
        stats.current_streak = original_streak
        db_session.commit()


def test_post_refill_hearts(client, db_session, auth_headers):
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    stats = learner.stats

    # Deplete hearts
    stats.hearts = 1
    db_session.commit()

    response = client.post("/api/v1/me/refill-hearts", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["hearts"] == stats.max_hearts
    assert data["max_hearts"] == stats.max_hearts


# ---------------------------------------------------------------------------
# 2. GET /api/v1/courses/{course_id}/path
# ---------------------------------------------------------------------------
def test_get_course_path_success(client, db_session, auth_headers):
    course = db_session.execute(select(Course).where(Course.code == "en-hi")).scalar_one()

    response = client.get(f"/api/v1/courses/{course.id}/path", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()

    assert "course" in data
    assert data["course"]["id"] == course.id
    assert data["course"]["code"] == "en-hi"
    assert "units" in data
    assert len(data["units"]) > 0

    first_unit = data["units"][0]
    assert len(first_unit["skills"]) > 0

    first_skill = first_unit["skills"][0]
    assert first_skill["status"] in ["available", "in_progress", "completed"]
    assert "progress" in first_skill
    assert "lessons_completed" in first_skill["progress"]
    assert "total_lessons" in first_skill["progress"]
    assert "crown_level" in first_skill["progress"]

    assert len(first_skill["lessons"]) > 0
    first_lesson = first_skill["lessons"][0]
    assert first_lesson["status"] in ["available", "completed", "locked"]
    assert "is_completed" in first_lesson
    assert "best_score" in first_lesson
    assert "attempts_count" in first_lesson


def test_get_course_path_nonexistent(client, auth_headers):
    response = client.get("/api/v1/courses/999999/path", headers=auth_headers)
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# 3. GET /api/v1/lessons/{lesson_id} (SECURITY & FUNCTIONALITY)
# ---------------------------------------------------------------------------
def test_get_lesson_metadata_and_safe_exercises(client, db_session):
    lesson = db_session.execute(select(Lesson).where(Lesson.is_active.is_(True))).scalars().first()
    assert lesson is not None

    response = client.get(f"/api/v1/lessons/{lesson.id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == lesson.id
    assert data["title"] == lesson.title
    assert data["xp_reward"] == lesson.xp_reward
    assert "exercises" in data
    assert len(data["exercises"]) > 0

    # STRICT SECURITY VERIFICATION
    for ex in data["exercises"]:
        assert "id" in ex
        assert "type" in ex
        assert "prompt" in ex
        assert "question_data" in ex
        assert "order_index" in ex

        # Ensure answer_data_json / answer keys NEVER leak
        assert "answer_data_json" not in ex
        assert "answer_data" not in ex
        assert "correct_option" not in ex
        assert "accepted_answers" not in ex
        assert "correct_order" not in ex
        assert "pair_matches" not in ex
        if isinstance(ex["question_data"], dict):
            assert "correct_option" not in ex["question_data"]
            assert "accepted_answers" not in ex["question_data"]
            assert "correct_answer" not in ex["question_data"]


def test_get_lesson_nonexistent(client):
    response = client.get("/api/v1/lessons/999999")
    assert response.status_code == 404


def test_get_lesson_inactive_rejected(client, db_session):
    lesson = db_session.execute(select(Lesson)).scalars().first()
    original_active = lesson.is_active
    lesson.is_active = False
    db_session.commit()

    try:
        response = client.get(f"/api/v1/lessons/{lesson.id}")
        assert response.status_code == 404
    finally:
        lesson.is_active = original_active
        db_session.commit()


# ---------------------------------------------------------------------------
# 4. GET /api/v1/profile/{user_id}
# ---------------------------------------------------------------------------
def test_get_profile_learner(client, db_session):
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()

    response = client.get(f"/api/v1/profile/{learner.id}")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == learner.id
    assert data["username"] == "learner"
    assert "stats" in data
    assert "total_xp" in data["stats"]
    assert "current_streak" in data["stats"]
    assert "longest_streak" in data["stats"]
    assert "completed_lessons" in data["stats"]
    assert "completed_skills" in data["stats"]
    assert "achievements" in data
    # Sensitive email should NOT be exposed in public profile
    assert "email" not in data


def test_get_profile_nonexistent(client):
    response = client.get("/api/v1/profile/999999")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# 5. GET /api/v1/leaderboard
# ---------------------------------------------------------------------------
def test_get_leaderboard_ordering_and_limit(client):
    response = client.get("/api/v1/leaderboard?limit=5")
    assert response.status_code == 200
    data = response.json()

    assert "entries" in data
    entries = data["entries"]
    assert len(entries) <= 5

    # Check rank is 1-indexed and sorted by total_xp DESC
    for i, entry in enumerate(entries):
        assert entry["rank"] == i + 1
        assert "username" in entry
        assert "total_xp" in entry
        assert "xp" in entry
        if i > 0:
            assert entries[i - 1]["total_xp"] >= entry["total_xp"]


# ---------------------------------------------------------------------------
# 6. GET /api/v1/achievements & GET /api/v1/me/achievements
# ---------------------------------------------------------------------------
def test_get_achievements_catalog(client):
    response = client.get("/api/v1/achievements")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    codes = [a["code"] for a in data]
    assert "FIRST_LESSON" in codes
    assert "THREE_DAY_STREAK" in codes


def test_get_my_achievements(client, db_session, auth_headers):
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()

    # Initially learner has 0 achievements
    response = client.get("/api/v1/me/achievements", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []

    # Insert an unlocked achievement temporarily for test
    ach = db_session.execute(select(Achievement).where(Achievement.code == "FIRST_LESSON")).scalar_one()
    user_ach = UserAchievement(user_id=learner.id, achievement_id=ach.id)
    db_session.add(user_ach)
    db_session.commit()

    try:
        response = client.get("/api/v1/me/achievements", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["code"] == "FIRST_LESSON"
        assert data[0]["achievement_id"] == ach.id
    finally:
        db_session.delete(user_ach)
        db_session.commit()

