07 - Page Specifications
1. Learning Path Page

Route:

text
/

or:

text
/learn

Main elements:

Top navigation
User stats
Course information
Unit sections
Learning path
Skill nodes
Reward nodes
Mascot

API:

text
GET /api/v1/courses/{course_id}/path
GET /api/v1/me

Avoid unnecessary requests.

2. Learning Path Flow
text
Load course
    ↓
Load units
    ↓
Load skills
    ↓
Load progress
    ↓
Calculate display state
    ↓
Render path

The backend should provide sufficient information for the frontend to render the state.

3. Lesson Page

Route:

text
/lesson/{lesson_id}

Elements:

Exit button
Hearts
Progress indicator
Question
Answer area
Feedback
Continue button

Flow:

text
Load lesson
    ↓
Start attempt
    ↓
Show exercise
    ↓
Submit answer
    ↓
Receive feedback
    ↓
Next exercise
    ↓
Complete lesson
    ↓
Completion modal
4. Lesson Completion Modal

Show:

text
Lesson Complete!

+10 XP

Skill Progress
75%

Streak
5 days

Daily Goal
20 / 20

[Continue]

Use animation for:

XP
Progress
Completion state
5. Profile Page

Route:

text
/profile

Show:

Avatar
Username
XP
Current streak
Longest streak
Completed lessons
Completed skills
Achievements
Statistics
6. Leaderboard Page

Route:

text
/leaderboard

Show:

Ranking
Avatar
Username
XP
Current user highlight
7. Friends Page

Route:

text
/friends

Show:

Username search
Incoming friend requests
Outgoing requests
Accepted friends
Add / accept / reject / unfriend actions

API:

text
GET /api/v1/users/search
GET /api/v1/friends
GET /api/v1/friends/requests
POST /api/v1/friends/requests
POST /api/v1/friends/requests/{id}/accept
POST /api/v1/friends/requests/{id}/reject
DELETE /api/v1/friends/{user_id}

The learning path uses sticky unit headers so the current unit banner stays pinned while the path scrolls, matching the compact vertical path spacing of the product reference.
8. Settings Page

Route:

text
/settings

Initial settings can be placeholders.

Potential options:

Notifications
Sound
Language
Appearance
Account
9. Loading States

Every API-driven page must have appropriate loading states.

Examples:

Learning path skeleton
Lesson loading
Profile skeleton
Leaderboard skeleton
10. Error States

Example:

text
Something went wrong.

[Try Again]

Error messages should be understandable.

Do not display raw backend exceptions.

11. Empty States

Example:

text
No achievements yet.

Complete lessons to unlock achievements.
12. Navigation

The user should always understand:

Current page
Current progress
Next action
How to return

Avoid unnecessary navigation complexity.