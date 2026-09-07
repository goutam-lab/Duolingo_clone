"use client";

import React from "react";
import Link from "next/link";
import { Zap, Gift, CheckCircle2 } from "lucide-react";

interface DailyGoalCardProps {
  progress: number;
  goal: number;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({ progress, goal }) => {
  const percentage = Math.min(100, goal > 0 ? Math.round((progress / goal) * 100) : 0);
  const isCompleted = progress >= goal;

  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
        isCompleted
          ? "border-[#58cc02]/60 bg-linear-to-br from-[#1a2c35] to-[#172d2b] shadow-md shadow-[#58cc02]/10"
          : "border-[#2b3d48] bg-[#1a2c35]"
      } text-white`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">
          Daily Quests
        </h3>
        <Link
          href="/quests"
          className="text-xs font-bold text-[#1cb0f6] uppercase tracking-wide hover:underline cursor-pointer"
        >
          View All
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

        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-200">
              {isCompleted ? "Goal Completed!" : `Earn ${goal} XP`}
            </span>
            <span className={isCompleted ? "text-[#58cc02] font-black" : "text-slate-400"}>
              {progress} / {goal}
            </span>
          </div>

          <div
            className="w-full h-3.5 bg-[#243946] rounded-full overflow-hidden p-0.5 relative"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={goal}
            aria-label={`Daily goal: ${progress} of ${goal} XP earned`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? "bg-[#58cc02] shadow-sm shadow-[#58cc02]/50" : "bg-[#ffc800]"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${
            isCompleted
              ? "bg-[#58cc02]/20 border-[#58cc02] text-[#58cc02] animate-bounce"
              : "bg-[#243946] border-[#374c5a] text-slate-500"
          }`}
          title={isCompleted ? "Quest Complete! Reward unlocked!" : "Reward locked"}
        >
          <Gift className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
