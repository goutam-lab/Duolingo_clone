import pytest
from sqlalchemy import select, func
from app.db.seed import seed_all
from app.models import (
    User,
    UserStats,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    Achievement,
)


@pytest.fixture(scope="function")
def seeded_session(db_session):
    """Seed the in-memory test database and yield the session."""
    seed_all(session=db_session)
    return db_session


def test_default_learner_exists(seeded_session):
    """Verify default learner exists with accurate attributes."""
    stmt = select(User).where(User.username == "learner")
    learner = seeded_session.execute(stmt).scalar_one_or_none()
    assert learner is not None
    assert learner.email == "learner@example.com"
    assert learner.avatar_key == "default"
    assert learner.is_active is True


def test_user_stats_for_learner(seeded_session):
    """Verify UserStats exists for learner and has default starting values."""
    stmt = select(User).where(User.username == "learner")
    learner = seeded_session.execute(stmt).scalar_one()
    stats = learner.stats
    assert stats is not None
    assert stats.total_xp == 0
    assert stats.current_streak == 0
    assert stats.longest_streak == 0
    assert stats.hearts == 5
    assert stats.max_hearts == 5
    assert stats.gems == 100
    assert stats.daily_goal_xp == 20
    assert stats.daily_goal_progress == 0


def test_demo_users_exist_and_count(seeded_session):
    """Verify at least 5 demo users exist in addition to learner."""
    stmt = select(User).where(User.username != "learner")
    demo_users = seeded_session.execute(stmt).scalars().all()
    assert len(demo_users) >= 5
    usernames = {u.username for u in demo_users}
    assert {"Alex", "Sam", "Jordan", "Taylor", "Casey"}.issubset(usernames)


def test_demo_users_have_deterministic_xp(seeded_session):
    """Verify demo users have deterministic XP matching expectations."""
    expected_xp = {
        "Alex": 850,
        "Sam": 620,
        "Jordan": 480,
        "Taylor": 310,
        "Casey": 170,
    }
    for username, xp in expected_xp.items():
        stmt = select(User).where(User.username == username)
        user = seeded_session.execute(stmt).scalar_one()
        assert user.stats is not None
        assert user.stats.total_xp == xp, f"Expected {username} to have {xp} XP, got {user.stats.total_xp}"


def test_course_en_hi_exists(seeded_session):
    """Verify course en-hi exists and is active."""
    stmt = select(Course).where(Course.code == "en-hi")
    course = seeded_session.execute(stmt).scalar_one_or_none()
    assert course is not None
    assert course.title == "English for Hindi Speakers"
    assert course.source_language == "Hindi"
    assert course.target_language == "English"
    assert course.is_active is True


def test_four_units_exist_with_deterministic_ordering(seeded_session):
    """Verify 4 units exist with deterministic 1..4 ordering."""
    stmt = select(Course).where(Course.code == "en-hi")
    course = seeded_session.execute(stmt).scalar_one()
    assert len(course.units) == 4
    for idx, unit in enumerate(course.units, start=1):
        assert unit.order_index == idx


def test_skills_exist_with_deterministic_ordering(seeded_session):
    """Verify 10 skills exist distributed across the units with proper ordering."""
    stmt = select(Course).where(Course.code == "en-hi")
    course = seeded_session.execute(stmt).scalar_one()
    all_skills = [s for u in course.units for s in u.skills]
    assert len(all_skills) == 10

    for unit in course.units:
        assert len(unit.skills) > 0
        for idx, skill in enumerate(unit.skills, start=1):
            assert skill.order_index == idx
            assert skill.total_lessons > 0
            assert skill.node_type == "skill"


def test_lessons_exist_for_every_skill_with_ordering(seeded_session):
    """Verify each skill contains ordered lessons."""
    stmt = select(Skill)
    skills = seeded_session.execute(stmt).scalars().all()
    assert len(skills) == 10

    total_lessons = 0
    for skill in skills:
        assert len(skill.lessons) >= 3
        total_lessons += len(skill.lessons)
        for idx, lesson in enumerate(skill.lessons, start=1):
            assert lesson.order_index == idx
            assert lesson.xp_reward == 10
            assert lesson.is_active is True

    assert total_lessons == 30


def test_exercises_exist_for_every_lesson_with_ordering(seeded_session):
    """Verify each lesson contains ordered exercises."""
    stmt = select(Lesson)
    lessons = seeded_session.execute(stmt).scalars().all()
    assert len(lessons) == 30

    total_exercises = 0
    for lesson in lessons:
        assert len(lesson.exercises) >= 6
        total_exercises += len(lesson.exercises)
        for idx, exercise in enumerate(lesson.exercises, start=1):
            assert exercise.order_index == idx
            assert exercise.prompt
            assert exercise.question_data_json is not None
            assert exercise.answer_data_json is not None

    assert total_exercises == 180


def test_all_six_exercise_types_represented(seeded_session):
    """Verify all 6 required exercise types are represented in the dataset."""
    stmt = select(Exercise.type).distinct()
    types_found = set(seeded_session.execute(stmt).scalars().all())
    expected_types = {
        "multiple_choice",
        "translate",
        "word_bank",
        "match_pairs",
        "fill_blank",
        "type_answer",
    }
    assert expected_types.issubset(types_found), f"Missing types: {expected_types - types_found}"


def test_achievement_definitions_exist(seeded_session):
    """Verify all 5 required achievements are seeded."""
    stmt = select(Achievement)
    achievements = seeded_session.execute(stmt).scalars().all()
    assert len(achievements) == 5
    codes = {a.code for a in achievements}
    expected_codes = {
        "FIRST_LESSON",
        "100_XP",
        "THREE_DAY_STREAK",
        "FIVE_LESSONS",
        "FIRST_SKILL_COMPLETED",
    }
    assert expected_codes.issubset(codes)


def test_seed_idempotency_run_twice(db_session):
    """Verify that running seed_all twice does not duplicate records or crash."""
    # First execution
    seed_all(session=db_session)
    counts_run1 = {
        "users": db_session.scalar(select(func.count(User.id))),
        "user_stats": db_session.scalar(select(func.count(UserStats.user_id))),
        "courses": db_session.scalar(select(func.count(Course.id))),
        "units": db_session.scalar(select(func.count(Unit.id))),
        "skills": db_session.scalar(select(func.count(Skill.id))),
        "lessons": db_session.scalar(select(func.count(Lesson.id))),
        "exercises": db_session.scalar(select(func.count(Exercise.id))),
        "achievements": db_session.scalar(select(func.count(Achievement.id))),
    }

    # Second execution on the same database
    seed_all(session=db_session)
    counts_run2 = {
        "users": db_session.scalar(select(func.count(User.id))),
        "user_stats": db_session.scalar(select(func.count(UserStats.user_id))),
        "courses": db_session.scalar(select(func.count(Course.id))),
        "units": db_session.scalar(select(func.count(Unit.id))),
        "skills": db_session.scalar(select(func.count(Skill.id))),
        "lessons": db_session.scalar(select(func.count(Lesson.id))),
        "exercises": db_session.scalar(select(func.count(Exercise.id))),
        "achievements": db_session.scalar(select(func.count(Achievement.id))),
    }

    assert counts_run1 == counts_run2
    assert counts_run1["users"] == 6
    assert counts_run1["courses"] == 1
    assert counts_run1["units"] == 4
    assert counts_run1["skills"] == 10
    assert counts_run1["lessons"] == 30
    assert counts_run1["exercises"] == 180
    assert counts_run1["achievements"] == 5
