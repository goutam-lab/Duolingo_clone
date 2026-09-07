09 - Business Logic
1. Business Logic Authority

All authoritative business logic belongs to the backend.

The frontend only displays results.

2. Skill Status

Possible states:

text
locked
available
in_progress
completed

Status should be derived from:

Prerequisites
Lesson completion
Skill progress

Avoid storing duplicated status unless required.

3. Sequential Skill Unlocking

Initial implementation:

text
Skill 1
   ↓
Skill 2
   ↓
Skill 3
   ↓
Skill 4

Rules:

First skill is available.
Later skills are locked until the previous skill is completed.
Completed skills remain completed.
Partially completed skills are in progress.
4. Lesson Status

Possible states:

text
locked
available
completed

A lesson becomes available when:

Its skill is available.
Previous lesson requirements are satisfied.
5. Answer Validation

Process:

text
Receive exercise ID
    ↓
Load exercise
    ↓
Load authoritative answer
    ↓
Normalize submitted answer
    ↓
Compare answer
    ↓
Create exercise attempt
    ↓
Deduct heart if incorrect
    ↓
Return feedback
6. Text Answer Normalization

For text-based answers:

Trim leading/trailing whitespace.
Normalize repeated whitespace where appropriate.
Normalize case when allowed.
Preserve meaningful word order.

Do not use overly aggressive normalization.

7. Hearts

Default:

text
max_hearts = 5
hearts = 5

Incorrect answer:

text
hearts -= 1

Correct answer:

text
hearts unchanged

Never allow:

text
hearts < 0
8. XP

Each lesson contains:

text
xp_reward

Example:

text
10 XP

On successful completion:

text
user_stats.total_xp += lesson.xp_reward

Also update:

text
daily_activity.xp_earned

user_stats.daily_goal_progress
9. Streak

Algorithm:

text
if no previous activity:
    streak = 1

elif activity_date == last_activity_date:
    streak unchanged

elif activity_date == last_activity_date + 1 day:
    streak += 1

else:
    streak = 1

Then:

text
longest_streak =
max(longest_streak, current_streak)

Use one consistent timezone strategy.

10. Daily Goal

Default:

text
20 XP

If user earns:

text
10 XP

display:

text
10 / 20

If user earns another:

text
15 XP

display:

text
20 / 20

Displayed progress can be capped.

Actual XP must remain accurate.

11. Skill Progress

Example:

text
4 lessons total
2 completed

Progress:

text
50%

Formula:

text
lessons_completed / total_lessons * 100

The backend determines the value.

12. Crown Level

Initial implementation may use:

text
0 = not started
1 = basic completion
2 = advanced mastery
3 = high mastery

Thresholds must be defined in backend logic.

The frontend must not calculate crown level.

13. Lesson Completion

A lesson is completed when all required exercises have been answered according to lesson rules.

On completion:

Validate attempt.
Mark lesson attempt completed.
Update lesson progress.
Update skill progress.
Award XP.
Update user stats.
Update daily activity.
Update streak.
Update daily goal.
Check achievements.
14. Transactions

Lesson completion must use a database transaction.

Conceptually:

text
BEGIN TRANSACTION

update lesson_attempt

update lesson_progress

update skill_progress

update user_stats

update daily_activity

check achievements

insert user achievements

COMMIT

On critical failure:

text
ROLLBACK
15. Idempotency

Completing the same lesson attempt twice must not award XP twice.

Before awarding XP:

text
if lesson_attempt.is_completed:
    do not award XP again

Use database constraints where appropriate.

16. Concurrency

Protect against:

Double-click
Network retry
Duplicate request
Concurrent completion

Do not allow:

Double XP
Duplicate achievements
Invalid hearts
Duplicate completion

Use transactions and database constraints.

17. Achievement Logic

Initial achievements:

FIRST_LESSON
100_XP
THREE_DAY_STREAK
FIVE_LESSONS
FIRST_SKILL_COMPLETED

Achievements must be idempotent.

Use:

text
UNIQUE(user_id, achievement_id)
18. Leaderboard Logic

Leaderboard uses:

users
user_stats

Order:

text
total_xp DESC

No dedicated leaderboard table is required.

19. Client vs Server

Client sends:

exercise_id
answer
attempt_id

Server decides:

is_correct
hearts
xp
streak
progress
completion
achievements

The client must never become the source of truth.

20. Business Logic Principles

Business rules must be:

Centralized
Testable
Transaction-safe
Deterministic
Independent from UI

Do not duplicate business logic across API routes and frontend components.