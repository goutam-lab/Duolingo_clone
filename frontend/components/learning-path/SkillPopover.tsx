"use client";

import React from "react";
import { X, Play, CheckCircle2, BookOpen, Sparkles } from "lucide-react";
import { SkillPathResponse } from "@/types/api";
import { useRouter } from "next/navigation";

interface SkillPopoverProps {
  skill: SkillPathResponse | null;
  onClose: () => void;
}

export const SkillPopover: React.FC<SkillPopoverProps> = ({ skill, onClose }) => {
  const router = useRouter();

  if (!skill) return null;

  const { title, description, progress, lessons, status } = skill;
  const isCompleted = status === "completed";

  // Find next playable lesson in this skill
  const nextLesson = lessons.find((l) => !l.is_completed) || lessons[0];

  const handleStartLesson = () => {
    if (nextLesson) {
      router.push(`/lesson/${nextLesson.id}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-popover-title"
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-[#1a2c35] border-2 border-[#2b3d48] p-6 text-white shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#58cc02] mb-2">
          <Sparkles className="w-4 h-4" />
          <span>
            {isCompleted ? "Skill Completed!" : "Active Skill"}
          </span>
        </div>

        {/* Skill Title & Description */}
        <h3 id="skill-popover-title" className="text-xl font-black tracking-tight mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-slate-400 mb-4">{description}</p>
        )}

        {/* Progress Summary Card */}
        <div className="rounded-2xl bg-[#131f24] border border-[#2b3d48] p-3.5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#1cb0f6]" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-300">
                Lesson {(progress?.lessons_completed || 0) + (isCompleted ? 0 : 1)} of{" "}
                {progress?.total_lessons || lessons.length}
              </div>
              <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                {nextLesson?.title || "Language Practice"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-[#ffc800]">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-[#58cc02]" />
            ) : (
              <span>+{nextLesson?.xp_reward || 10} XP</span>
            )}
          </div>
        </div>

        {/* Start / Practice Action Button */}
        <button
          type="button"
          onClick={handleStartLesson}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
            isCompleted
              ? "bg-[#ffc800] border-b-[4px] border-[#e5a500] hover:bg-[#ffcf1a] active:translate-y-1 active:border-b-[1px] text-slate-950"
              : "bg-[#58cc02] border-b-[4px] border-[#46a302] hover:bg-[#61db02] active:translate-y-1 active:border-b-[1px] text-white"
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isCompleted ? "Practice Again" : "Start Lesson"}</span>
        </button>
      </div>
    </div>
  );
};
