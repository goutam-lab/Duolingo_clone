10 - Seed Data
1. Purpose

The seed system creates a complete demo environment.

The project should be usable immediately after running the seed command.

Example:

bash
python seed.py

or the project's equivalent command.

2. Seed Requirements

The seed script must create:

Users
Course
Units
Skills
Lessons
Exercises
Achievements
User stats

The seed operation must be repeatable.

Running it multiple times must not create duplicate records.

3. Default User

Create:

username:

text
learner

email:

text
learner@example.com

avatar_key:

text
default

Initial stats:

text
XP = 0
Current streak = 0
Longest streak = 0
Hearts = 5
Maximum hearts = 5
Gems = 100
Daily goal = 20 XP
Daily goal progress = 0
4. Demo Users

Create several demo users for leaderboard testing.

Example:

Alex
Sam
Jordan
Taylor
Casey

Each should have different XP values.

5. Course

Create:

text
English for Hindi Speakers

Course code:

text
en-hi

Source language:

text
Hindi

Target language:

text
English
6. Units

Create at least:

text
Unit 1 - Basics

Unit 2 - Everyday Words

Unit 3 - Simple Sentences

Unit 4 - Daily Conversation
7. Skills

Example skills:

text
Greetings

Introductions

Family

Food

Numbers

Time

Daily Routine

Common Verbs

Questions

Travel
8. Lessons

Each skill should contain approximately:

text
3-5 lessons

Each lesson should contain approximately:

text
6-10 exercises
9. Exercise Distribution

Every exercise type must be represented:

text
multiple_choice

translate

word_bank

match_pairs

fill_blank

type_answer
10. Multiple Choice Example

Prompt:

text
How do you say "Namaste" in English?

Question data:

json
{
  "options": [
    "Hello",
    "Goodbye",
    "Thank you",
    "Sorry"
  ]
}

Answer data:

json
{
  "correct_option": "Hello"
}
11. Translation Example

Prompt:

text
Translate "Good morning" into Hindi.

Question data:

json
{
  "source_text": "Good morning"
}

Answer data:

json
{
  "accepted_answers": [
    "सुप्रभात",
    "शुभ प्रभात"
  ]
}
12. Word Bank Example

Question data:

json
{
  "words": [
    "I",
    "am",
    "learning",
    "English"
  ]
}

Answer data:

json
{
  "correct_order": [
    "I",
    "am",
    "learning",
    "English"
  ]
}
13. Match Pairs Example

Question data:

json
{
  "left": [
    "Hello",
    "Water",
    "Food"
  ],
  "right": [
    "Namaste",
    "Paani",
    "Khana"
  ]
}

Answer data:

json
{
  "pairs": [
    ["Hello", "Namaste"],
    ["Water", "Paani"],
    ["Food", "Khana"]
  ]
}

The authoritative mapping must not be exposed by the normal lesson API.

14. Fill Blank Example

Prompt:

text
I ___ a student.

Question data:

json
{
  "prefix": "I ",
  "suffix": " a student."
}

Answer data:

json
{
  "accepted_answers": [
    "am"
  ]
}
15. Type Answer Example

Prompt:

text
What is the English word for "Paani"?

Question data:

json
{
  "prompt": "What is the English word for Paani?"
}

Answer data:

json
{
  "accepted_answers": [
    "water"
  ]
}
16. Achievements

Seed:

text
FIRST_LESSON

100_XP

THREE_DAY_STREAK

FIVE_LESSONS

FIRST_SKILL_COMPLETED

Each achievement should have:

Code
Title
Description
Icon key
Requirement data
17. Seed Data Rules

Seed data must be:

Deterministic
Repeatable
Realistic
Complete

Do not create random content every time the seed script runs.

18. Stable Ordering

Use:

text
order_index

for:

Units
Skills
Lessons
Exercises

Ordering must be deterministic.

19. No Frontend Seed Data

Do not hardcode lessons or exercises inside React.

Course content must come from the database.

Frontend:

text
API
↓
React
20. Seed Verification

After seeding, verify:

Course exists.
Units exist.
Skills exist.
Lessons exist.
All exercise types exist.
Default user exists.
Demo users exist.
Achievements exist.
User stats exist.