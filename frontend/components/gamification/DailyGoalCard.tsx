"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";

interface DailyGoalCardProps {
  progress: number;
  goal: number;
}

const QuestChestReward = ({ unlocked = false }: { unlocked?: boolean }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    {/* Base body */}
    <rect x="5" y="20" width="34" height="18" rx="4" fill={unlocked ? "#ce82ff" : "#7a5230"} stroke={unlocked ? "#8e49c9" : "#4e3218"} strokeWidth="2"/>
    <rect x="5" y="20" width="34" height="6" rx="2.5" fill={unlocked ? "#e7b2ff" : "#9c6b3e"}/>
    {/* Lid band */}
    <rect x="3.5" y="17" width="37" height="5.5" rx="2.5" fill={unlocked ? "#c482ff" : "#5d3a1c"} stroke={unlocked ? "#8e49c9" : "#4e3218"} strokeWidth="2"/>
    {/* Side bands */}
    <rect x="11" y="20" width="2.6" height="18" fill={unlocked ? "#8e49c9" : "#4e3218"}/>
    <rect x="30.4" y="20" width="2.6" height="18" fill={unlocked ? "#8e49c9" : "#4e3218"}/>
    {/* Lock plate */}
    {!unlocked && (
      <>
        <rect x="17.5" y="24.5" width="9" height="7.5" rx="2" fill="#2b1d0f"/>
        {/* Keyhole gold */}
        <circle cx="22" cy="27.6" r="1.5" fill="#ffc800"/>
        <rect x="21.35" y="28.8" width="1.3" height="2.2" fill="#ffc800"/>
      </>
    )}
    {unlocked && (
      <path d="M19 27 L 21 29 L 26 24" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    )}
  </svg>
);

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
      className={`p-4 rounded-3xl border-2 ${
        isCompleted
          ? "border-[#58cc02]/55 bg-[#1a2c35]"
          : "border-[#37464f] bg-[#1a2c35]"
      } text-white`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-[17px] uppercase tracking-wide text-white">
          Daily Quests
        </h3>
        <Link
          href="/quests"
          className="text-[13px] font-black text-[#1cb0f6] uppercase tracking-wider hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
            isCompleted
              ? "bg-[#58cc02]/20 text-[#58cc02]"
              : "bg-[#ffc800]/15 text-[#ffc800]"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-9 h-9 stroke-[2.3]" />
          ) : (
            <Zap className="w-9 h-9 fill-[#ffc800] text-[#ffc800]" strokeWidth={0}/>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-[14px] font-black mb-2 gap-2">
            <span className="text-slate-100 truncate">
              {isCompleted ? "Goal completed" : `Earn ${safeGoal} XP`}
            </span>
            <span className={isCompleted ? "text-[#58cc02]" : "text-[#afafaf]"}>
              {safeProgress} / {safeGoal}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <div
                className="w-full h-6 bg-[#243946] rounded-full overflow-hidden border border-[#1f2d37]"
                role="progressbar"
                aria-valuenow={safeProgress}
                aria-valuemin={0}
                aria-valuemax={safeGoal}
                aria-label={`Daily goal: ${safeProgress} of ${safeGoal} XP earned`}
              >
                <motion.div
                  className={`h-full rounded-full ${
                    isCompleted ? "bg-[#58cc02]" : "bg-gradient-to-r from-[#ffc800] to-[#ff9a3c]"
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
            {/* Reward chest - sits at END of progress bar (overhangs right side) */}
            <div
              className={`shrink-0 rounded-xl border-2 -mr-1 ${
                isCompleted
                  ? "bg-[#ce82ff]/18 border-[#ce82ff]"
                  : "bg-[#243946] border-[#3a5160]"
              } p-1.5`}
              title={isCompleted ? "Reward unlocked" : "Reward locked"}
            >
              <QuestChestReward unlocked={isCompleted} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
