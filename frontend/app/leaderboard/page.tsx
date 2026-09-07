"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Medal,
  Shield,
  Zap,
  Sparkles,
  ArrowUp,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { apiClient } from "@/lib/api/client";
import { LeaderboardResponse, UserMeResponse } from "@/types/api";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState } from "@/components/ui/ErrorState";

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
    null
  );
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

      // 2. Fetch authoritative leaderboard rankings
      const data = await apiClient.getLeaderboard(50);
      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the leaderboard server."
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
    <AppShell user={user} onHeartsRefilled={handleHeartsRefilled}>
      <div className="w-full p-3 sm:p-4 space-y-4">
          {isLoading && <LeaderboardSkeleton />}

          {!isLoading && error && (
            <ErrorState message={error} onRetry={loadData} />
          )}

          {!isLoading && !error && leaderboard && (
            <>
              {leaderboard.unlock?.is_unlocked === false ? (
                <>
                  {/* Locked State Banner */}
                  <section
                    aria-label="Leaderboard Locked"
                    className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-[#1a2c35] via-[#1f3540] to-[#16252d] border-2 border-[#37464f] shadow-xl relative overflow-hidden flex flex-col items-center gap-5 text-center"
                  >
                    <div
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at top, rgba(255,200,0,0.12) 0%, transparent 60%)",
                      }}
                    />
                    <div className="relative shrink-0">
                      <svg width="82" height="92" viewBox="0 0 52 58" fill="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="lbg1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#cfe3ee"/>
                            <stop offset="100%" stopColor="#89a7ba"/>
                          </linearGradient>
                        </defs>
                        <path
                          d="M26 3 L 47 8 V 24 C 47 36 40 46 26 51 C 12 46 5 36 5 24 V 8 Z"
                          fill="url(#lbg1)"
                          stroke="#4e6d82"
                          strokeWidth="2.4"
                          strokeLinejoin="round"
                        />
                        <path d="M10 10 L 26 6.5 L 42 10 L 40 17 L 26 15 L 12 17 Z" fill="#ffffff" opacity="0.4"/>
                        <rect x="19" y="26" width="14" height="12" rx="2.4" fill="#2f4251" stroke="#1a2833" strokeWidth="1.6"/>
                        <path d="M 21.5 26 V 23 A 4.5 4.5 0 0 1 30.5 23 V 26" stroke="#2f4251" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
                        <circle cx="26" cy="31.2" r="1.8" fill="#c9d7e1"/>
                        <rect x="25.1" y="32.8" width="1.8" height="3" fill="#c9d7e1"/>
                      </svg>
                    </div>
                    <div className="relative space-y-2 max-w-md">
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Leaderboards are locked
                      </h1>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Complete your first lessons to unlock the leaderboard and
                        compete against other learners.
                      </p>
                      {leaderboard.unlock && (
                        <div className="mt-4 inline-flex flex-col items-center gap-2 w-full max-w-xs mx-auto">
                          <div className="text-[12.5px] font-bold text-slate-300">
                            {leaderboard.unlock.completed_lessons} of {leaderboard.unlock.required_lessons} lessons completed
                          </div>
                          <div className="w-full h-3 rounded-full bg-[#131f24] overflow-hidden border border-[#2b3d48]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#ffc800] via-[#ffd84d] to-[#ffe680] transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  100,
                                  leaderboard.unlock.required_lessons > 0
                                    ? (leaderboard.unlock.completed_lessons /
                                        leaderboard.unlock.required_lessons) *
                                      100
                                    : 0
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="text-[11.5px] font-bold text-[#afafaf] mt-0.5">
                            {Math.max(
                              0,
                              leaderboard.unlock.required_lessons -
                                leaderboard.unlock.completed_lessons
                            )}{" "}
                            more lesson
                            {leaderboard.unlock.required_lessons -
                              leaderboard.unlock.completed_lessons ===
                            1
                              ? ""
                              : "s"}{" "}
                            to unlock!
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              ) : (
                <>
                  {/* League Banner Header */}
                  <section
                    aria-label="League Banner"
                    className="p-6 rounded-3xl bg-linear-to-br from-[#1a2c35] via-[#1f3540] to-[#16252d] border-2 border-[#ffc800]/30 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-[#ffc800]/20 border-2 border-[#ffc800] flex items-center justify-center text-[#ffc800] shadow-lg shadow-[#ffc800]/20 shrink-0">
                      <Shield className="w-10 h-10 fill-[#ffc800]/30 text-[#ffc800]" />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#ffc800] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Weekly League
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Bronze League
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                        Top 10 learners advance to the Silver League at the end of
                        the week. Keep practicing to climb the ranks!
                      </p>
                    </div>
                  </section>

                  {/* Leaderboard Table */}
                  <section aria-label="Learner Rankings" className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      <span>Rank & Learner</span>
                      <span>Total XP</span>
                    </div>

                    {leaderboard.entries.length === 0 ? (
                      <div className="p-8 text-center bg-[#1a2c35] border-2 border-[#2b3d48] rounded-2xl text-slate-400">
                        <Trophy className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                        <p className="font-bold">No rankings available yet.</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Complete a lesson to be the first on the board!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {leaderboard.entries.map((entry) => {
                          const isCurrentUser = entry.user_id === user?.id;
                          const isTop3 = entry.rank <= 3;
                          const isPromotionZone =
                            entry.rank <= 10 && entry.rank > 3;

                          return (
                            <div
                              key={entry.user_id}
                              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${
                                isCurrentUser
                                  ? "bg-[#1cb0f6]/15 border-[#1cb0f6] shadow-md shadow-[#1cb0f6]/15 scale-[1.01]"
                                  : isTop3
                                  ? "bg-[#1a2c35] border-[#ffc800]/40"
                                  : "bg-[#162227] border-[#2b3d48]"
                              }`}
                            >
                              {/* Rank Badge & User Details */}
                              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                {/* Rank Badge */}
                                <div className="w-8 flex items-center justify-center font-black shrink-0">
                                  {entry.rank === 1 ? (
                                    <div className="w-8 h-8 rounded-full bg-[#ffc800] text-[#131f24] flex items-center justify-center shadow-md shadow-[#ffc800]/30">
                                      <Medal className="w-4 h-4" />
                                    </div>
                                  ) : entry.rank === 2 ? (
                                    <div className="w-8 h-8 rounded-full bg-slate-300 text-[#131f24] flex items-center justify-center shadow-md">
                                      <Medal className="w-4 h-4" />
                                    </div>
                                  ) : entry.rank === 3 ? (
                                    <div className="w-8 h-8 rounded-full bg-[#cd7f32] text-white flex items-center justify-center shadow-md">
                                      <Medal className="w-4 h-4" />
                                    </div>
                                  ) : (
                                    <span
                                      className={`text-sm ${
                                        isPromotionZone
                                          ? "text-[#58cc02] font-black"
                                          : "text-slate-400"
                                      }`}
                                    >
                                      {entry.rank}
                                    </span>
                                  )}
                                </div>

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-[#243946] border border-[#374c5a] flex items-center justify-center text-sm font-black text-white shrink-0 uppercase select-none">
                                  {entry.username.slice(0, 2)}
                                </div>

                                {/* Username & Badges */}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-black text-sm sm:text-base truncate ${
                                        isCurrentUser
                                          ? "text-[#1cb0f6]"
                                          : "text-white"
                                      }`}
                                    >
                                      {entry.username}
                                    </span>
                                    {isCurrentUser && (
                                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#1cb0f6] text-white px-2 py-0.5 rounded-full shrink-0">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  {isPromotionZone && (
                                    <div className="text-[10px] font-bold text-[#58cc02] flex items-center gap-0.5">
                                      <ArrowUp className="w-3 h-3" />
                                      <span>Promotion Zone</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* XP Score */}
                              <div className="flex items-center gap-1.5 shrink-0 pl-2">
                                <Zap className="w-4 h-4 fill-[#ffc800] text-[#ffc800]" />
                                <span className="font-black text-sm sm:text-base text-white">
                                  <AnimatedNumber value={entry.total_xp ?? entry.xp ?? 0} /> XP
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </>
              )}
            </>
          )}
        </div>
    </AppShell>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true">
      {/* Banner Skeleton */}
      <div className="p-6 rounded-3xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center gap-5">
        <div className="w-20 h-20 rounded-3xl bg-slate-700/60 shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="w-40 h-6 rounded-md bg-slate-700/80" />
          <div className="w-64 h-4 rounded-md bg-slate-700/50" />
        </div>
      </div>

      {/* Table Rows Skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="p-4 h-16 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700/60" />
              <div className="w-32 h-4 rounded-md bg-slate-700/80" />
            </div>
            <div className="w-16 h-4 rounded-md bg-slate-700/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
