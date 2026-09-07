"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CoursePathResponse, UserMeResponse } from "@/types/api";
import { apiClient } from "@/lib/api/client";
import { AppShell } from "@/components/layout/AppShell";
import { LearningPath } from "@/components/learning-path/LearningPath";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function HomePage() {
  const router = useRouter();
  const [coursePath, setCoursePath] = useState<CoursePathResponse | null>(null);
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let userData: UserMeResponse;
      try {
        userData = await apiClient.getCurrentUser();
      } catch (authErr: unknown) {
        const err = authErr as { status?: number; message?: string };
        if (
          err?.status === 401 ||
          err?.message?.toLowerCase().includes("authentication") ||
          err?.message?.toLowerCase().includes("log in")
        ) {
          router.push("/login");
          return;
        }
        throw authErr;
      }

      if (userData.onboarding_completed === false) {
        router.push("/onboarding");
        return;
      }

      setUser(userData);

      const activeCourseId = userData.selected_course_id || 1;
      const pathData = await apiClient.getCoursePath(activeCourseId);
      setCoursePath(pathData);
    } catch (err) {
      console.error("Failed to load learning path:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the backend server. Please verify the API is running."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleHeartsRefilled = (newHearts: number) => {
    if (user) {
      setUser({ ...user, hearts: newHearts });
    }
  };

  return (
    <AppShell
      user={user}
      onHeartsRefilled={handleHeartsRefilled}
      courseTitle={coursePath?.course.title}
    >
      {isLoading && <LoadingState />}

      {!isLoading && error && <ErrorState message={error} onRetry={loadData} />}

      {!isLoading &&
        !error &&
        coursePath &&
        (!coursePath.units || coursePath.units.length === 0) && <EmptyState />}

      {!isLoading &&
        !error &&
        coursePath &&
        coursePath.units &&
        coursePath.units.length > 0 && <LearningPath coursePath={coursePath} />}
    </AppShell>
  );
}
