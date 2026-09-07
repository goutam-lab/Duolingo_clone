# Duolingo Full-Stack Clone

A full-stack gamified language-learning application inspired by the core
learning experience of Duolingo.

The project demonstrates:

- Next.js
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- FastAPI
- Python
- SQLAlchemy
- SQLite
- REST APIs
- Relational database design
- Gamification
- Persistent user progress

---

# Features

## Learning

- Learning path
- Units
- Skills
- Lessons
- Multiple exercise types
- Immediate feedback
- Lesson completion
- Skill progression

## Gamification

- XP
- Hearts
- Streak
- Daily goal
- Gems
- Crowns/skill levels
- Achievements
- Leaderboard

## Profile

- User profile
- Avatar
- Statistics
- XP
- Streak
- Achievements
- Completed lessons
- Completed skills

---

# Exercise Types

The application supports:

- Multiple choice
- Translation
- Word bank
- Match pairs
- Fill in the blank
- Type answer

---

# Architecture

```text
Browser
   |
   v
Next.js
   |
   | REST API
   v
FastAPI
   |
   v
Service Layer
   |
   v
SQLAlchemy
   |
   v
SQLite