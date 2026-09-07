01 - Requirements
1. Project Overview

Build a polished full-stack language-learning application inspired by the core learning experience of Duolingo.

The application must implement this complete learning loop:

Learning Path → Unit → Skill → Lesson → Exercise → Answer → Immediate Feedback → Lesson Completion → XP / Hearts / Streak / Daily Goal / Progress

The application must feel like a real gamified learning product, not a generic quiz application.

The project is a full-stack engineering assignment demonstrating:

Frontend development
Backend API development
Database design
Business logic
Gamification
State persistence
Responsive UI
Testing
Deployment readiness
2. Technology Requirements
Frontend
Next.js
React
TypeScript
Tailwind CSS
Framer Motion
Lucide React
Backend
Python
FastAPI
SQLAlchemy
Pydantic
Database
SQLite
SQLAlchemy ORM

The database URL must be configurable through environment variables.

The schema should remain compatible with future PostgreSQL migration.

3. Architecture Requirement

The frontend must never directly access the database.

Required architecture:

Browser → Next.js → REST API → FastAPI → Service Layer → Repository/Data Access → SQLAlchemy → SQLite

4. User Requirements

The user must be able to:

Open the learning path.
View course units.
View skills.
Identify locked and unlocked skills.
Open an available lesson.
Complete exercises.
Receive immediate feedback.
Lose hearts on incorrect answers.
Earn XP on lesson completion.
Maintain a learning streak.
Track daily goal progress.
View skill progress.
View lesson completion.
View profile statistics.
View achievements.
View leaderboard rankings.
5. Learning Path Requirements

The learning path must display:

Course
Units
Skills
Lessons
Locked skills
Available skills
In-progress skills
Completed skills
Progress rings
Reward nodes
Unit headers
Curved path connectors
Mascot-style elements

The learning path must be generated using React, CSS and SVG.

Do not implement the entire learning path as a static image.

6. Lesson Requirements

Each lesson must contain ordered exercises.

A lesson must have:

ID
Skill
Title
Order
XP reward
Exercises

Exercises must be displayed in deterministic order.

7. Exercise Requirements

The application must support:

Multiple choice
Translation
Word bank
Match pairs
Fill in the blank
Type answer

Every exercise must support:

Question
User interaction
Answer submission
Backend validation
Immediate feedback
Continue action
8. Hearts Requirements

Default:

Maximum hearts: 5
Starting hearts: 5

Incorrect answers reduce hearts by one.

Hearts cannot become negative.

The backend is authoritative for heart state.

9. XP Requirements

Each lesson has an XP reward.

XP must be calculated by the backend.

The frontend must never submit its own XP value and expect the backend to trust it.

Lesson completion updates:

User total XP
Daily XP
Daily goal progress
Skill progress
10. Streak Requirements

The application must maintain a consecutive-day streak.

Rules:

First activity starts streak at 1.
Same-day activity does not increase streak.
Next calendar day increases streak.
Missing a calendar day resets current streak to 1.
Longest streak is preserved.
11. Daily Goal Requirements

Default daily goal:

20 XP.

The application should show:

Example:

10 / 20 XP

After reaching the goal:

20 / 20 XP

Daily goal progress must persist.

12. Progress Requirements

The application must persist:

Lesson completion
Skill progress
XP
Hearts
Streak
Daily goal
Achievements

Refreshing the page must not reset these values.

13. Profile Requirements

The profile must display:

Avatar
Username
Total XP
Current streak
Longest streak
Completed lessons
Completed skills
Achievements
Useful statistics
14. Leaderboard Requirements

The leaderboard must show:

Rank
Avatar
Username
XP

The leaderboard should be database-backed.

A separate leaderboard table is not required.

Leaderboard data can be derived from users and user_stats.

15. Persistence Requirements

All important user state must be stored in the database.

Do not rely on:

React state
localStorage
hardcoded values

for authoritative user progress.

16. Security Requirements

The frontend must never receive authoritative correct answers before submission.

The client must not be trusted for:

XP
Hearts
Streak
Skill progress
Lesson completion
Skill unlocking
Achievements
Gems

The backend must validate these values.

17. Performance Requirements

Avoid unnecessary API requests.

Avoid N+1 database queries.

The learning path should be returned as a consolidated resource.

The lesson endpoint should return all required exercises.

The user endpoint should return consolidated user statistics.

Use appropriate indexes and aggregate tables.

18. Database Requirements

The database must contain:

users
courses
units
skills
lessons
exercises
user_stats
skill_progress
lesson_progress
lesson_attempts
exercise_attempts
daily_activity
achievements
user_achievements

The detailed schema is defined in:

docs/04-database-schema.md

19. UI Requirements

The UI must be:

Playful
Gamified
Responsive
Modern
Interactive
Visually polished

It should not look like a generic CRUD application.

20. Acceptance Criteria

The project is functionally complete when:

Application starts successfully.
Database initializes successfully.
Seed data works.
Learning path loads.
Skills show correct states.
Lessons open correctly.
All required exercise types work.
Answers are validated by backend.
Incorrect answers reduce hearts.
Lesson completion awards XP.
Skill progress updates.
Streak updates.
Daily goal updates.
Achievements work.
Profile works.
Leaderboard works.
Data persists after refresh.
Frontend is responsive.
Backend tests pass.
Production build succeeds.