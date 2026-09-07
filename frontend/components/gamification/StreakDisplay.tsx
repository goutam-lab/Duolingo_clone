"use client";

import React from "react";
import { Flame } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  const hasStreak = streak > 0;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-sm tracking-wide transition-colors ${
        hasStreak
          ? "text-[#ff9600] hover:bg-[#ff9600]/10"
          : "text-slate-400 hover:bg-slate-800"
      }`}
      title={`${streak} Day Streak`}
      role="status"
      aria-label={`${streak} day streak`}
    >
      <Flame
        className={`w-5 h-5 transition-transform ${
          hasStreak ? "fill-[#ff9600] animate-pulse" : "text-slate-500"
        }`}
      />
      <span>{streak}</span>
    </div>
  );
};
