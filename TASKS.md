# Project Tasks

## Phase 1 - Project Setup

- [x] Initialize Git repository
- [x] Initialize Next.js frontend
- [x] Initialize TypeScript
- [x] Configure Tailwind CSS
- [x] Install Framer Motion
- [x] Install Lucide React
- [x] Initialize FastAPI backend
- [x] Configure SQLAlchemy
- [x] Configure SQLite
- [x] Configure environment variables
- [x] Create frontend/backend README instructions
- [x] Verify frontend starts
- [x] Verify backend starts

---

# Phase 2 - Database

- [x] Create users model
- [x] Create courses model
- [x] Create units model
- [x] Create skills model
- [x] Create lessons model
- [x] Create exercises model
- [x] Create user_stats model
- [x] Create skill_progress model
- [x] Create lesson_progress model
- [x] Create lesson_attempts model
- [x] Create exercise_attempts model
- [x] Create daily_activity model
- [x] Create achievements model
- [x] Create user_achievements model
- [x] Add foreign keys
- [x] Add unique constraints
- [x] Add indexes
- [x] Create database initialization
- [x] Verify schema

---

# Phase 3 - Seed Data

- [x] Create default user
- [x] Create default course
- [x] Create units
- [x] Create skills
- [x] Create lessons
- [x] Create exercises
- [x] Create achievements
- [x] Create initial user stats
- [x] Create initial skill progress
- [x] Create seed script
- [x] Verify seeded data

---

# Phase 4 - Backend API

- [x] Create API versioning
- [x] Create health endpoint
- [x] Create current-user endpoint
- [x] Create course/path endpoint
- [x] Create lesson endpoint
- [ ] Create lesson attempt endpoint (Interactive Session - Phase 6)
- [ ] Create answer submission endpoint (Interactive Session - Phase 6)
- [ ] Create lesson completion endpoint (Interactive Session - Phase 6)
- [x] Create profile endpoint
- [x] Create leaderboard endpoint
- [x] Create achievements endpoint
- [x] Add error handling
- [x] Add request validation
- [ ] Add transaction handling (Interactive Session - Phase 6)

---

# Phase 5 - Learning Path

- [x] Create learning path page
- [x] Create unit header
- [x] Create skill node
- [x] Create progress ring
- [x] Create locked node
- [x] Create available node
- [x] Create completed node
- [x] Create reward node
- [x] Create SVG curved path
- [x] Add mascot component
- [x] Connect path to backend
- [x] Implement skill unlock state
- [x] Add animations
- [x] Make responsive

---

# Phase 5.5 - Authentication & Onboarding

- [x] Install and configure bcrypt and pyjwt
- [x] Implement secure password hashing & constant-time verification
- [x] Implement dual-transport JWT (HttpOnly session cookie + Bearer token)
- [x] Update User model with password_hash, onboarding_completed, experience_level, selected_course_id
- [x] Execute database migration for new authentication and onboarding columns
- [x] Update database seed orchestrator with hashed passwords and course-first foreign key order
- [x] Create auth Pydantic schemas (UserSignupRequest, UserLoginRequest, OnboardingRequest, UserPublic, AuthResponse)
- [x] Implement AuthService with atomic transactional user creation & user_stats initialization
- [x] Implement authoritative get_current_user dependency, deprecating arbitrary unauthenticated X-User-Id spoofing
- [x] Implement endpoints: /auth/signup, /auth/login, /auth/logout, /auth/me, /auth/onboarding
- [x] Implement GET /courses endpoint for onboarding course selection
- [x] Implement frontend types, credentials: "include", and auth client methods
- [x] Implement Duolingo-styled /login page with demo credentials shortcut
- [x] Implement Duolingo-styled /signup page with input validation
- [x] Implement 3-step interactive /onboarding wizard (Course, Daily Goal, Experience Level)
- [x] Protect learning path (/) with redirects to /login and /onboarding
- [x] Add Logout functionality to Sidebar
- [x] Create comprehensive security test suite in backend/tests/test_auth.py (13 tests)
- [x] Verify complete test suite (66 tests passed) and frontend build (Turbopack 0 errors)

---

# Phase 6 - Lesson Player


- [ ] Create lesson route
- [ ] Create lesson header
- [ ] Create progress bar
- [ ] Create hearts display
- [ ] Create XP display
- [ ] Create exercise renderer
- [ ] Implement multiple choice
- [ ] Implement translation
- [ ] Implement word bank
- [ ] Implement match pairs
- [ ] Implement fill blank
- [ ] Implement type answer
- [ ] Implement answer submission
- [ ] Implement immediate feedback
- [ ] Implement correct answer state
- [ ] Implement incorrect answer state
- [ ] Implement next button
- [ ] Implement lesson completion
- [ ] Add completion modal
- [ ] Add XP reward animation

---

# Phase 7 - Gamification

- [ ] Implement XP
- [ ] Implement hearts
- [ ] Implement streak
- [ ] Implement daily goal
- [ ] Implement gems
- [ ] Implement skill progress
- [ ] Implement lesson completion
- [ ] Implement crown/level progression
- [ ] Implement heart regeneration/mock refill
- [ ] Implement achievement unlocking

---

# Phase 8 - Profile

- [ ] Create profile page
- [ ] Show username
- [ ] Show avatar
- [ ] Show total XP
- [ ] Show streak
- [ ] Show completed lessons
- [ ] Show completed skills
- [ ] Show achievements
- [ ] Show statistics

---

# Phase 9 - Leaderboard

- [ ] Create leaderboard page
- [ ] Query users by XP
- [ ] Add ranking
- [ ] Show current user
- [ ] Add mock weekly leaderboard state
- [ ] Make responsive

---

# Phase 10 - Polish

- [ ] Add transitions
- [ ] Add button animations
- [ ] Add node animations
- [ ] Add success animation
- [ ] Add failure animation
- [ ] Add toast messages
- [ ] Add loading states
- [ ] Add skeleton states
- [ ] Add empty states
- [ ] Add error states
- [ ] Improve mobile layout
- [ ] Improve accessibility

---

# Phase 11 - Testing

- [ ] Backend health test
- [ ] Database test
- [ ] Seed test
- [ ] Lesson retrieval test
- [ ] Correct answer test
- [ ] Incorrect answer test
- [ ] Heart deduction test
- [ ] XP test
- [ ] Streak test
- [ ] Skill progression test
- [ ] Lesson completion test
- [ ] Daily goal test
- [ ] Frontend rendering test
- [ ] End-to-end lesson test

---

# Phase 12 - Deployment

- [ ] Production environment variables
- [ ] Build frontend
- [ ] Build backend
- [ ] Configure SQLite persistent storage
- [ ] Configure CORS
- [ ] Configure API base URL
- [ ] Run production seed
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test production APIs
- [ ] Test production lesson flow
- [ ] Update README
- [ ] Add deployment instructions

---

# Current Phase
 
Phase 4 - Backend API
 
Phase 3 (Seed Data) completed and verified. Ready for Phase 4 implementation.