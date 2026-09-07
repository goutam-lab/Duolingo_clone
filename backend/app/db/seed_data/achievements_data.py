"""Deterministic seed definitions for achievement catalogs."""

ACHIEVEMENTS_SEED_DATA = [
    {
        "code": "FIRST_LESSON",
        "title": "First Step",
        "description": "Complete your very first lesson.",
        "icon_key": "first_lesson",
        "requirement_json": {
            "type": "lessons_completed",
            "threshold": 1,
        },
    },
    {
        "code": "100_XP",
        "title": "Century Club",
        "description": "Earn 100 total XP on your language journey.",
        "icon_key": "xp_100",
        "requirement_json": {
            "type": "total_xp",
            "threshold": 100,
        },
    },
    {
        "code": "THREE_DAY_STREAK",
        "title": "Habit Former",
        "description": "Maintain a learning streak for 3 consecutive days.",
        "icon_key": "streak_3",
        "requirement_json": {
            "type": "streak_days",
            "threshold": 3,
        },
    },
    {
        "code": "FIVE_LESSONS",
        "title": "Dedicated Learner",
        "description": "Successfully complete 5 lessons.",
        "icon_key": "lessons_5",
        "requirement_json": {
            "type": "lessons_completed",
            "threshold": 5,
        },
    },
    {
        "code": "FIRST_SKILL_COMPLETED",
        "title": "Skill Master",
        "description": "Complete all lessons in any skill to achieve crown mastery.",
        "icon_key": "skill_complete",
        "requirement_json": {
            "type": "skills_completed",
            "threshold": 1,
        },
    },
]
