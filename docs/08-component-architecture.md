08 - Component Architecture
1. Frontend Structure

Recommended:

text
frontend/
├── app/
│   ├── page.tsx
│   ├── lesson/
│   ├── profile/
│   ├── friends/
│   ├── leaderboard/
│   └── settings/
│
├── components/
│   ├── layout/
│   ├── learning-path/
│   ├── lesson/
│   ├── gamification/
│   ├── profile/
│   └── ui/
│
├── hooks/
│
├── lib/
│   ├── api/
│   ├── constants/
│   └── utils/
│
├── types/
│
└── public/
2. Layout Components

Recommended:

AppShell
TopBar
PageContainer
Navigation
3. Gamification Components
XPDisplay
StreakDisplay
HeartsDisplay
GemsDisplay
DailyGoalProgress

These components display server-provided values.

4. Learning Path Components
LearningPath
UnitSection
UnitHeader
SkillNode
SkillProgressRing
RewardNode
PathConnector
Mascot
5. SkillNode

Conceptual props:

typescript
type SkillNodeProps = {
  skillId: number;
  title: string;
  iconKey: string;
  nodeType: string;
  progress: number;
  status:
    | "locked"
    | "available"
    | "in_progress"
    | "completed";
};

Do not mix visual type and progress state.

6. Lesson Components
LessonHeader
LessonProgress
ExerciseRenderer
ExerciseContainer
AnswerFeedback
ContinueButton
LessonCompleteModal
7. Exercise Components
MultipleChoiceExercise
TranslateExercise
WordBankExercise
MatchPairsExercise
FillBlankExercise
TypeAnswerExercise
8. ExerciseRenderer

The renderer chooses the appropriate component.

Conceptually:

typescript
switch (exercise.type) {
    case "multiple_choice":
        return <MultipleChoiceExercise />;

    case "translate":
        return <TranslateExercise />;

    case "word_bank":
        return <WordBankExercise />;

    case "match_pairs":
        return <MatchPairsExercise />;

    case "fill_blank":
        return <FillBlankExercise />;

    case "type_answer":
        return <TypeAnswerExercise />;
}

Keep the lesson flow outside individual exercise components.

9. API Layer

Recommended:

text
lib/api/

Functions:

getCurrentUser()
getLearningPath()
getLesson()
startLessonAttempt()
submitAnswer()
completeLesson()
getProfile()
getLeaderboard()
getAchievements()

Use TypeScript types.

10. Hooks

Use hooks for reusable frontend behavior.

Examples:

useCurrentUser
useLearningPath
useLesson
useLessonAttempt

Do not create hooks unnecessarily.

11. Backend Components

Recommended:

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
12. Separation of Concerns

Route:

HTTP

Service:

Business logic

Repository:

Database access

Model:

Database structure

Schema:

API validation and serialization
13. Component Rules

Components should be:

Reusable
Focused
Typed
Testable

Avoid:

Giant components
Duplicate UI
Business logic in UI
Hardcoded content
14. Component Size

If a component becomes very large and contains multiple independent responsibilities, split it.

Do not split components simply to create more files.

Split based on responsibility.