"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Zap,
  Trophy,
  BookOpen,
  Crown,
  Calendar,
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse, UserProfileResponse } from "@/types/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { ErrorState } from "@/components/ui/ErrorState";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticated user verification
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

      setUser(userData);

      // 2. Fetch authenticated user's profile details
      const profileData = await apiClient.getMyProfile();
      setProfile(profileData);
    } catch (err) {
      console.error("Failed to load profile:", err);
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

  const unlockedCount =
    profile?.achievements.filter((a) => a.is_unlocked).length ?? 0;
  const totalAchievements = profile?.achievements.length ?? 5;

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Recently";
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-row justify-center pb-20 md:pb-0">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 max-w-2xl min-h-screen flex flex-col border-r border-[#2b3d48]/40">
        <TopNav user={user} onHeartsRefilled={handleHeartsRefilled} />

        <div className="flex-1 w-full p-4 sm:p-6 space-y-6">
          {isLoading && <ProfileSkeleton />}

          {!isLoading && error && (
            <ErrorState message={error} onRetry={loadData} />
          )}

          {!isLoading && !error && profile && (
            <>
              {/* Profile Header Card */}
              <section
                aria-label="User Profile Header"
                className="p-6 rounded-3xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-lg relative overflow-hidden"
              >
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#58cc02] to-[#1cb0f6] p-1 shadow-md shadow-[#58cc02]/20 shrink-0">
                  <div className="w-full h-full rounded-full bg-[#131f24] flex items-center justify-center text-3xl font-black text-[#58cc02] uppercase select-none">
                    {profile.username.slice(0, 2)}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {profile.username}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#58cc02]/15 text-[#58cc02] border border-[#58cc02]/30 text-xs font-black uppercase tracking-wider self-center sm:self-auto">
                      <Sparkles className="w-3.5 h-3.5" />
                      Active Learner
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Member since {formatDate(profile.created_at)}</span>
                  </p>
                </div>
              </section>

              {/* Statistics Overview */}
              <section aria-label="Learning Statistics" className="space-y-3">
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 px-1">
                  Statistics
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Streak Card */}
                  <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ff9600]/15 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 fill-[#ff9600] text-[#ff9600]" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">
                        {profile.stats.current_streak}
                      </div>
                      <div className="text-[11px] font-extrabold uppercase text-slate-400">
                        Day Streak
                      </div>
                    </div>
                  </div>

                  {/* Total XP Card */}
                  <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ffc800]/15 flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 fill-[#ffc800] text-[#ffc800]" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">
                        {profile.stats.total_xp}
                      </div>
                      <div className="text-[11px] font-extrabold uppercase text-slate-400">
                        Total XP
                      </div>
                    </div>
                  </div>

                  {/* Current League Card */}
                  <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1cb0f6]/15 flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6 text-[#1cb0f6]" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">
                        Bronze
                      </div>
                      <div className="text-[11px] font-extrabold uppercase text-slate-400">
                        Current League
                      </div>
                    </div>
                  </div>

                  {/* Completed Lessons Card */}
                  <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#58cc02]/15 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-[#58cc02]" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">
                        {profile.stats.completed_lessons}
                      </div>
                      <div className="text-[11px] font-extrabold uppercase text-slate-400">
                        Lessons Done
                      </div>
                    </div>
                  </div>

                  {/* Skills Mastered Card */}
                  <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ce82ff]/15 flex items-center justify-center shrink-0">
                      <Crown className="w-6 h-6 text-[#ce82ff]" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">
                        {profile.stats.completed_skills}
                      </div>
                      <div className="text-[11px] font-extrabold uppercase text-slate-400">
                        Skills Crowned
                      </div>
                    </div>
                  </div>

                  {/* Longest Streak Card */}
                  <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ff4b4b]/15 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 text-[#ff4b4b]" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">
                        {profile.stats.longest_streak}
                      </div>
                      <div className="text-[11px] font-extrabold uppercase text-slate-400">
                        Best Streak
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Achievements Section */}
              <section aria-label="Achievements Catalog" className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">
                    Achievements
                  </h2>
                  <span className="text-xs font-black text-[#58cc02] bg-[#58cc02]/15 px-2.5 py-1 rounded-lg">
                    {unlockedCount} / {totalAchievements} Unlocked
                  </span>
                </div>

                <div className="space-y-3">
                  {profile.achievements.map((ach) => (
                    <div
                      key={ach.code}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                        ach.is_unlocked
                          ? "bg-[#1a2c35] border-[#58cc02]/40 shadow-sm"
                          : "bg-[#162227] border-[#2b3d48] opacity-75"
                      }`}
                    >
                      {/* Badge Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                          ach.is_unlocked
                            ? "bg-[#ffc800]/20 border-[#ffc800] text-[#ffc800] shadow-sm shadow-[#ffc800]/20"
                            : "bg-[#243843] border-[#374c5a] text-slate-500"
                        }`}
                      >
                        {ach.is_unlocked ? (
                          <Award className="w-8 h-8 stroke-[2.2]" />
                        ) : (
                          <Lock className="w-6 h-6" />
                        )}
                      </div>

                      {/* Achievement Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-black text-sm sm:text-base truncate ${
                              ach.is_unlocked ? "text-white" : "text-slate-300"
                            }`}
                          >
                            {ach.title}
                          </h3>
                          {ach.is_unlocked && (
                            <CheckCircle2 className="w-4 h-4 text-[#58cc02] shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                          {ach.description}
                        </p>
                        {ach.is_unlocked && ach.unlocked_at && (
                          <div className="text-[11px] font-bold text-[#58cc02] mt-1">
                            Unlocked {formatDate(ach.unlocked_at)}
                          </div>
                        )}
                      </div>

                      {/* Status Tag */}
                      <div className="hidden sm:block shrink-0">
                        {ach.is_unlocked ? (
                          <span className="text-[11px] font-black uppercase tracking-wider text-[#58cc02] bg-[#58cc02]/15 px-2.5 py-1 rounded-lg">
                            Completed
                          </span>
                        ) : (
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-800 px-2.5 py-1 rounded-lg">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Right Companion Panel */}
      <RightSidebar user={user} />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true">
      {/* Header Skeleton */}
      <div className="p-6 rounded-3xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center gap-5">
        <div className="w-24 h-24 rounded-full bg-slate-700/60 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="w-48 h-7 rounded-md bg-slate-700/80" />
          <div className="w-32 h-4 rounded-md bg-slate-700/50" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-4 h-20 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48]"
          />
        ))}
      </div>

      {/* Achievements Skeleton */}
      <div className="space-y-3 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 h-24 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48]"
          />
        ))}
      </div>
    </div>
  );
}
