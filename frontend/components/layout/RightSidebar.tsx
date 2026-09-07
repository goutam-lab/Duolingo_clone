"use client";

import React from "react";
import { Sparkles, Shield, Trophy } from "lucide-react";
import { UserMeResponse } from "@/types/api";
import { DailyGoalCard } from "@/components/gamification/DailyGoalCard";

interface RightSidebarProps {
  user: UserMeResponse | null;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ user }) => {
  const dailyGoalXp = user?.daily_goal_xp ?? 20;
  const dailyGoalProgress = user?.daily_goal_progress ?? 0;

  return (
    <aside
      className="hidden lg:flex flex-col gap-5 w-80 p-4 shrink-0 select-none"
      aria-label="Companion Sidebar"
    >
      {/* Super Duolingo / Pro Teaser Card */}
      <div className="p-5 rounded-3xl border-2 border-[#2b3d48] bg-linear-to-br from-[#1a2c35] to-[#16252d] relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#1cb0f6] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Super Duolingo</span>
        </div>

        <h3 className="text-base font-black text-white leading-snug mb-1.5">
          Level up your learning
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Unlimited hearts, personalized practice, and zero interruptions!
        </p>

        <button
          type="button"
          className="w-full py-3 px-4 rounded-2xl bg-[#1cb0f6] border-b-[4px] border-[#1899d6] hover:bg-[#28b6fa] active:translate-y-0.5 active:border-b-[2px] font-black text-xs uppercase tracking-wider text-white shadow-md shadow-[#1cb0f6]/20 transition-all"
        >
          Try 1 Week Free
        </button>
      </div>

      {/* Unlock Leaderboards Widget */}
      <div className="p-4 rounded-2xl border-2 border-[#2b3d48] bg-[#1a2c35] text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">
            Leaderboard
          </h3>
          <Trophy className="w-4 h-4 text-[#ffc800]" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffc800]/15 border border-[#ffc800]/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#ffc800]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">
              Bronze League
            </div>
            <div className="text-[11px] text-slate-400">
              Complete lessons to rank against learners worldwide!
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quests / Goal Tracker */}
      <DailyGoalCard progress={dailyGoalProgress} goal={dailyGoalXp} />

      {/* Footer Info Links */}
      <footer className="pt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <span className="hover:underline cursor-pointer">About</span>
        <span className="hover:underline cursor-pointer">Blog</span>
        <span className="hover:underline cursor-pointer">Terms</span>
        <span className="hover:underline cursor-pointer">Privacy</span>
      </footer>
    </aside>
  );
};
