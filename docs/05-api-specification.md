05 - API Specification
Base URL
text
/api/v1
1. Health
text
GET /health

Response:

json
{
  "status": "ok"
}
2. Current User
text
GET /me

Returns consolidated current user state.

Response:

json
{
  "id": 1,
  "username": "learner",
  "avatar_key": "default",
  "stats": {
    "total_xp": 120,
    "current_streak": 4,
    "longest_streak": 7,
    "hearts": 4,
    "max_hearts": 5,
    "gems": 100,
    "daily_goal_xp": 20,
    "daily_goal_progress": 10
  }
}
3. Learning Path
text
GET /courses/{course_id}/path

Returns:

Course
Units
Skills
Lessons
Skill progress
Lesson progress
Unlock state

Example:

json
{
  "course": {
    "id": 1,
    "title": "English for Hindi Speakers"
  },
  "units": [
    {
      "id": 1,
      "title": "Basics",
      "order_index": 1,
      "skills": [
        {
          "id": 1,
          "title": "Greetings",
          "icon_key": "greetings",
          "node_type": "skill",
          "status": "available",
          "progress": {
            "lessons_completed": 2,
            "total_lessons": 4,
            "crown_level": 1
          },
          "lessons": [
            {
              "id": 1,
              "title": "Basic Greetings",
              "order_index": 1,
              "is_completed": true
            }
          ]
        }
      ]
    }
  ]
}

The frontend must be able to render the learning path from this response.

4. Lesson
text
GET /lessons/{lesson_id}

Returns:

Lesson metadata
Ordered exercises
Safe question data

Must NOT return:

Correct answer
Answer key
Authoritative scoring data

Example:

json
{
  "id": 1,
  "title": "Basic Greetings",
  "xp_reward": 10,
  "exercises": [
    {
      "id": 1,
      "type": "multiple_choice",
      "prompt": "How do you say hello?",
      "question_data": {
        "options": [
          "Hello",
          "Goodbye",
          "Thanks"
        ]
      },
      "order_index": 1
    }
  ]
}
5. Start Lesson Attempt
text
POST /lessons/{lesson_id}/attempts

Creates a lesson attempt.

Response:

json
{
  "attempt_id": 100,
  "lesson_id": 1,
  "started_at": "2026-09-07T20:00:00Z",
  "hearts_remaining": 5
}
6. Submit Answer
text
POST /lessons/{lesson_id}/attempts/{attempt_id}/answers

Request:

json
{
  "exercise_id": 1,
  "answer": "Hello"
}

Correct response:

json
{
  "is_correct": true,
  "feedback": "Correct!",
  "hearts_remaining": 5,
  "exercise_completed": true
}

Incorrect response:

json
{
  "is_correct": false,
  "feedback": "Not quite.",
  "hearts_remaining": 4,
  "exercise_completed": true
}

The backend determines correctness.

7. Complete Lesson
text
POST /lessons/{lesson_id}/attempts/{attempt_id}/complete

The backend verifies:

Attempt exists
Attempt belongs to current user
Lesson exists
Required exercises are complete
Attempt is not already completed

Response:

json
{
  "completed": true,
  "xp_earned": 10,
  "total_xp": 130,
  "skill_progress": {
    "lessons_completed": 3,
    "total_lessons": 4,
    "crown_level": 1
  },
  "streak": {
    "current": 5,
    "longest": 7
  },
  "daily_goal": {
    "progress": 20,
    "goal": 20,
    "completed": true
  },
  "new_achievements": []
}
8. Profile
text
GET /profile/{user_id}

Returns:

User
Stats
Completed lessons
Completed skills
Achievements
Statistics
9. Leaderboard
text
GET /leaderboard

Optional:

text
?limit=100

Response:

json
{
  "entries": [
    {
      "rank": 1,
      "user_id": 4,
      "username": "Alex",
      "avatar_key": "avatar_1",
      "xp": 500
    }
  ]
}
10. Achievements
text
GET /achievements

Returns all achievement definitions.

text
GET /me/achievements

Returns achievements unlocked by the current user.

11. Error Response

Use a consistent structure:

json
{
  "error": {
    "code": "LESSON_LOCKED",
    "message": "This lesson is not currently available."
  }
}
12. HTTP Status Codes

Use:

200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
13. API Principles
Use /api/v1.
Validate request bodies.
Use Pydantic response schemas.
Keep routes thin.
Use service-layer business logic.
Do not expose correct answers.
Use transactions for state-changing operations.
Do not trust client-provided gamification values.