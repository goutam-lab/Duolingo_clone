import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from app.main import app
from app.db.session import get_db
from app.core.security import create_access_token
from app.models.user import User
from app.models.user_stats import UserStats
from app.models.lesson import Lesson
from app.models.lesson_attempt import LessonAttempt
from app.models.exercise_attempt import ExerciseAttempt
from app.models.lesson_progress import LessonProgress
from app.models.skill_progress import SkillProgress
from app.models.daily_activity import DailyActivity
from app.models.user_achievement import UserAchievement


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def cleanup_learner_progress():
    yield
    # Teardown: Restore clean DB state for learner after each test
    from app.db.session import SessionLocal
    db = SessionLocal()
    try:
        learner = db.execute(select(User).where(User.username == "learner")).scalar_one_or_none()
        if learner:
            # Delete attempts & achievements created in test
            attempts = db.scalars(select(LessonAttempt).where(LessonAttempt.user_id == learner.id)).all()
            for att in attempts:
                db.delete(att)
            db.query(UserAchievement).filter(UserAchievement.user_id == learner.id).delete()
            db.query(LessonProgress).filter(LessonProgress.user_id == learner.id).delete()
            db.query(SkillProgress).filter(SkillProgress.user_id == learner.id).delete()
            db.query(DailyActivity).filter(DailyActivity.user_id == learner.id).delete()
            stats = db.execute(select(UserStats).where(UserStats.user_id == learner.id)).scalar_one_or_none()
            if stats:
                stats.total_xp = 0
                stats.current_streak = 0
                stats.longest_streak = 0
                stats.hearts = 5
                stats.daily_goal_progress = 0
                stats.last_activity_date = None
            db.commit()
    finally:
        db.close()


@pytest.fixture
def auth_headers(client):
    # Log in as test learner (learner / password123)
    res = client.post("/api/v1/auth/login", json={"username_or_email": "learner", "password": "password123"})
    assert res.status_code == 200
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def second_user_headers(client):
    # Log in as second user (Alex / password123)
    res = client.post("/api/v1/auth/login", json={"username_or_email": "Alex", "password": "password123"})
    assert res.status_code == 200
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_lesson_security_no_authoritative_answers(client):
    """Verify authoritative answer data is stripped from public lesson fetch."""
    res = client.get("/api/v1/lessons/1")
    assert res.status_code == 200
    data = res.json()
    assert "exercises" in data
    assert len(data["exercises"]) > 0
    for ex in data["exercises"]:
        assert "answer_data" not in ex
        assert "answer_data_json" not in ex
        assert "correct_option" not in ex.get("question_data", {})
        assert "accepted_answers" not in ex.get("question_data", {})
        assert "pairs" not in ex.get("question_data", {})
        assert "correct_order" not in ex.get("question_data", {})


def test_start_lesson_unauthenticated_rejected(client):
    """Unauthenticated request to start attempt must be rejected with 401."""
    res = client.post("/api/v1/lessons/1/attempts")
    assert res.status_code == 401


def test_start_unlocked_lesson_success(client, auth_headers):
    """Authenticated learner can start lesson 1 (Unit 1, Skill 1, Lesson 1)."""
    # Refill hearts first
    client.post("/api/v1/me/refill-hearts", headers=auth_headers)

    res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "attempt_id" in data
    assert data["lesson_id"] == 1
    assert data["hearts_remaining"] == 5


def test_start_locked_lesson_rejected(client, auth_headers):
    """Attempting to start a locked lesson in later skills/units must be rejected with 403."""
    # Lesson 24 is in Unit 4 or late skills and is locked for a beginner
    res = client.post("/api/v1/lessons/24/attempts", headers=auth_headers)
    assert res.status_code == 403
    assert "locked" in res.json()["detail"].lower()


