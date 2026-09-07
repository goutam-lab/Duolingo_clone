"use client";

import React from "react";
import { X, Heart } from "lucide-react";

interface LessonHeaderProps {
  currentExerciseIndex: number;
  totalExercises: number;
  hearts: number;
  onQuitClick: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentExerciseIndex,
  totalExercises,
  hearts,
  onQuitClick,
}) => {
  const progressPercentage =
    totalExercises > 0
      ? Math.min(100, Math.round((currentExerciseIndex / totalExercises) * 100))
      : 0;

  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4 select-none">
      {/* Exit Button */}
      <button
        type="button"
        onClick={onQuitClick}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        aria-label="Quit lesson"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Progress Bar */}
      <div className="flex-1 bg-[#2b3d48] h-4 rounded-full overflow-hidden p-0.5 relative shadow-inner">
        <div
          className="bg-[#58cc02] h-full rounded-full transition-all duration-300 ease-out relative"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Subtle shine highlight inside progress bar */}
          <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Hearts Counter */}
      <div
        className={`flex items-center gap-1.5 font-black text-sm px-3 py-1.5 rounded-full border transition-all ${
          hearts > 1
            ? "border-[#ff4b4b]/30 bg-[#ff4b4b]/10 text-[#ff4b4b]"
            : "border-[#ff4b4b] bg-[#ff4b4b]/20 text-[#ff4b4b] animate-pulse"
        }`}
        aria-label={`${hearts} hearts remaining`}
      >
        <Heart className="w-5 h-5 fill-current" />
        <span>{hearts}</span>
      </div>
    </header>
  );
};
