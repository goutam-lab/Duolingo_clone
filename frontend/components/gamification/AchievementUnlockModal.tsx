"use client";

import React from "react";
import { Award, Sparkles, X } from "lucide-react";

interface AchievementUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievementCodes: string[];
}

const ACHIEVEMENT_DETAILS: Record<
  string,
  { title: string; description: string }
> = {
  FIRST_LESSON: {
    title: "First Step",
    description: "Complete your very first lesson.",
  },
  "100_XP": {
    title: "Century Club",
    description: "Earn 100 total XP across all lessons.",
  },
  THREE_DAY_STREAK: {
    title: "On Fire",
    description: "Maintain a 3-day practice streak.",
  },
  FIVE_LESSONS: {
    title: "Dedicated Learner",
    description: "Complete 5 lessons.",
  },
  FIRST_SKILL_COMPLETED: {
    title: "Skill Master",
    description: "Complete all lessons in a skill to earn your first crown.",
  },
};

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  isOpen,
  onClose,
  achievementCodes,
}) => {
  if (!isOpen || !achievementCodes || achievementCodes.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-modal-title"
    >
      <div
        className="w-full max-w-md bg-[#1a2c35] border-2 border-[#ce82ff]/50 rounded-3xl p-6 sm:p-8 text-center text-white relative shadow-[0_0_50px_rgba(206,130,255,0.25)] space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#243843] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Visual */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-[#ce82ff]/20 border-2 border-[#ce82ff] flex items-center justify-center text-[#ce82ff] shadow-lg shadow-[#ce82ff]/30 animate-bounce">
            <Award className="w-14 h-14 stroke-[2.2]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#ffc800] text-[#131f24] flex items-center justify-center shadow-lg font-black text-xs">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#ce82ff]">
            Achievement Unlocked!
          </span>
          <h2
            id="achievement-modal-title"
            className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1"
          >
            Congratulations!
          </h2>
        </div>

        {/* Unlocked Badges List */}
        <div className="space-y-3">
          {achievementCodes.map((code) => {
            const detail = ACHIEVEMENT_DETAILS[code] || {
              title: code,
              description: "New milestone achieved!",
            };
            return (
              <div
                key={code}
                className="p-4 rounded-2xl bg-[#131f24] border-2 border-[#ce82ff]/30 text-left flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ffc800]/20 border border-[#ffc800] flex items-center justify-center text-[#ffc800] shrink-0 font-black">
                  ★
                </div>
                <div>
                  <h3 className="font-black text-white text-base">
                    {detail.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {detail.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collect Reward Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] hover:bg-[#61db02] text-white border-b-[4px] border-[#46a302] active:translate-y-1 active:border-b-[1px] shadow-lg shadow-[#58cc02]/20 transition-all cursor-pointer"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};
