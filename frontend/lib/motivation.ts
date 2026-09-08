/**
 * Duolingo-style motivational remarks and encouragement generator.
 */

const CORRECT_MESSAGES = [
  "Nice job! 🎉",
  "Great work!",
  "Brilliant!",
  "You're making great progress!",
  "Superb accuracy!",
  "Spot on!",
  "Awesome! Keep it up!",
  "Nailed it! 🚀",
  "Looking sharp!",
];

const STREAK_MESSAGES = [
  "5 in a row! You're on fire! 🔥",
  "Unstoppable momentum! ⚡",
  "Look at you go!",
  "Pure genius at work!",
  "You're in the zone!",
];

const COMPLETION_MESSAGES = [
  "Phenomenal effort today!",
  "You've crushed this lesson!",
  "Practice makes permanent. Great job!",
  "Knowledge gained! Keep advancing on your path!",
];

export function getMotivationalCorrectMessage(streakInLesson?: number): string {
  if (typeof window !== "undefined" && localStorage.getItem("pref_motivation") === "false") {
    return "Nice job!";
  }

  if (streakInLesson && streakInLesson >= 4) {
    const idx = Math.floor(Math.random() * STREAK_MESSAGES.length);
    return STREAK_MESSAGES[idx];
  }

  const idx = Math.floor(Math.random() * CORRECT_MESSAGES.length);
  return CORRECT_MESSAGES[idx];
}

export function getMotivationalCompletionMessage(): string {
  if (typeof window !== "undefined" && localStorage.getItem("pref_motivation") === "false") {
    return "Lesson complete!";
  }

  const idx = Math.floor(Math.random() * COMPLETION_MESSAGES.length);
  return COMPLETION_MESSAGES[idx];
}
