04 - Database Schema
1. Database Design Goals

The database must provide:

Data integrity
Fast reads
Efficient writes
Normalized course content
Read-optimized user state
Historical records
Good indexing
Future PostgreSQL compatibility

The schema should avoid unnecessary queries.

2. Entity Relationship
text
Course
  |
  └── Unit
       |
       └── Skill
            |
            └── Lesson
                 |
                 └── Exercise


User
 |
 ├── UserStats
 ├── SkillProgress
 ├── LessonProgress
 ├── LessonAttempts
 │      |
 │      └── ExerciseAttempts
 ├── DailyActivity
 └── UserAchievements
3. users

Stores user identity.

Fields:

id
username
email
avatar_key
is_active
created_at
updated_at

Constraints:

UNIQUE(username)
UNIQUE(email)

Indexes:

username
email
is_active

Do not store XP, streak, or hearts here.

4. courses

Stores language courses.

Fields:

id
code
title
source_language
target_language
description
is_active
created_at
updated_at

Constraint:

UNIQUE(code)
5. units

Groups skills within a course.

Fields:

id
course_id
title
description
order_index
created_at

Constraint:

UNIQUE(course_id, order_index)

Index:

(course_id, order_index)
6. skills

Represents a learning skill.

Fields:

id
unit_id
title
description
order_index
icon_key
node_type
total_lessons
created_at

Constraint:

UNIQUE(unit_id, order_index)

Index:

(unit_id, order_index)

Do not store pixel coordinates.

7. lessons

Represents a playable lesson.

Fields:

id
skill_id
title
order_index
xp_reward
estimated_seconds
is_active
created_at
updated_at

Constraint:

UNIQUE(skill_id, order_index)

Index:

(skill_id, order_index)
8. exercises

Stores exercises.

Fields:

id
lesson_id
type
prompt
question_data_json
answer_data_json
order_index
created_at

Constraint:

UNIQUE(lesson_id, order_index)

Index:

(lesson_id, order_index)

Supported types:

multiple_choice
translate
word_bank
match_pairs
fill_blank
type_answer
9. Exercise Question Data

question_data_json contains safe rendering information.

Example:

json
{
  "options": [
    "Hello",
    "Goodbye",
    "Thanks",
    "Please"
  ]
}

This data may be returned to the frontend.

10. Exercise Answer Data

answer_data_json contains authoritative answer information.

Example:

json
{
  "correct_option": "Hello"
}

This must never be returned by the normal lesson endpoint.

The backend uses it during validation.

11. user_stats

One row per user.

Fields:

user_id
total_xp
current_streak
longest_streak
last_activity_date
hearts
max_hearts
gems
daily_goal_xp
daily_goal_progress
daily_goal_date
created_at
updated_at

Primary key:

user_id

This table is intentionally read-optimized.

It prevents repeatedly calculating:

XP
Streak
Hearts
Daily goal
Gems

from historical data.

12. skill_progress

Stores current user progress for each skill.

Fields:

id
user_id
skill_id
lessons_completed
crown_level
total_xp_earned
best_score
last_completed_at
created_at
updated_at

Constraint:

UNIQUE(user_id, skill_id)

Index:

(user_id, skill_id)
13. lesson_progress

Stores current user progress for each lesson.

Fields:

id
user_id
lesson_id
is_completed
attempts_count
best_score
last_attempt_at
completed_at
created_at
updated_at

Constraint:

UNIQUE(user_id, lesson_id)

Index:

(user_id, lesson_id)
14. lesson_attempts

Stores historical lesson sessions.

Fields:

id
user_id
lesson_id
started_at
completed_at
score
xp_earned
hearts_lost
is_completed

Indexes:

(user_id, lesson_id, started_at)
(user_id, started_at)

This is historical data.

Do not use it as the primary source for current lesson completion.

15. exercise_attempts

Stores individual exercise answers.

Fields:

id
lesson_attempt_id
exercise_id
answer_data_json
is_correct
answered_at

Indexes:

(lesson_attempt_id, exercise_id)
(exercise_id)

This enables future analytics.

16. daily_activity

Stores one row per user per calendar day.

Fields:

id
user_id
activity_date
xp_earned
lessons_completed
exercises_answered
created_at
updated_at

Constraint:

UNIQUE(user_id, activity_date)

Index:

(user_id, activity_date)
17. achievements

Stores achievement definitions.

Fields:

id
code
title
description
icon_key
requirement_json
created_at

Constraint:

UNIQUE(code)
18. user_achievements

Stores unlocked achievements.

Fields:

id
user_id
achievement_id
unlocked_at

Constraint:

UNIQUE(user_id, achievement_id)

Index:

(user_id, achievement_id)
19. Why Aggregate Tables Exist

Historical data answers:

"What happened?"

Current state answers:

"What is true now?"

Historical:

lesson_attempts
exercise_attempts
daily_activity

Current:

user_stats
skill_progress
lesson_progress

This separation makes frequently used pages faster.

20. Example

Suppose a user has completed 2,000 lessons.

Do not calculate total completed lessons by scanning all attempts every time.

Instead use:

lesson_progress

and aggregate state.

Similarly, do not calculate total XP repeatedly.

Use:

user_stats.total_xp
21. Learning Path Query

The learning path should retrieve:

Course
Units
Skills
Lessons
SkillProgress
LessonProgress

using optimized batch queries.

Avoid:

one query per unit
one query per skill
one query per lesson
22. Leaderboard

Do not create a separate leaderboard table.

Use:

users
user_stats

Example:

sql
SELECT
    users.id,
    users.username,
    users.avatar_key,
    user_stats.total_xp
FROM users
JOIN user_stats
    ON user_stats.user_id = users.id
WHERE users.is_active = TRUE
ORDER BY user_stats.total_xp DESC
LIMIT 100;

Add an index on:

user_stats.total_xp

if required by the query plan.

23. Database Constraints

Use:

Primary keys
Foreign keys
Unique constraints
Not-null constraints
Check constraints where useful

Important uniqueness:

users.username
users.email
units(course_id, order_index)
skills(unit_id, order_index)
lessons(skill_id, order_index)
exercises(lesson_id, order_index)
skill_progress(user_id, skill_id)
lesson_progress(user_id, lesson_id)
daily_activity(user_id, activity_date)
user_achievements(user_id, achievement_id)
24. Database Query Principles

Always ask:

Can this be fetched in a batch?
Is an index available?
Is this data already stored as an aggregate?
Will this create an N+1 query?
Is this query executed frequently?

Optimize based on actual access patterns.

Do not add unnecessary complexity.

25. Future PostgreSQL Migration

The schema must remain compatible with PostgreSQL.

Avoid:

SQLite-specific SQL
SQLite-only application behavior
Frontend database access
Hardcoded database paths

Use SQLAlchemy abstractions wherever possible.