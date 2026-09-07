export type SkillStatus = "locked" | "available" | "in_progress" | "completed";
export type LessonStatus = "locked" | "available" | "completed";

export interface UserStatsPublic {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  hearts: number;
  max_hearts: number;
  gems: number;
  daily_goal_xp: number;
  daily_goal_progress: number;
  last_activity_date?: string | null;
}

export interface UserMeResponse {
  id: number;
  username: string;
  email: string;
  avatar_key?: string;
  onboarding_completed?: boolean;
  experience_level?: string | null;
  selected_course_id?: number | null;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  hearts: number;
  max_hearts: number;
  gems: number;
  daily_goal_xp: number;
  daily_goal_progress: number;
  stats?: UserStatsPublic;
}

export interface UserPublic {
  id: number;
  username: string;
  email: string;
  avatar_key?: string;
  onboarding_completed: boolean;
  experience_level?: string | null;
  selected_course_id?: number | null;
  is_active: boolean;
}

export interface AuthResponse {
  user: UserPublic;
  access_token: string;
  token_type: string;
  onboarding_completed: boolean;
  message: string;
}

export interface UserSignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  username_or_email: string;
  password: string;
}

export interface OnboardingRequest {
  course_id: number;
  daily_goal_xp: number;
  experience_level: "beginner" | "intermediate" | "advanced";
}


export interface LessonPathResponse {
  id: number;
  title: string;
  order_index: number;
  xp_reward: number;
  status: LessonStatus;
  is_completed: boolean;
  best_score: number;
  attempts_count: number;
}

export interface SkillProgressSummary {
  lessons_completed: number;
  total_lessons: number;
  progress_percentage: number;
  crown_level: number;
}

export interface SkillPathResponse {
  id: number;
  title: string;
  description?: string | null;
  icon_key: string;
  node_type: string;
  order_index: number;
  status: SkillStatus;
  progress: SkillProgressSummary;
  lessons: LessonPathResponse[];
}

export interface UnitPathResponse {
  id: number;
  title: string;
  description?: string | null;
  order_index: number;
  skills: SkillPathResponse[];
}

export interface CourseSummary {
  id: number;
  code: string;
  title: string;
  source_language: string;
  target_language: string;
}

export interface CoursePathResponse {
  course: CourseSummary;
  units: UnitPathResponse[];
}

export interface HeartRefillResponse {
  hearts: number;
  max_hearts: number;
  message: string;
}

export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "word_bank"
  | "match_pairs"
  | "fill_blank"
  | "type_answer";

export interface ExercisePublic {
  id: number;
  type: ExerciseType;
  prompt: string;
  question_data: any;
  order_index: number;
}

export interface LessonDetailResponse {
  id: number;
  title: string;
  order_index: number;
  xp_reward: number;
  estimated_seconds: number;
  skill_id: number;
  skill_title?: string | null;
  exercises: ExercisePublic[];
}

export interface LessonAttemptStartResponse {
  attempt_id: number;
  lesson_id: number;
  started_at: string;
  hearts_remaining: number;
}

export interface ExerciseAnswerRequest {
  exercise_id: number;
  answer: any;
}

export interface ExerciseAnswerResponse {
  is_correct: boolean;
  feedback: string;
  hearts_remaining: number;
  exercise_completed: boolean;
  correct_answer?: any;
}

export interface LessonCompleteSkillSummary {
  lessons_completed: number;
  total_lessons: number;
  crown_level: number;
}

export interface LessonCompleteStreakSummary {
  current: number;
  longest: number;
}

export interface LessonCompleteDailyGoalSummary {
  progress: number;
  goal: number;
  completed: boolean;
}

export interface LessonCompleteResponse {
  completed: boolean;
  xp_earned: number;
  total_xp: number;
  score: number;
  hearts_remaining: number;
  skill_progress: LessonCompleteSkillSummary;
  streak: LessonCompleteStreakSummary;
  daily_goal: LessonCompleteDailyGoalSummary;
  new_achievements: string[];
}

