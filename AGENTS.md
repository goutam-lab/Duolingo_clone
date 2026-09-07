# Duolingo Full-Stack Clone - Agent Instructions

## 1. Project Goal

Build a polished full-stack language learning application inspired by the
core learning experience of Duolingo.

The application must implement this complete learning loop:

Learning Path
→ Skill
→ Lesson
→ Exercise
→ Answer
→ Immediate Feedback
→ Lesson Completion
→ XP / Hearts / Streak / Progress

The application should feel like a real gamified language-learning product,
not a generic quiz application.

The project is being built as a full-stack engineering assignment.

AI coding tools are allowed and encouraged, but all generated code must remain
understandable, maintainable, and explainable by the developer.

---

# 2. Technology Stack

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- Lucide React

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic

## Database

- SQLite for the assignment
- SQLAlchemy ORM
- Database URL must be configurable using environment variables

The schema should remain easy to migrate to PostgreSQL in the future.

---

# 3. Architecture

The frontend must never access the database directly.

Required architecture:

Browser
    ↓
Next.js Frontend
    ↓
REST API
    ↓
FastAPI
    ↓
Service Layer
    ↓
SQLAlchemy
    ↓
SQLite

Frontend responsibilities:

- Rendering
- UI state
- Animations
- User interactions
- API communication
- Loading states
- Error states
- Displaying server-provided state

Backend responsibilities:

- Validation
- Answer checking
- XP calculation
- Hearts calculation
- Streak calculation
- Skill progression
- Lesson completion
- Achievement logic
- Persistence
- Authorization abstraction

Database responsibilities:

- Persistent source of truth
- Course content
- User state
- Historical activity
- Progress
- Attempts
- Achievements

---

# 4. Source of Truth

Before implementing a feature, read the relevant documentation:

1. docs/01-requirements.md
2. docs/02-features.md
3. docs/03-system-architecture.md
4. docs/04-database-schema.md
5. docs/05-api-specification.md
6. docs/06-ui-design-system.md
7. docs/07-page-specifications.md
8. docs/08-component-architecture.md
9. docs/09-business-logic.md
10. docs/10-seed-data.md
11. docs/11-development-roadmap.md
12. docs/12-testing-strategy.md

Do not contradict these documents without explaining the reason and updating
the relevant documentation.

---

# 5. Database Rules

Use a normalized relational schema for course content.

Use read-optimized aggregate tables for frequently displayed user state.

Important aggregate tables:

- user_stats
- skill_progress
- lesson_progress
- daily_activity

Do not calculate frequently displayed values by scanning historical attempts.

For example:

BAD:

Calculate total XP by:
SELECT SUM(xp) FROM lesson_attempts WHERE user_id = ...

GOOD:

Read:
user_stats.total_xp

Historical attempts should still exist for analytics and history.

---

# 6. Query Optimization Rules

Avoid N+1 queries.

The learning path should be loaded using a small number of queries,
preferably one optimized query for course structure and user progress.

Do not do:

for unit in units:
    query skills

for skill in skills:
    query lessons

Instead use:

- SQL joins
- SQLAlchemy selectinload/joinedload where appropriate
- Aggregated queries
- Proper indexes

Use composite indexes for frequently used relationships.

Important indexes include:

- users.username
- users.email
- units(course_id, order_index)
- skills(unit_id, order_index)
- lessons(skill_id, order_index)
- exercises(lesson_id, order_index)
- skill_progress(user_id, skill_id)
- lesson_progress(user_id, lesson_id)
- lesson_attempts(user_id, lesson_id, started_at)
- exercise_attempts(lesson_attempt_id, exercise_id)
- daily_activity(user_id, activity_date)
- user_achievements(user_id, achievement_id)

---

# 7. Backend Authority

The client must never be trusted for:

- XP
- Hearts
- Streak
- Skill progress
- Lesson completion
- Correct answer
- Achievement unlocking
- Gems

The frontend may send:

- Selected answer
- Exercise ID
- Lesson attempt ID

The backend determines:

- Whether the answer is correct
- XP earned
- Hearts lost
- Whether the lesson is completed
- Skill progress
- Streak
- Daily goal progress
- Achievements

---

# 8. Correct Answer Security

Do not send correct answers to the frontend before the user submits an answer.

Lesson APIs may return:

- exercise ID
- exercise type
- prompt
- options
- word bank
- match pairs
- metadata required for rendering

They must not return the authoritative correct answer.

The backend validates answers.

---

# 9. Exercise Types

The application must support:

1. multiple_choice
2. translate
3. word_bank
4. match_pairs
5. fill_blank
6. type_answer

Use a common exercise model.

Type-specific information should be stored in JSON metadata where appropriate.

The frontend should use:

ExerciseRenderer

to select the correct exercise component.

---

# 10. UI Requirements

The UI must be:

- Playful
- Gamified
- Responsive
- Modern
- Visually polished
- Animation-rich
- Mobile friendly

Learning path requirements:

- Vertical learning path
- Curved connectors
- Circular skill nodes
- Progress rings
- Locked nodes
- Available nodes
- Completed nodes
- Reward nodes
- Unit headers
- Mascot-style visual elements

Use:

- SVG
- CSS
- React
- Framer Motion
- Lucide React
- Custom SVG assets where needed

Do not implement the entire learning path as one static image.

The screenshot in:

design/references/

is only a visual reference.

Do not copy proprietary source code or proprietary assets.

---

# 11. Business Logic

Business logic belongs in backend service modules.

Recommended structure:

backend/
    app/
        api/
        models/
        schemas/
        services/
        repositories/
        core/
        db/

Do not place business rules directly inside route handlers.

Routes should call services.

---

# 12. Transactions

Lesson submission and completion must use database transactions.

A lesson completion may update:

- lesson_attempt
- lesson_progress
- skill_progress
- user_stats
- daily_activity
- achievements

These updates should be treated as one logical operation.

If a critical update fails, the transaction should roll back.

---

# 13. Code Quality

Prefer:

- Small functions
- Reusable components
- Strong TypeScript types
- Pydantic schemas
- SQLAlchemy models
- Clear naming
- Separation of concerns
- Service layer
- Repository/data-access layer where useful

Avoid:

- Giant components
- Duplicate code
- Hardcoded course data in React
- Hardcoded user progress
- Unnecessary dependencies
- Business logic inside UI components
- Business logic inside route handlers
- N+1 database queries

---

# 14. Development Process

Implement the project incrementally.

Follow:

docs/11-development-roadmap.md

After each major phase:

1. Run frontend
2. Run backend
3. Run tests
4. Fix errors
5. Verify functionality
6. Update TASKS.md
7. Stop before starting the next major phase

Do not implement the entire application in one uncontrolled change.

---

# 15. Architectural Changes

Before making a major architectural change:

1. Explain the change
2. Explain why it is necessary
3. Identify affected files
4. Update documentation
5. Then implement it

Major changes include:

- Database schema changes
- API contract changes
- Authentication architecture
- State management architecture
- Deployment architecture

---

# 16. Primary Objectives

Priority order:

1. Correct database design
2. Functional backend
3. Correct lesson logic
4. Persistent user progress
5. Learning path UI
6. Lesson player
7. Gamification
8. Profile and statistics
9. Animations and polish
10. Testing
11. Deployment readiness

The application must work correctly before visual polish is prioritized.