import {
  CoursePathResponse,
  UserMeResponse,
  HeartRefillResponse,
  CourseSummary,
  AuthResponse,
  UserPublic,
  UserSignupRequest,
  UserLoginRequest,
  OnboardingRequest,
  LessonDetailResponse,
  LessonAttemptStartResponse,
  ExerciseAnswerRequest,
  ExerciseAnswerResponse,
  LessonCompleteResponse,
  LeaderboardResponse,
  UserProfileResponse,
  AchievementPublic,
  UserAchievementPublic,
} from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("access_token");
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // Transmit HttpOnly access_token cookie
        cache: "no-store", // Ensure fresh real-time data for game state
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error?.message || errorData.detail || errorData.message || errorMessage;
        } catch {
          // If response body is not JSON
        }
        const error = new Error(errorMessage) as Error & { status?: number };
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected network error occurred.");
    }
  }

  /**
   * Register a new user account.
   */
  async signup(payload: UserSignupRequest): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  /**
   * Authenticate with username or email and password.
   */
  async login(payload: UserLoginRequest): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  /**
   * Terminate active session and clear token.
   */
  async logout(): Promise<void> {
    try {
      await this.request<{ message: string }>("/auth/logout", {
        method: "POST",
      });
    } finally {
      this.setToken(null);
    }
  }

  /**
   * Get authenticated user profile and onboarding status.
   */
  async getAuthMe(): Promise<UserPublic> {
    return this.request<UserPublic>("/auth/me");
  }

  /**
   * Complete user onboarding with course, daily goal, and experience level.
   */
  async completeOnboarding(payload: OnboardingRequest): Promise<UserPublic> {
    return this.request<UserPublic>("/auth/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * List all available courses.
   */
  async getCourses(): Promise<CourseSummary[]> {
    return this.request<CourseSummary[]>("/courses");
  }

  /**
   * Fetch complete course learning path with units, skills, and user progress.
   */
  async getCoursePath(courseId: number = 1): Promise<CoursePathResponse> {
    return this.request<CoursePathResponse>(`/courses/${courseId}/path`);
  }

  /**
   * Fetch current authenticated user profile and game stats.
   */
  async getCurrentUser(): Promise<UserMeResponse> {
    return this.request<UserMeResponse>("/me");
  }

  /**
   * Refill user hearts to maximum.
   */
  async refillHearts(): Promise<HeartRefillResponse> {
    return this.request<HeartRefillResponse>("/me/refill-hearts", {
      method: "POST",
    });
  }

  /**
   * Fetch lesson metadata and safe exercises (without authoritative answers).
   */
  async getLesson(lessonId: number): Promise<LessonDetailResponse> {
    return this.request<LessonDetailResponse>(`/lessons/${lessonId}`);
  }

  /**
   * Start a new authoritative lesson attempt.
   */
  async startLessonAttempt(lessonId: number): Promise<LessonAttemptStartResponse> {
    return this.request<LessonAttemptStartResponse>(`/lessons/${lessonId}/attempts`, {
      method: "POST",
    });
  }

  /**
   * Submit an exercise answer for server validation.
   */
  async submitExerciseAnswer(
    lessonId: number,
    attemptId: number,
    payload: ExerciseAnswerRequest
  ): Promise<ExerciseAnswerResponse> {
    return this.request<ExerciseAnswerResponse>(
      `/lessons/${lessonId}/attempts/${attemptId}/answers`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  }

  /**
   * Finalize a completed lesson attempt.
   */
  async completeLesson(
    lessonId: number,
    attemptId: number
  ): Promise<LessonCompleteResponse> {
    return this.request<LessonCompleteResponse>(
      `/lessons/${lessonId}/attempts/${attemptId}/complete`,
      {
        method: "POST",
      }
    );
  }

  /**
   * Fetch XP rankings for leaderboard.
   */
  async getLeaderboard(limit: number = 100): Promise<LeaderboardResponse> {
    return this.request<LeaderboardResponse>(`/leaderboard?limit=${limit}`);
  }

  /**
   * Fetch authenticated user's profile and stats.
   */
  async getMyProfile(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/profile/me");
  }

  /**
   * Fetch public profile and stats for a specific user.
   */
  async getUserProfile(userId: number): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>(`/profile/${userId}`);
  }

  /**
   * Fetch all achievement definitions in catalog.
   */
  async getAchievements(): Promise<AchievementPublic[]> {
    return this.request<AchievementPublic[]>("/achievements");
  }

  /**
   * Fetch achievements unlocked by the current authenticated user.
   */
  async getUserAchievements(): Promise<UserAchievementPublic[]> {
    return this.request<UserAchievementPublic[]>("/me/achievements");
  }
}

export const apiClient = new ApiClient();

