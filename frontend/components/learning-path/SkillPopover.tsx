"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, CheckCircle2, Play, Sparkles, X } from "lucide-react";
import { SkillPathResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { springSoft } from "@/lib/motion";

interface SkillPopoverProps {
  skill: SkillPathResponse | null;
  onClose: () => void;
}

export const SkillPopover: React.FC<SkillPopoverProps> = ({ skill, onClose }) => {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && skill) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [skill, onClose]);

  const handleStartLesson = () => {
    if (!skill) return;
    const nextLesson = skill.lessons.find((lesson) => !lesson.is_completed) || skill.lessons[0];
    if (nextLesson) {
      router.push(`/lesson/${nextLesson.id}`);
    }
  };

  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-popover-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1a2c35] border-2 border-slate-200 dark:border-[#37464f] p-6 text-slate-900 dark:text-white shadow-2xl relative"
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
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#58cc02] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>
                {skill.status === "completed" ? "Skill completed" : "Active skill"}
              </span>
            </div>

            <h3
              id="skill-popover-title"
              className="text-xl font-black tracking-tight mb-1 text-slate-900 dark:text-white"
            >
              {skill.title}
            </h3>
            {skill.description && (
              <p className="text-xs text-slate-600 dark:text-[#afafaf] mb-4">{skill.description}</p>
            )}

            <div className="rounded-2xl bg-slate-50 dark:bg-[#131f24] border border-slate-200 dark:border-[#37464f] p-3.5 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#1cb0f6]" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Lesson{" "}
                    {(skill.progress?.lessons_completed || 0) +
                      (skill.status === "completed" ? 0 : 1)}{" "}
                    of {skill.progress?.total_lessons || skill.lessons.length}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                    {(skill.lessons.find((lesson) => !lesson.is_completed) ||
                      skill.lessons[0])?.title || "Language practice"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-[#ffc800]">
                {skill.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-[#58cc02]" />
                ) : (
                  <span>
                    +
                    {(skill.lessons.find((lesson) => !lesson.is_completed) ||
                      skill.lessons[0])?.xp_reward || 10}{" "}
                    XP
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartLesson}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${
                skill.status === "completed"
                  ? "bg-[#ffc800] border-b-4 border-[#e5a500] hover:brightness-105 active:translate-y-1 active:border-b-[1px] text-slate-950"
                  : "bg-[#58cc02] border-b-4 border-[#46a302] hover:brightness-105 active:translate-y-1 active:border-b-[1px] text-white"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {skill.status === "completed" ? "Practice again" : "Start lesson"}
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
