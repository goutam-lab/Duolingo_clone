"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  Zap,
  Gift,
  Award,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse, UserProfileResponse } from "@/types/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { ErrorState } from "@/components/ui/ErrorState";

export default function QuestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
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
      const profileData = await apiClient.getMyProfile();
      setProfile(profileData);
    } catch (err) {
      console.error("Failed to load quests:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the quests server."
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

  const dailyGoalXp = user?.daily_goal_xp ?? 20;
  const dailyGoalProgress = user?.daily_goal_progress ?? 0;
  const isGoalCompleted = dailyGoalProgress >= dailyGoalXp;
  const dailyGoalPct = Math.min(
    100,
    Math.round((dailyGoalProgress / dailyGoalXp) * 100)
  );

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-row justify-center pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 max-w-2xl min-h-screen flex flex-col border-r border-[#2b3d48]/40">
        <TopNav user={user} onHeartsRefilled={handleHeartsRefilled} />

        <div className="flex-1 w-full p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="w-full h-32 rounded-3xl bg-[#1a2c35]" />
              <div className="w-full h-24 rounded-2xl bg-[#1a2c35]" />
              <div className="w-full h-24 rounded-2xl bg-[#1a2c35]" />
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={loadData} />
          ) : (
            <>
              {/* Header Banner */}
              <section
                aria-label="Daily Quests Header"
                className="p-6 rounded-3xl bg-linear-to-br from-[#1a2c35] to-[#1e3436] border-2 border-[#58cc02]/30 shadow-lg flex items-center gap-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#58cc02]/20 border-2 border-[#58cc02] flex items-center justify-center text-[#58cc02] shrink-0">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Daily Quests</h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Complete daily goals and milestone achievements to earn XP and gems!
                  </p>
                </div>
              </section>

              {/* Active Daily Goal Quest */}
              <section aria-label="Daily XP Quest" className="space-y-3">
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 px-1">
                  Today's Quest
                </h2>

                <div className="p-5 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ffc800]/15 flex items-center justify-center text-[#ffc800]">
                        <Zap className="w-6 h-6 fill-[#ffc800]" />
                      </div>
                      <div>
                        <div className="font-black text-white text-sm sm:text-base">
                          Earn {dailyGoalXp} XP Today
                        </div>
                        <div className="text-xs text-slate-400">
                          Complete lessons to reach your daily target.
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                        isGoalCompleted
                          ? "bg-[#58cc02]/20 border-[#58cc02] text-[#58cc02]"
                          : "bg-[#243946] border-[#374c5a] text-slate-500"
                      }`}
                    >
                      <Gift className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Progress</span>
                      <span className={isGoalCompleted ? "text-[#58cc02]" : "text-white"}>
                        {dailyGoalProgress} / {dailyGoalXp} XP
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-[#131f24] rounded-full overflow-hidden border border-[#37464f]">
                      <div
                        className={`h-full rounded-full ${
                          isGoalCompleted ? "bg-[#58cc02]" : "bg-[#ffc800]"
                        }`}
                        style={{
                          width: `${dailyGoalPct}%`,
                          transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      />
                    </div>
                  </div>

                  {isGoalCompleted && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#58cc02] pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed! Great job sticking to your goal today!</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Milestone Achievements */}
              <section aria-label="Milestone Badges" className="space-y-3 pt-2">
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 px-1">
                  Achievement Badges
                </h2>

                <div className="space-y-3">
                  {profile?.achievements.map((ach) => (
                    <div
                      key={ach.code}
                      className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${
                        ach.is_unlocked
                          ? "bg-[#1a2c35] border-[#58cc02]/40"
                          : "bg-[#162227] border-[#2b3d48] opacity-75"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                          ach.is_unlocked
                            ? "bg-[#ffc800]/20 border-[#ffc800] text-[#ffc800]"
                            : "bg-[#243843] border-[#374c5a] text-slate-500"
                        }`}
                      >
                        {ach.is_unlocked ? (
                          <Award className="w-6 h-6 stroke-[2.2]" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm text-white flex items-center gap-1.5">
                          <span>{ach.title}</span>
                          {ach.is_unlocked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#58cc02]" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {ach.description}
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 ${
                          ach.is_unlocked
                            ? "text-[#58cc02] bg-[#58cc02]/15"
                            : "text-slate-500 bg-slate-800"
                        }`}
                      >
                        {ach.is_unlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <RightSidebar user={user} onHeartsRefilled={handleHeartsRefilled} />
    </div>
  );
}
