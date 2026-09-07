"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, Sparkles, X } from "lucide-react";
import { springSoft } from "@/lib/motion";

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
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && achievementCodes && achievementCodes.length > 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievement-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-[#1a2c35] border-2 border-[#ce82ff]/50 rounded-3xl p-6 sm:p-8 text-center text-white relative shadow-[0_0_50px_rgba(206,130,255,0.25)] space-y-6"
            onClick={(event) => event.stopPropagation()}
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : springSoft}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#243843]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative inline-block mx-auto">
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 360, damping: 16 }}
                className="w-24 h-24 rounded-3xl bg-[#ce82ff]/20 border-2 border-[#ce82ff] flex items-center justify-center text-[#ce82ff] shadow-lg shadow-[#ce82ff]/30"
              >
                <Award className="w-14 h-14 stroke-[2.2]" />
              </motion.div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#ffc800] text-[#131f24] flex items-center justify-center shadow-lg font-black text-xs">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#ce82ff]">
                Achievement unlocked
              </span>
              <h2
                id="achievement-modal-title"
                className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1"
              >
                Congratulations!
              </h2>
            </div>

            <div className="space-y-3">
              {achievementCodes.map((code, index) => {
                const detail = ACHIEVEMENT_DETAILS[code] || {
                  title: code,
                  description: "New milestone achieved!",
                };
                return (
                  <motion.div
                    key={code}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.08 * index }}
                    className="p-4 rounded-2xl bg-[#131f24] border-2 border-[#ce82ff]/30 text-left flex items-center gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#ffc800]/20 border border-[#ffc800] flex items-center justify-center text-[#ffc800] shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base">
                        {detail.title}
                      </h3>
                      <p className="text-xs text-[#afafaf] mt-0.5">
                        {detail.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] hover:brightness-105 text-white border-b-4 border-[#46a302] active:translate-y-1 active:border-b-[1px]"
            >
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
