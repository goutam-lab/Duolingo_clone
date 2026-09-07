import pytest
from datetime import date, timedelta, timezone, datetime
from fastapi.testclient import TestClient
from sqlalchemy import select, func
from app.main import app
from app.db.session import SessionLocal
from app.core.security import create_access_token
from app.models.user import User
from app.models.user_stats import UserStats
from app.models.lesson import Lesson
from app.models.lesson_progress import LessonProgress
from app.models.skill_progress import SkillProgress
from app.models.daily_activity import DailyActivity
from app.models.achievement import Achievement
from app.models.user_achievement import UserAchievement
from app.models.lesson_attempt import LessonAttempt
from app.models.exercise_attempt import ExerciseAttempt
from app.services.lesson_service import lesson_service


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def auth_headers(client):
    res = client.post(
        "/api/v1/auth/login",
        json={"username_or_email": "learner", "password": "password123"},
    )
    assert res.status_code == 200
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(autouse=True)
def cleanup_learner():
    yield
    db = SessionLocal()
    try:
        learner = db.execute(
            select(User).where(User.username == "learner")
        ).scalar_one_or_none()
        if learner:
            # Delete attempts & achievements created in test
            attempts = db.scalars(
                select(LessonAttempt).where(LessonAttempt.user_id == learner.id)
            ).all()
            for att in attempts:
                db.delete(att)
            db.query(UserAchievement).filter(UserAchievement.user_id == learner.id).delete()
            db.query(LessonProgress).filter(LessonProgress.user_id == learner.id).delete()
            db.query(SkillProgress).filter(SkillProgress.user_id == learner.id).delete()
            db.query(DailyActivity).filter(DailyActivity.user_id == learner.id).delete()
            stats = db.execute(
                select(UserStats).where(UserStats.user_id == learner.id)
            ).scalar_one_or_none()
            if stats:
                stats.total_xp = 0
                stats.current_streak = 0
                stats.longest_streak = 0
                stats.hearts = 5
                stats.daily_goal_progress = 0
                stats.daily_goal_xp = 20
                stats.last_activity_date = None
                stats.daily_goal_date = None
            db.commit()
    finally:
        db.close()


# ===========================================================================
# 1. HEARTS & HEART REFILL
# ===========================================================================
def test_heart_refill_endpoint(client, auth_headers, db_session):
    """Verify heart refill restores hearts to max_hearts and updates backend state."""
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    learner.stats.hearts = 1
    db_session.commit()

    res = client.post("/api/v1/me/refill-hearts", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["hearts"] == 5
    assert data["max_hearts"] == 5

    # Verify DB persistence
    db_session.refresh(learner.stats)
    assert learner.stats.hearts == 5


def test_heart_deduction_on_wrong_answer(client, auth_headers, db_session):
    """Verify wrong answer deducts 1 heart and updates backend state."""
    # Start attempt
    res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    assert res.status_code == 200
    attempt_id = res.json()["attempt_id"]

    # Submit wrong answer to exercise 1
    ans_res = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        headers=auth_headers,
        json={"exercise_id": 1, "answer": "completely_wrong_answer_xyz"},
    )
    assert ans_res.status_code == 200
    assert ans_res.json()["is_correct"] is False
    assert ans_res.json()["hearts_remaining"] == 4


# ===========================================================================
# 2. XP & STREAK ACCUMULATION
# ===========================================================================
def test_xp_award_and_streak_progression(client, auth_headers, db_session):
    """Verify completing a lesson awards XP, increments streak, and updates daily goal."""
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    initial_xp = learner.stats.total_xp
    initial_streak = learner.stats.current_streak

    # Start attempt for lesson 1
    start_res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    assert start_res.status_code == 200
    attempt_id = start_res.json()["attempt_id"]

    # Answer all exercises correctly
    lesson = db_session.execute(select(Lesson).where(Lesson.id == 1)).scalar_one()
    for ex in lesson.exercises:
        correct_opt = ex.answer_data_json.get("correct_option") or ex.answer_data_json.get("accepted_answers", [""])[0]
        client.post(
            f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
            headers=auth_headers,
            json={"exercise_id": ex.id, "answer": correct_opt},
        )

    # Complete lesson
    comp_res = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/complete",
        headers=auth_headers,
    )
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["completed"] is True
    assert comp_data["xp_earned"] == lesson.xp_reward
    assert comp_data["total_xp"] == initial_xp + lesson.xp_reward
    assert comp_data["streak"]["current"] >= 1
    assert comp_data["daily_goal"]["progress"] >= lesson.xp_reward

    # Verify DB persistence
    db_session.refresh(learner.stats)
    assert learner.stats.total_xp == initial_xp + lesson.xp_reward