def test_exercise_evaluations_all_six_types(client, auth_headers):
    """Test answer submission across all 6 exercise types for lesson 1."""
    # Refill hearts
    client.post("/api/v1/me/refill-hearts", headers=auth_headers)

    start_res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    assert start_res.status_code == 200
    attempt_id = start_res.json()["attempt_id"]

    # 1. Multiple Choice (Exercise 1) - Correct & Wrong
    # In seed data: prompt "How do you say 'Namaste' in English?", options: ["Hello", "Goodbye", ...]
    # Correct: "Hello"
    wrong_mc = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        json={"exercise_id": 1, "answer": "Goodbye"},
        headers=auth_headers,
    )
    assert wrong_mc.status_code == 200
    assert wrong_mc.json()["is_correct"] is False
    assert wrong_mc.json()["hearts_remaining"] == 4
    assert wrong_mc.json()["correct_answer"] == "Hello"

    correct_mc = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        json={"exercise_id": 1, "answer": "Hello"},
        headers=auth_headers,
    )
    assert correct_mc.status_code == 200
    assert correct_mc.json()["is_correct"] is True
    assert correct_mc.json()["hearts_remaining"] == 4  # Unchanged on correct!

    # 2. Translate (Exercise 2) - Accepted answers: ["suprabhat", "shubh prabhat", "सुप्रभात", "शुभ प्रभात"]
    correct_tr = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        json={"exercise_id": 2, "answer": "Suprabhat"},
        headers=auth_headers,
    )
    assert correct_tr.status_code == 200
    assert correct_tr.json()["is_correct"] is True

    # 3. Word Bank (Exercise 3) - Correct order: ["Hello,", "how", "are", "you"]
    correct_wb = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        json={"exercise_id": 3, "answer": ["Hello,", "how", "are", "you"]},
        headers=auth_headers,
    )
    assert correct_wb.status_code == 200
    assert correct_wb.json()["is_correct"] is True

    # 4. Match Pairs (Exercise 4) - pairs: [["Hello", "Namaste"], ["Goodbye", "Alvida"], ["Thank you", "Dhanyawad"], ["Please", "Kripya"]]
    correct_mp = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        json={
            "exercise_id": 4,
            "answer": [
                ["Hello", "Namaste"],
                ["Goodbye", "Alvida"],
                ["Thank you", "Dhanyawad"],
                ["Please", "Kripya"],
            ],
        },
        headers=auth_headers,
    )
    assert correct_mp.status_code == 200
    assert correct_mp.json()["is_correct"] is True

    # 5. Fill Blank (Exercise 5) - accepted: ["morning", "afternoon", "evening"]
    correct_fb = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        json={"exercise_id": 5, "answer": "morning"},
        headers=auth_headers,
    )
    assert correct_fb.status_code == 200
    assert correct_fb.json()["is_correct"] is True

    # 6. Type Answer (Exercise 6) - accepted: ["thank you", "thanks"]
    correct_ta = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        json={"exercise_id": 6, "answer": "thank you"},
        headers=auth_headers,
    )
    assert correct_ta.status_code == 200
    assert correct_ta.json()["is_correct"] is True


def test_heart_deduction_and_zero_floor(client, auth_headers):
    """Repeated incorrect answers decrease hearts down to 0 and never below."""
    start_res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    assert start_res.status_code == 200
    attempt_id = start_res.json()["attempt_id"]

    for _ in range(8):
        res = client.post(
            f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
            json={"exercise_id": 1, "answer": "WrongOption"},
            headers=auth_headers,
        )
        assert res.status_code == 200
        assert res.json()["hearts_remaining"] >= 0

    # Verify hearts are at 0
    me = client.get("/api/v1/me", headers=auth_headers).json()
    assert me["hearts"] == 0

    # Starting a new lesson when at 0 hearts is blocked
    start_at_zero = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    assert start_at_zero.status_code == 400
    assert "0 hearts" in start_at_zero.json()["detail"]

    # Refill hearts restores them
    refill = client.post("/api/v1/me/refill-hearts", headers=auth_headers)
    assert refill.status_code == 200
    assert refill.json()["hearts"] == 5


def test_lesson_completion_and_idempotency(client, auth_headers):
    """Completing a lesson updates stats, awards XP once, and is idempotent."""
    # Refill hearts
    client.post("/api/v1/me/refill-hearts", headers=auth_headers)

    # Initial stats
    me_before = client.get("/api/v1/me", headers=auth_headers).json()
    xp_before = me_before["total_xp"]

    start_res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    attempt_id = start_res.json()["attempt_id"]

    # Submit all 6 exercises
    answers = [
        (1, "Hello"),
        (2, "suprabhat"),
        (3, ["Hello,", "how", "are", "you"]),
        (4, [["Hello", "Namaste"], ["Goodbye", "Alvida"], ["Thank you", "Dhanyawad"], ["Please", "Kripya"]]),
        (5, "morning"),
        (6, "thank you"),
    ]
    for ex_id, ans in answers:
        res = client.post(
            f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
            json={"exercise_id": ex_id, "answer": ans},
            headers=auth_headers,
        )
        assert res.status_code == 200

    # Complete lesson
    comp_res = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/complete",
        headers=auth_headers,
    )
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["completed"] is True
    assert comp_data["xp_earned"] == 10
    assert comp_data["score"] == 100
    assert comp_data["total_xp"] == xp_before + 10
    assert comp_data["streak"]["current"] >= 1

    # Verify DB user_stats updated
    me_after = client.get("/api/v1/me", headers=auth_headers).json()
    assert me_after["total_xp"] == xp_before + 10

    # IDEMPOTENCY: Call complete again on the SAME attempt
    comp_repeat = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/complete",
        headers=auth_headers,
    )
    assert comp_repeat.status_code == 200
    assert comp_repeat.json()["total_xp"] == xp_before + 10  # NO DOUBLE XP!

    me_repeat = client.get("/api/v1/me", headers=auth_headers).json()
    assert me_repeat["total_xp"] == xp_before + 10


def test_user_isolation_cannot_tamper_other_attempt(client, auth_headers, second_user_headers):
    """User B cannot submit answers or complete User A's lesson attempt."""
    # User A starts an attempt
    res = client.post("/api/v1/lessons/1/attempts", headers=auth_headers)
    assert res.status_code == 200
    attempt_id = res.json()["attempt_id"]

    # User B tries to submit answer to User A's attempt
    tamper_answer = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/answers",
        json={"exercise_id": 1, "answer": "Hello"},
        headers=second_user_headers,
    )
    assert tamper_answer.status_code == 404

    # User B tries to complete User A's attempt
    tamper_complete = client.post(
        f"/api/v1/lessons/1/attempts/{attempt_id}/complete",
        headers=second_user_headers,
    )
    assert tamper_complete.status_code == 404
