"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CoursePathResponse, UserMeResponse } from "@/types/api";
import { apiClient } from "@/lib/api/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { RightSidebar } from "@/components/layout/RightSidebar";
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
      // 1. Fetch current authenticated user first
      let userData: UserMeResponse;
      try {
        userData = await apiClient.getCurrentUser();
      } catch (authErr: any) {
        if (
          authErr?.status === 401 ||
          authErr?.message?.toLowerCase().includes("authentication") ||
          authErr?.message?.toLowerCase().includes("log in")
        ) {
          router.push("/login");
          return;
        }
        throw authErr;
      }

      // Check onboarding
      if (userData.onboarding_completed === false) {
        router.push("/onboarding");
        return;
      }

      setUser(userData);

      // 2. Fetch learning path for user's selected course
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
    <div className="min-h-screen bg-[#131f24] text-white flex flex-row justify-center pb-20 md:pb-0">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl min-h-screen flex flex-col border-r border-[#2b3d48]/40">
        {/* Top Gamification Bar */}
        <TopNav
          user={user}
          onHeartsRefilled={handleHeartsRefilled}
          courseTitle={coursePath?.course.title}
        />

        {/* Dynamic Learning Path Body */}
        <div className="flex-1 w-full">
          {isLoading && <LoadingState />}

          {!isLoading && error && (
            <ErrorState message={error} onRetry={loadData} />
          )}

          {!isLoading && !error && coursePath && (!coursePath.units || coursePath.units.length === 0) && (
            <EmptyState />
          )}

          {!isLoading && !error && coursePath && coursePath.units && coursePath.units.length > 0 && (
            <LearningPath coursePath={coursePath} />
          )}
        </div>
      </main>

      {/* Right Companion Panel (Desktop) */}
      <RightSidebar user={user} />
    </div>
  );
}