def test_lesson_completion_idempotency(client, auth_headers, db_session):
    """Verify completing the same attempt twice is idempotent and does not double XP."""
    start_res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    attempt_id = start_res.json()["attempt_id"]

    lesson = db_session.execute(select(Lesson).where(Lesson.id == 1)).scalar_one()
    for ex in lesson.exercises:
        correct_opt = ex.answer_data_json.get("correct_option") or ex.answer_data_json.get("accepted_answers", [""])[0]
        client.post(
            f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
            headers=auth_headers,
            json={"exercise_id": ex.id, "answer": correct_opt},
        )

    # First completion
    res1 = client.post(f"/api/v1/lessons/1/attempts/{attempt_id}/complete", headers=auth_headers)
    assert res1.status_code == 200
    first_total_xp = res1.json()["total_xp"]

    # Second completion of the same attempt
    res2 = client.post(f"/api/v1/lessons/1/attempts/{attempt_id}/complete", headers=auth_headers)
    assert res2.status_code == 200
    assert res2.json()["total_xp"] == first_total_xp


# ===========================================================================
# 3. ACHIEVEMENTS UNLOCKING
# ===========================================================================
def test_achievement_unlock_on_first_lesson(client, auth_headers, db_session):
    """Verify FIRST_LESSON achievement unlocks on completing lesson 1."""
    start_res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    attempt_id = start_res.json()["attempt_id"]

    lesson = db_session.execute(select(Lesson).where(Lesson.id == 1)).scalar_one()
    for ex in lesson.exercises:
        correct_opt = ex.answer_data_json.get("correct_option") or ex.answer_data_json.get("accepted_answers", [""])[0]
        client.post(
            f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
            headers=auth_headers,
            json={"exercise_id": ex.id, "answer": correct_opt},
        )

    res = client.post(f"/api/v1/lessons/1/attempts/{attempt_id}/complete", headers=auth_headers)
    assert res.status_code == 200
    new_achs = res.json()["new_achievements"]
    assert "FIRST_LESSON" in new_achs

    # Verify user achievements endpoint returns it
    my_achs = client.get("/api/v1/me/achievements", headers=auth_headers)
    assert my_achs.status_code == 200
    codes = [a["code"] for a in my_achs.json()]
    assert "FIRST_LESSON" in codes


# ===========================================================================
# 4. PROFILE ENDPOINTS & SENSITIVITY
# ===========================================================================
def test_get_my_profile_authenticated(client, auth_headers, db_session):
    """Verify /profile/me returns current user's profile, statistics, and badges."""
    res = client.get("/api/v1/profile/me", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["username"] == "learner"
    assert "stats" in data
    assert "total_xp" in data["stats"]
    assert "completed_lessons" in data["stats"]
    assert "completed_skills" in data["stats"]
    assert "achievements" in data
    assert len(data["achievements"]) >= 5
    # Security: No sensitive fields
    assert "password_hash" not in data
    assert "email" not in data


def test_get_public_profile_user_isolation(client, db_session):
    """Verify public profile /profile/{id} does not leak credentials or email."""
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    res = client.get(f"/api/v1/profile/{learner.id}")
    assert res.status_code == 200
    data = res.json()
    assert data["username"] == "learner"
    assert "email" not in data
    assert "password_hash" not in data


# ===========================================================================
# 5. LEADERBOARD ENDPOINT
# ===========================================================================
def test_leaderboard_ordering_and_ranks(client):
    """Verify leaderboard returns deterministic ranking ordered by total_xp DESC."""
    res = client.get("/api/v1/leaderboard?limit=10")
    assert res.status_code == 200
    data = res.json()
    assert "entries" in data
    assert len(data["entries"]) > 0

    for i, entry in enumerate(data["entries"]):
        assert entry["rank"] == i + 1
        assert "user_id" in entry
        assert "username" in entry
        assert "total_xp" in entry
        if i > 0:
            assert data["entries"][i - 1]["total_xp"] >= entry["total_xp"]
