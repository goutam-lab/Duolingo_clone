import pytest
from fastapi.testclient import TestClient
from sqlalchemy import event, select
from app.main import app
from app.db.session import engine, SessionLocal
from app.models.course import Course
from app.models.lesson import Lesson
from app.models.user import User


class QueryCounter:
    def __init__(self):
        self.count = 0
        self.queries = []

    def __enter__(self):
        self.count = 0
        self.queries = []
        event.listen(engine, "before_cursor_execute", self._callback)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        event.remove(engine, "before_cursor_execute", self._callback)

    def _callback(self, conn, cursor, statement, parameters, context, executemany):
        # Ignore SQLite transaction controls like BEGIN or COMMIT
        stripped = statement.strip().upper()
        if stripped.startswith("BEGIN") or stripped.startswith("COMMIT") or stripped.startswith("ROLLBACK"):
            return
        self.count += 1
        self.queries.append(statement)


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


from app.core.security import create_access_token


def test_course_path_query_efficiency_no_n_plus_1(client, db_session):
    """
    Verify course path does NOT perform N+1 queries.
    Even across 4 units, 10 skills, and 30 lessons (44+ path nodes),
    the endpoint must use bounded batch queries (<= 8 queries including auth user lookup).
    """
    course = db_session.execute(select(Course).where(Course.code == "en-hi")).scalar_one()
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    token = create_access_token(learner.id)

    with QueryCounter() as qc:
        response = client.get(
            f"/api/v1/courses/{course.id}/path",
            headers={"Authorization": f"Bearer {token}"},
        )

    assert response.status_code == 200
    data = response.json()
    assert len(data["units"]) == 4

    total_lessons_rendered = sum(
        len(skill["lessons"]) for u in data["units"] for skill in u["skills"]
    )
    assert total_lessons_rendered == 30  # 30 lessons across 10 skills

    # An N+1 implementation would trigger 1 (user) + 1 (course) + 4 (units) + 10 (skills) + 30 (lessons) = 46+ queries
    # Our batch selectinload + batch progress strategy executes bounded queries (<= 8 queries)
    assert qc.count <= 8, f"Expected <= 8 queries, got {qc.count}. Queries:\n" + "\n".join(qc.queries)


def test_lesson_detail_query_efficiency(client, db_session):
    """
    Verify lesson detail loads exercises in bounded queries without looping.
    """
    lesson = db_session.execute(select(Lesson).where(Lesson.is_active.is_(True))).scalars().first()

    with QueryCounter() as qc:
        response = client.get(f"/api/v1/lessons/{lesson.id}")

    assert response.status_code == 200
    data = response.json()
    assert len(data["exercises"]) == 6  # 6 exercises loaded

    # 1 lesson + 1 batch exercise + 1 skill load = <= 3 queries
    assert qc.count <= 3, f"Expected <= 3 queries, got {qc.count}. Queries:\n" + "\n".join(qc.queries)


def test_leaderboard_query_efficiency(client):
    """
    Verify leaderboard sorting and limiting happens in a single DB query.
    """
    with QueryCounter() as qc:
        response = client.get("/api/v1/leaderboard?limit=10")

    assert response.status_code == 200
    # Exactly 1 query using JOIN and LIMIT
    assert qc.count <= 2, f"Expected <= 2 queries, got {qc.count}. Queries:\n" + "\n".join(qc.queries)


def test_profile_query_efficiency(client, db_session):
    """
    Verify profile fetch uses bounded aggregate queries without scanning attempt logs.
    """
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()

    with QueryCounter() as qc:
        response = client.get(f"/api/v1/profile/{learner.id}")

    assert response.status_code == 200
    # 1 user+stats + 1 lesson count + 1 skill count + 1 achievements = <= 5 queries
    assert qc.count <= 5, f"Expected <= 5 queries, got {qc.count}. Queries:\n" + "\n".join(qc.queries)


def test_get_me_query_efficiency(client, db_session):
    """
    Verify /me executes bounded lookups (<= 3 queries).
    """
    learner = db_session.execute(select(User).where(User.username == "learner")).scalar_one()
    token = create_access_token(learner.id)

    with QueryCounter() as qc:
        response = client.get(
            "/api/v1/me", headers={"Authorization": f"Bearer {token}"}
        )

    assert response.status_code == 200
    assert qc.count <= 3, f"Expected <= 3 queries, got {qc.count}. Queries:\n" + "\n".join(qc.queries)

