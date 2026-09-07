02 - Features
1. Feature Priorities
P0 - Critical

These features are mandatory:

Database
Seed data
Learning path
Units
Skills
Lessons
Exercises
Multiple choice
Translation
Word bank
Match pairs
Fill blank
Type answer
Answer validation
Immediate feedback
Hearts
XP
Streak
Daily goal
Skill progress
Lesson progress
Lesson completion
Persistence
P1 - High
Profile
Statistics
Leaderboard
Achievements
Friends
Responsive UI
Animations
Loading states
Error states
P2 - Medium
Heart regeneration
Gems
Additional statistics
More advanced animations
P3 - Optional
Audio
Dark mode
Timed lessons
Legendary mode
Advanced achievement system
2. Learning Features
Learning Path

The user can:

View course
View units
View skills
View progress
View locked skills
View available skills
View completed skills
Start lessons
Units

A course contains multiple units.

Each unit has:

Title
Description
Order
Skills
Skills

Each skill has:

Title
Description
Icon
Order
Lessons
Progress

Skill states:

Locked
Available
In progress
Completed
Lessons

Each skill contains multiple lessons.

Each lesson has:

Title
Order
XP reward
Exercises
3. Exercise Features
Multiple Choice

Display several options.

The user selects one answer.

The backend validates the selected answer.

Translation

Display a source sentence.

The user enters or constructs the translation.

The backend validates the answer.

Word Bank

Display a set of words.

The user constructs the sentence using the words.

The backend validates the final order.

Match Pairs

Display two groups of items.

The user matches corresponding items.

The backend validates the mapping.

Fill Blank

Display a sentence containing a blank.

The user provides the missing word.

The backend validates the answer.

Type Answer

Display a question.

The user types the answer.

The backend validates the answer.

4. Gamification

The application must support:

XP
Hearts
Streak
Daily goal
Gems
Skill progress
Crown level
Achievements
Leaderboard
5. XP

XP is awarded after successful lesson completion.

The server calculates XP.

The frontend displays XP.

6. Hearts

Default:

5 hearts.

Wrong answer:

-1 heart.

Correct answer:

No heart deduction.

7. Streak

The streak is based on active calendar days.

The backend manages streak calculations.

8. Daily Goal

Default:

20 XP per day.

The user should see progress toward the daily goal.

9. Achievements

Initial achievements:

First Lesson
100 XP
Three Day Streak
Five Lessons
First Skill Completed

Achievements must be unlocked only once.

10. Leaderboard

Rank users by total XP.

The leaderboard should show the current user's position.

Seed multiple users for demonstration.

11. Profile

Profile should show:

Avatar
Username
XP
Streak
Longest streak
Completed lessons
Completed skills
Achievements
Statistics
12. Persistence

User progress must survive:

Browser refresh
Navigation
Closing and reopening the application
13. UI Features

Use:

Animations
Progress rings
Toasts
Modals
Feedback bars
Loading states
Skeletons
Error states
Responsive layouts
14. Feature Priority

Build in this order:

Database
Seed data
Backend
Lesson logic
Progress logic
Learning path
Lesson player
Gamification
Profile
Leaderboard
Achievements
Polish
Testing
Deployment