"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Gift, Zap } from "lucide-react";

interface DailyGoalCardProps {
  progress: number;
  goal: number;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({
  progress,
  goal,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const safeGoal = goal > 0 ? goal : 20;
  const safeProgress = Number.isFinite(progress) ? progress : 0;
  const percentage = Math.min(100, Math.round((safeProgress / safeGoal) * 100));
  const isCompleted = safeProgress >= safeGoal;

  return (
    <div
      className={`p-3.5 rounded-2xl border-2 ${
        isCompleted
          ? "border-[#58cc02]/55 bg-[#1a2c35]"
          : "border-[#37464f] bg-[#1a2c35]"
      } text-white`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#afafaf]">
          Daily Quests
        </h3>
        <Link
          href="/quests"
          className="text-xs font-bold text-[#1cb0f6] uppercase tracking-wide hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isCompleted
              ? "bg-[#58cc02]/20 text-[#58cc02]"
              : "bg-[#ffc800]/15 text-[#ffc800]"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <Zap className="w-6 h-6 fill-[#ffc800] text-[#ffc800]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5 gap-2">
            <span className="text-slate-200 truncate">
              {isCompleted ? "Goal completed" : `Earn ${safeGoal} XP`}
            </span>
            <span className={isCompleted ? "text-[#58cc02]" : "text-[#afafaf]"}>
              {safeProgress} / {safeGoal}
            </span>
          </div>

          <div
            className="w-full h-3.5 bg-[#243946] rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={safeProgress}
            aria-valuemin={0}
            aria-valuemax={safeGoal}
            aria-label={`Daily goal: ${safeProgress} of ${safeGoal} XP earned`}
          >
            <motion.div
              className={`h-full rounded-full ${
                isCompleted ? "bg-[#58cc02]" : "bg-[#ffc800]"
              }`}
              initial={false}
              animate={{ width: `${percentage}%` }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </div>
        </div>

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2 ${
            isCompleted
              ? "bg-[#58cc02]/20 border-[#58cc02] text-[#58cc02]"
              : "bg-[#243946] border-[#374c5a] text-slate-500"
          }`}
          title={isCompleted ? "Reward unlocked" : "Reward locked"}
        >
          <Gift className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
