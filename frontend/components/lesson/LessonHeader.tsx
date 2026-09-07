"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

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
  const shouldReduceMotion = useReducedMotion();
  const progressPercentage =
    totalExercises > 0
      ? Math.min(100, Math.round((currentExerciseIndex / totalExercises) * 100))
      : 0;

  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4 select-none">
      <button
        type="button"
        onClick={onQuitClick}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 min-w-11 min-h-11"
        aria-label="Quit lesson"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      <div className="flex-1 bg-[#2b3d48] h-4 rounded-full overflow-hidden p-0.5 relative">
        <motion.div
          className="bg-[#58cc02] h-full rounded-full relative"
          initial={false}
          animate={{ width: `${progressPercentage}%` }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/30 rounded-full" />
        </motion.div>
      </div>

      <motion.div
        key={hearts}
        initial={shouldReduceMotion ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        className={`flex items-center gap-1.5 font-black text-sm px-3 py-1.5 rounded-full border ${
          hearts > 1
            ? "border-[#ff4b4b]/30 bg-[#ff4b4b]/10 text-[#ff4b4b]"
            : "border-[#ff4b4b] bg-[#ff4b4b]/20 text-[#ff4b4b]"
        }`}
        aria-label={`${hearts} hearts remaining`}
      >
        <Heart className="w-5 h-5 fill-current" />
        <AnimatedNumber value={hearts} />
      </motion.div>
    </header>
  );
};
