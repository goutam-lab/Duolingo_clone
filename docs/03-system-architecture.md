03 - System Architecture
1. Architecture Overview

The application follows a layered full-stack architecture.

text
Browser
   |
   v
Next.js Frontend
   |
   | REST API
   v
FastAPI Backend
   |
   v
Service Layer
   |
   v
Repository / Data Access
   |
   v
SQLAlchemy
   |
   v
SQLite

The frontend must never directly access the database.

2. Frontend Architecture
text
frontend/
├── app/
├── components/
├── hooks/
├── lib/
├── types/
└── public/

Responsibilities:

Rendering
Navigation
UI state
User interactions
API communication
Animations
Loading states
Error states

The frontend must not contain authoritative business logic.

3. Backend Architecture
text
backend/
└── app/
    ├── api/
    │   └── routes/
    ├── core/
    ├── db/
    ├── models/
    ├── schemas/
    ├── services/
    ├── repositories/
    └── main.py
4. API Layer

The API layer handles:

HTTP requests
Validation
Dependency injection
Authentication abstraction
Response serialization

Routes should be thin.

Example:

python
@router.post("/lessons/{lesson_id}/complete")
def complete_lesson(...):
    return lesson_service.complete_lesson(...)

Business logic should not be placed directly in route handlers.

5. Service Layer

Services contain business logic.

Recommended services:

lesson_service.py
progress_service.py
gamification_service.py
achievement_service.py
user_service.py
6. Repository Layer

Repositories contain reusable database access logic.

Recommended repositories:

course_repository.py
lesson_repository.py
progress_repository.py
leaderboard_repository.py

Do not create repositories for trivial queries unless useful.

7. Database Layer

SQLAlchemy models represent:

Users
Courses
Units
Skills
Lessons
Exercises
Progress
Attempts
Achievements

Database sessions must have a clear lifecycle.

8. Course Architecture

Course hierarchy:

text
Course
  |
  └── Units
       |
       └── Skills
            |
            └── Lessons
                 |
                 └── Exercises
9. User Architecture

User hierarchy:

text
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
10. Learning Path API

Use a consolidated endpoint:

text
GET /api/v1/courses/{course_id}/path

It should return:

Course
Units
Skills
Lessons
Skill progress
Lesson progress
Unlock states
Required visual metadata

The frontend should render the complete path from this response.

11. User State API

Use a consolidated endpoint:

text
GET /api/v1/me

It should provide:

User
XP
Streak
Hearts
Gems
Daily goal
Other commonly required user state

Do not create separate requests for every header statistic.

12. Lesson API

Use:

text
GET /api/v1/lessons/{lesson_id}

The response should include all exercises required for the lesson.

Do not make one API request per exercise.

13. Answer API

Use:

text
POST /api/v1/lessons/{lesson_id}/attempts/{attempt_id}/answers

The backend:

Finds the exercise.
Finds authoritative answer data.
Validates the submitted answer.
Records the exercise attempt.
Updates hearts if required.
Returns feedback.
14. Lesson Completion API

Use:

text
POST /api/v1/lessons/{lesson_id}/attempts/{attempt_id}/complete

The backend verifies the attempt.

Then updates:

Lesson attempt
Lesson progress
Skill progress
User stats
Daily activity
Achievements

Use one database transaction.

15. Query Optimization

Avoid N+1 queries.

Bad:

text
Query course
Query every unit
Query skills for every unit
Query lessons for every skill
Query progress for every lesson

Good:

Batch queries
Joins
selectinload
joinedload
Composite indexes
Aggregate tables
16. Read Optimization

Use aggregate tables for frequently accessed state:

user_stats
skill_progress
lesson_progress

Historical tables:

lesson_attempts
exercise_attempts
daily_activity

should not be scanned repeatedly for normal page rendering.

17. Learning Path Performance

The learning path should require a small and stable number of database queries.

Do not make the number of database queries grow with:

Number of units
Number of skills
Number of lessons

Use batch loading.

18. Lesson Performance

Load all exercises for the lesson in a batch.

Use:

text
order_index

to determine exercise order.

19. Database Scalability

SQLite is required for the assignment.

The architecture must support future PostgreSQL migration.

Use:

text
DATABASE_URL

for configuration.

Avoid SQLite-specific application logic.

20. Deployment Architecture

Recommended:

text
User
 |
 v
Vercel
 |
Next.js
 |
 v
FastAPI Backend
 |
 v
Persistent SQLite Storage

SQLite must use persistent storage in deployment.

For a larger production system, PostgreSQL should be preferred.