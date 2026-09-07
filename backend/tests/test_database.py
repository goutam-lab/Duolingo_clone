import pytest
from datetime import date, datetime
from sqlalchemy import select, inspect
from sqlalchemy.exc import IntegrityError
from app.db.base import Base
from app.db.init_db import create_tables, drop_tables, reset_db
from app.models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserStats,
    SkillProgress,
    LessonProgress,
    LessonAttempt,
    ExerciseAttempt,
    DailyActivity,
    Achievement,
    UserAchievement,
)


def test_all_tables_created(db_engine):
    """Test that expected tables exist in the metadata and database."""
    inspector = inspect(db_engine)
    table_names = set(inspector.get_table_names())

    expected_tables = {
        "users",
        "courses",
        "units",
        "skills",
        "lessons",
        "exercises",
        "user_stats",
        "skill_progress",
        "lesson_progress",
        "lesson_attempts",
        "exercise_attempts",
        "daily_activity",
        "achievements",
        "user_achievements",
        "friendships",
    }
    assert expected_tables.issubset(table_names), f"Missing tables: {expected_tables - table_names}"
    assert len(expected_tables) == 15


def test_sqlite_foreign_key_enforcement(db_session):
    """Test that SQLite actively enforces foreign keys (child with invalid parent fails)."""
    # Attempt to insert Unit with non-existent course_id
    invalid_unit = Unit(
        course_id=99999,
        title="Invalid Unit",
        order_index=1,
    )
    db_session.add(invalid_unit)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_unique_username_constraint(db_session):
    """Test unique username constraint on users table."""
    user1 = User(username="unique_user", email="user1@example.com")
    db_session.add(user1)
    db_session.commit()

    user2 = User(username="unique_user", email="user2@example.com")
    db_session.add(user2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_unique_email_constraint(db_session):
    """Test unique email constraint on users table."""
    user1 = User(username="user1", email="same@example.com")
    db_session.add(user1)
    db_session.commit()

    user2 = User(username="user2", email="same@example.com")
    db_session.add(user2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_unit_ordering_uniqueness(db_session):
    """Test UNIQUE(course_id, order_index) constraint."""
    course = Course(code="es-en", title="Spanish", source_language="English", target_language="Spanish")
    db_session.add(course)
    db_session.commit()

    u1 = Unit(course_id=course.id, title="Unit 1", order_index=1)
    db_session.add(u1)
    db_session.commit()

    u2 = Unit(course_id=course.id, title="Duplicate Unit 1", order_index=1)
    db_session.add(u2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_skill_ordering_uniqueness(db_session):
    """Test UNIQUE(unit_id, order_index) constraint."""
    course = Course(code="fr-en", title="French", source_language="English", target_language="French")
    db_session.add(course)
    db_session.commit()
    unit = Unit(course_id=course.id, title="Basics", order_index=1)
    db_session.add(unit)
    db_session.commit()

    s1 = Skill(unit_id=unit.id, title="Skill 1", order_index=1)
    db_session.add(s1)
    db_session.commit()

    s2 = Skill(unit_id=unit.id, title="Skill Duplicate", order_index=1)
    db_session.add(s2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_lesson_ordering_uniqueness(db_session):
    """Test UNIQUE(skill_id, order_index) constraint."""
    course = Course(code="de-en", title="German", source_language="English", target_language="German")
    db_session.add(course)
    db_session.commit()
    unit = Unit(course_id=course.id, title="Basics", order_index=1)
    db_session.add(unit)
    db_session.commit()
    skill = Skill(unit_id=unit.id, title="Greetings", order_index=1)
    db_session.add(skill)
    db_session.commit()

    l1 = Lesson(skill_id=skill.id, title="Lesson 1", order_index=1)
    db_session.add(l1)
    db_session.commit()

    l2 = Lesson(skill_id=skill.id, title="Lesson Duplicate", order_index=1)
    db_session.add(l2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_exercise_ordering_uniqueness(db_session):
    """Test UNIQUE(lesson_id, order_index) constraint."""
    course = Course(code="it-en", title="Italian", source_language="English", target_language="Italian")
    db_session.add(course)
    db_session.commit()
    unit = Unit(course_id=course.id, title="Basics", order_index=1)
    db_session.add(unit)
    db_session.commit()
    skill = Skill(unit_id=unit.id, title="Food", order_index=1)
    db_session.add(skill)
    db_session.commit()
    lesson = Lesson(skill_id=skill.id, title="Lesson 1", order_index=1)
    db_session.add(lesson)
    db_session.commit()

    ex1 = Exercise(
        lesson_id=lesson.id,
        type="multiple_choice",
        prompt="Choose 'Water'",
        question_data_json={"options": ["Acqua", "Pane"]},
        answer_data_json={"correct_option": "Acqua"},
        order_index=1,
    )
    db_session.add(ex1)
    db_session.commit()

    ex2 = Exercise(
        lesson_id=lesson.id,
        type="multiple_choice",
        prompt="Choose 'Bread'",
        question_data_json={"options": ["Acqua", "Pane"]},
        answer_data_json={"correct_option": "Pane"},
        order_index=1,
    )
    db_session.add(ex2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_user_skill_progress_uniqueness(db_session):
    """Test UNIQUE(user_id, skill_id) constraint on skill_progress."""
    user = User(username="progress_user", email="progress@example.com")
    course = Course(code="ja-en", title="Japanese", source_language="English", target_language="Japanese")
    db_session.add_all([user, course])
    db_session.commit()

    unit = Unit(course_id=course.id, title="Basics", order_index=1)
    db_session.add(unit)
    db_session.commit()

    skill = Skill(unit_id=unit.id, title="Hiragana 1", order_index=1)
    db_session.add(skill)
    db_session.commit()

    p1 = SkillProgress(user_id=user.id, skill_id=skill.id, lessons_completed=1)
    db_session.add(p1)
    db_session.commit()

    p2 = SkillProgress(user_id=user.id, skill_id=skill.id, lessons_completed=2)
    db_session.add(p2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_user_lesson_progress_uniqueness(db_session):
    """Test UNIQUE(user_id, lesson_id) constraint on lesson_progress."""
    user = User(username="lp_user", email="lp@example.com")
    course = Course(code="ko-en", title="Korean", source_language="English", target_language="Korean")
    db_session.add_all([user, course])
    db_session.commit()

    unit = Unit(course_id=course.id, title="Basics", order_index=1)
    db_session.add(unit)
    db_session.commit()

    skill = Skill(unit_id=unit.id, title="Hangul", order_index=1)
    db_session.add(skill)
    db_session.commit()

    lesson = Lesson(skill_id=skill.id, title="Lesson 1", order_index=1)
    db_session.add(lesson)
    db_session.commit()

    lp1 = LessonProgress(user_id=user.id, lesson_id=lesson.id, is_completed=True)
    db_session.add(lp1)
    db_session.commit()

    lp2 = LessonProgress(user_id=user.id, lesson_id=lesson.id, is_completed=False)
    db_session.add(lp2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_user_daily_activity_uniqueness(db_session):
    """Test UNIQUE(user_id, activity_date) constraint on daily_activity."""
    user = User(username="daily_user", email="daily@example.com")
    db_session.add(user)
    db_session.commit()

    today = date(2026, 9, 7)
    da1 = DailyActivity(user_id=user.id, activity_date=today, xp_earned=20)
    db_session.add(da1)
    db_session.commit()

    da2 = DailyActivity(user_id=user.id, activity_date=today, xp_earned=10)
    db_session.add(da2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_user_achievement_uniqueness(db_session):
    """Test UNIQUE(user_id, achievement_id) constraint on user_achievements."""
    user = User(username="ach_user", email="ach@example.com")
    ach = Achievement(
        code="FIRST_LESSON",
        title="First Lesson",
        description="Completed your first lesson",
        icon_key="first_lesson",
        requirement_json={"lessons_completed": 1},
    )
    db_session.add_all([user, ach])
    db_session.commit()

    ua1 = UserAchievement(user_id=user.id, achievement_id=ach.id)
    db_session.add(ua1)
    db_session.commit()

    ua2 = UserAchievement(user_id=user.id, achievement_id=ach.id)
    db_session.add(ua2)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_user_stats_one_to_one(db_session):
    """Test UserStats 1:1 relationship with User."""
    user = User(username="stats_user", email="stats@example.com")
    stats = UserStats(
        user=user,
        total_xp=150,
        current_streak=3,
        longest_streak=5,
        hearts=4,
        max_hearts=5,
        gems=120,
    )
    db_session.add_all([user, stats])
    db_session.commit()

    queried_user = db_session.execute(select(User).where(User.id == user.id)).scalar_one()
    assert queried_user.stats is not None
    assert queried_user.stats.total_xp == 150
    assert queried_user.stats.hearts == 4
    assert queried_user.stats.user_id == user.id


def test_course_hierarchy_relationships(db_session):
    """Test Course -> Unit -> Skill -> Lesson -> Exercise traversal."""
    course = Course(code="en-hi", title="English for Hindi Speakers", source_language="Hindi", target_language="English")
    unit = Unit(course=course, title="Unit 1: Basics", order_index=1)
    skill = Skill(unit=unit, title="Greetings", order_index=1, total_lessons=1)
    lesson = Lesson(skill=skill, title="Hello & Bye", order_index=1, xp_reward=10)
    exercise = Exercise(
        lesson=lesson,
        type="multiple_choice",
        prompt="Translate 'Namaste'",
        question_data_json={"options": ["Hello", "Goodbye"]},
        answer_data_json={"correct_option": "Hello"},
        order_index=1,
    )
    db_session.add(course)
    db_session.commit()

    fetched_course = db_session.execute(select(Course).where(Course.id == course.id)).scalar_one()
    assert len(fetched_course.units) == 1
    assert len(fetched_course.units[0].skills) == 1
    assert len(fetched_course.units[0].skills[0].lessons) == 1
    assert len(fetched_course.units[0].skills[0].lessons[0].exercises) == 1
    assert fetched_course.units[0].skills[0].lessons[0].exercises[0].type == "multiple_choice"


def test_user_attempts_relationship(db_session):
    """Test User -> LessonAttempt -> ExerciseAttempt relationship."""
    user = User(username="attempt_user", email="attempt@example.com")
    course = Course(code="zh-en", title="Chinese", source_language="English", target_language="Chinese")
    unit = Unit(course=course, title="Pinyin", order_index=1)
    skill = Skill(unit=unit, title="Tones", order_index=1)
    lesson = Lesson(skill=skill, title="Tone 1", order_index=1)
    exercise = Exercise(
        lesson=lesson,
        type="type_answer",
        prompt="Type 'ma'",
        question_data_json={},
        answer_data_json={"accepted_answers": ["ma"]},
        order_index=1,
    )
    db_session.add(course)
    db_session.commit()

    attempt = LessonAttempt(user=user, lesson=lesson, score=100, xp_earned=10, is_completed=True)
    ex_attempt = ExerciseAttempt(
        lesson_attempt=attempt,
        exercise=exercise,
        answer_data_json={"answer": "ma"},
        is_correct=True,
    )
    db_session.add_all([user, attempt, ex_attempt])
    db_session.commit()

    fetched_user = db_session.execute(select(User).where(User.id == user.id)).scalar_one()
    assert len(fetched_user.lesson_attempts) == 1
    assert len(fetched_user.lesson_attempts[0].exercise_attempts) == 1
    assert fetched_user.lesson_attempts[0].exercise_attempts[0].is_correct is True


def test_cascade_course_deletion(db_session):
    """Test that deleting a course deletes its units, skills, lessons, and exercises."""
    course = Course(code="cascade-test", title="Test", source_language="A", target_language="B")
    unit = Unit(course=course, title="U1", order_index=1)
    skill = Skill(unit=unit, title="S1", order_index=1)
    lesson = Lesson(skill=skill, title="L1", order_index=1)
    exercise = Exercise(
        lesson=lesson,
        type="fill_blank",
        prompt="Fill",
        question_data_json={},
        answer_data_json={},
        order_index=1,
    )
    db_session.add(course)
    db_session.commit()

    course_id = course.id
    unit_id = unit.id
    skill_id = skill.id
    lesson_id = lesson.id
    exercise_id = exercise.id

    db_session.delete(course)
    db_session.commit()

    assert db_session.execute(select(Course).where(Course.id == course_id)).first() is None
    assert db_session.execute(select(Unit).where(Unit.id == unit_id)).first() is None
    assert db_session.execute(select(Skill).where(Skill.id == skill_id)).first() is None
    assert db_session.execute(select(Lesson).where(Lesson.id == lesson_id)).first() is None
    assert db_session.execute(select(Exercise).where(Exercise.id == exercise_id)).first() is None


def test_cascade_user_deletion(db_session):
    """Test that deleting a user deletes user_stats, progress, attempts, activities, achievements, but NOT course content."""
    course = Course(code="user-del-test", title="Keep Course", source_language="A", target_language="B")
    unit = Unit(course=course, title="U1", order_index=1)
    skill = Skill(unit=unit, title="S1", order_index=1)
    lesson = Lesson(skill=skill, title="L1", order_index=1)
    exercise = Exercise(
        lesson=lesson,
        type="match_pairs",
        prompt="Match",
        question_data_json={},
        answer_data_json={},
        order_index=1,
    )
    ach = Achievement(
        code="TEST_ACH",
        title="Test",
        description="Desc",
        icon_key="key",
        requirement_json={},
    )
    db_session.add_all([course, ach])
    db_session.commit()

    user = User(username="del_user", email="del@example.com")
    stats = UserStats(user=user, total_xp=50)
    sp = SkillProgress(user=user, skill=skill)
    lp = LessonProgress(user=user, lesson=lesson)
    attempt = LessonAttempt(user=user, lesson=lesson)
    ex_attempt = ExerciseAttempt(lesson_attempt=attempt, exercise=exercise, answer_data_json={}, is_correct=True)
    activity = DailyActivity(user=user, activity_date=date(2026, 9, 7))
    uach = UserAchievement(user=user, achievement=ach)

    db_session.add_all([user, stats, sp, lp, attempt, ex_attempt, activity, uach])
    db_session.commit()

    user_id = user.id
    course_id = course.id

    db_session.delete(user)
    db_session.commit()

    # User state must be gone
    assert db_session.execute(select(User).where(User.id == user_id)).first() is None
    assert db_session.execute(select(UserStats).where(UserStats.user_id == user_id)).first() is None
    assert db_session.execute(select(SkillProgress).where(SkillProgress.user_id == user_id)).first() is None
    assert db_session.execute(select(LessonProgress).where(LessonProgress.user_id == user_id)).first() is None
    assert db_session.execute(select(LessonAttempt).where(LessonAttempt.user_id == user_id)).first() is None
    assert db_session.execute(select(DailyActivity).where(DailyActivity.user_id == user_id)).first() is None
    assert db_session.execute(select(UserAchievement).where(UserAchievement.user_id == user_id)).first() is None

    # Course content and master achievements must remain intact
    assert db_session.execute(select(Course).where(Course.id == course_id)).first() is not None
    assert db_session.execute(select(Achievement).where(Achievement.id == ach.id)).first() is not None


def test_clean_state_database_creation(db_engine):
    """Test that database can be dropped and recreated from clean state."""
    drop_tables(db_engine)
    inspector_empty = inspect(db_engine)
    assert len(inspector_empty.get_table_names()) == 0

    create_tables(db_engine)
    inspector_recreated = inspect(db_engine)
    assert len(inspector_recreated.get_table_names()) == 15
