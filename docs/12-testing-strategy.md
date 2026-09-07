12 - Testing Strategy
1. Testing Goal

The most important goal is verifying the complete learning loop:

text
Lesson
→ Exercise
→ Answer
→ Validation
→ Feedback
→ Hearts
→ Completion
→ XP
→ Progress
→ Streak
→ Daily Goal
→ Achievement
2. Backend Unit Tests

Test individual business functions.

3. Answer Validation Tests

Test:

Correct answer
Incorrect answer
Case normalization
Whitespace normalization
Multiple accepted answers
Invalid answer
Invalid exercise ID
4. Heart Tests

Starting:

text
5 hearts

Wrong answer:

text
4 hearts

Repeated wrong answers:

text
3
2
1
0

Hearts must never become negative.

5. XP Tests

Before:

text
100 XP

Lesson reward:

text
10 XP

After:

text
110 XP

Completing the same attempt twice must not award XP twice.

6. Streak Tests

Test:

First activity → 1
Same-day activity → unchanged
Next-day activity → +1
Missed day → reset to 1

Also test longest streak.

7. Daily Goal Tests

Goal:

text
20 XP

After:

text
5 XP

Expected:

text
5 / 20

After reaching the goal:

text
20 / 20
8. Skill Progress Tests

Example:

text
4 lessons total

2 completed

Expected:

text
50%

After all four:

text
100%
9. Lesson Progress Tests

Before completion:

text
is_completed = false

After completion:

text
is_completed = true

Attempt count should increase correctly.

10. Achievement Tests

Example:

text
FIRST_LESSON

After first lesson:

text
unlocked

Repeated completion must not create duplicate achievements.

11. Database Tests

Verify:

Foreign keys
Unique constraints
Required fields
Duplicate progress prevention
Duplicate achievement prevention
Daily activity uniqueness
Seed repeatability
12. API Tests

Test:

text
GET /health

GET /me

GET /courses/{course_id}/path

GET /lessons/{lesson_id}

POST /lessons/{lesson_id}/attempts

POST /lessons/{lesson_id}/attempts/{attempt_id}/answers

POST /lessons/{lesson_id}/attempts/{attempt_id}/complete

GET /profile/{user_id}

GET /leaderboard

GET /achievements

GET /me/achievements

Test both successful and invalid requests.

13. Security Tests

Verify:

Correct answer is not returned by lesson endpoint.
Client cannot set XP.
Client cannot set hearts.
Client cannot set streak.
Client cannot set progress.
Client cannot mark lesson completed without completing requirements.
Client cannot unlock arbitrary skills.
Client cannot award achievements.
14. N+1 Query Tests

Inspect important queries.

Especially:

Learning path
Lesson loading
Profile
Leaderboard

Ensure the number of queries does not grow linearly with the number of units, skills, lessons, or exercises.

15. Frontend Tests

Verify:

Learning path renders.
Locked skill cannot be opened.
Available skill can be opened.
Lesson loads.
Exercise renderer selects correct component.
Answer feedback appears.
Hearts update.
Completion modal appears.
Profile displays correct data.
Leaderboard displays correct rankings.
16. End-to-End Test

The critical E2E flow:

text
Open application
↓
Learning path loads
↓
Available skill visible
↓
Open lesson
↓
Start attempt
↓
Answer exercise
↓
Receive feedback
↓
Continue
↓
Complete exercises
↓
Complete lesson
↓
Receive XP
↓
Hearts updated
↓
Skill progress updated
↓
Lesson progress updated
↓
Streak updated
↓
Daily goal updated
↓
Achievement checked
↓
Return to learning path
↓
Completed state visible
17. Persistence Test

Complete a lesson.

Refresh the browser.

Verify:

XP remains updated.
Lesson remains completed.
Skill progress remains updated.
Streak remains correct.
Daily goal remains correct.
Achievement remains unlocked.
18. Duplicate Request Test

Send lesson completion twice.

Expected:

Lesson remains completed.
XP is awarded only once.
Achievement is created only once.
No inconsistent state occurs.
19. Error Tests

Test:

Invalid lesson ID
Invalid exercise ID
Invalid attempt ID
Locked lesson
Unauthorized attempt
Already completed attempt
Invalid answer
Missing required fields
20. Frontend Build Test

Before completing frontend work:

bash
npm run build

must succeed.

No TypeScript errors should remain.

21. Backend Test

Backend must:

Start successfully.
Connect to database.
Run migrations/initialization correctly.
Serve API requests.
Pass relevant tests.
22. Regression Testing

After changes to:

Database
API
Lesson service
Progress service
Gamification service
Exercise components
Learning path

rerun relevant tests.

After major phases, run the complete learning flow.

23. Definition of Done

A feature is considered complete only when:

text
Implementation complete
+
Tests written
+
Tests passing
+
Application runs
+
No known critical errors
+
Documentation synchronized
+
TASKS.md updated