"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Languages, Shield, Sparkles, Trophy } from "lucide-react";
import { UserMeResponse } from "@/types/api";
import { DailyGoalCard } from "@/components/gamification/DailyGoalCard";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { GemsDisplay } from "@/components/gamification/GemsDisplay";
import { HeartsDisplay } from "@/components/gamification/HeartsDisplay";

interface RightSidebarProps {
  user: UserMeResponse | null;
  onHeartsRefilled?: (hearts: number) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  user,
  onHeartsRefilled,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const dailyGoalXp = user?.daily_goal_xp ?? 20;
  const dailyGoalProgress = user?.daily_goal_progress ?? 0;
  const streak = user?.current_streak ?? 0;
  const gems = user?.gems ?? 0;
  const hearts = user?.hearts ?? 0;
  const maxHearts = user?.max_hearts ?? 5;

  return (
    <aside
      className="hidden lg:flex flex-col gap-4 w-[320px] p-4 pt-5 select-none fixed right-0 top-0 h-dvh overflow-y-auto z-30 bg-[#131f24]"
      aria-label="Companion Sidebar"
    >
      <div className="flex items-center justify-end gap-1">
        <div
          className="w-8 h-8 rounded-lg bg-[#1cb0f6]/15 border border-[#1cb0f6]/40 flex items-center justify-center"
          title="Current course"
        >
          <Languages className="w-4 h-4 text-[#1cb0f6]" />
        </div>
        <StreakDisplay streak={streak} />
        <GemsDisplay gems={gems} />
        <HeartsDisplay
          hearts={hearts}
          maxHearts={maxHearts}
          onHeartsRefilled={onHeartsRefilled}
        />
      </div>

      <motion.div
        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
        className="p-5 rounded-2xl border-2 border-[#37464f] bg-[#1a2c35] relative overflow-hidden"
      >
        <div className="flex items-center gap-1.5 text-xs font-black text-[#ce82ff] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Super</span>
        </div>
        <h3 className="text-base font-black text-white leading-snug mb-1.5">
          Learn without limits
        </h3>
        <p className="text-xs text-[#afafaf] leading-relaxed mb-4">
          Unlimited hearts, extra practice, and a calmer lesson flow.
        </p>
        <Link
          href="/shop"
          className="block text-center w-full py-3 px-4 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] hover:brightness-105 active:translate-y-0.5 active:border-b-2 font-black text-xs uppercase tracking-wider text-white"
        >
          Try Super
        </Link>
      </motion.div>

      <Link
        href="/leaderboard"
        className="block p-4 rounded-2xl border-2 border-[#37464f] bg-[#1a2c35] hover:border-[#ffc800]/50 text-white group"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#afafaf] group-hover:text-white">
            Leaderboard
          </h3>
          <Trophy className="w-4 h-4 text-[#ffc800]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffc800]/15 border border-[#ffc800]/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#ffc800]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">Bronze League</div>
            <div className="text-[11px] text-[#afafaf]">
              Complete lessons to climb the ranks.
            </div>
          </div>
        </div>
      </Link>

      <DailyGoalCard progress={dailyGoalProgress} goal={dailyGoalXp} />

      <footer className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-[#6b7c86] uppercase tracking-wider">
        <span>About</span>
        <span>Blog</span>
        <span>Terms</span>
        <span>Privacy</span>
      </footer>
    </aside>
  );
};
