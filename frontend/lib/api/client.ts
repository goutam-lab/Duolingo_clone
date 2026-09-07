import { CoursePathResponse, UserMeResponse, HeartRefillResponse } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
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
        throw new Error(errorMessage);
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
}

export const apiClient = new ApiClient();
