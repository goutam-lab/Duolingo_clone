"use client";

import React from "react";
import { Star, Lock, Check, Crown, Gift, BookOpen, Headphones, Trophy, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SkillPathResponse } from "@/types/api";
import { SkillProgressRing } from "./SkillProgressRing";

interface SkillNodeProps {
  skill: SkillPathResponse;
  onClick: (skill: SkillPathResponse) => void;
  isFirstAvailable?: boolean;
}

export const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  onClick,
  isFirstAvailable = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { status, progress, title, node_type, icon_key } = skill;

  const isLocked = status === "locked";
  const isAvailable = status === "available";
  const isInProgress = status === "in_progress";
  const isCompleted = status === "completed";
  const isChest = node_type === "chest" || icon_key === "chest";

  // Dynamic icon selection
  const renderIcon = () => {
    if (isLocked) {
      return <Lock className="w-8 h-8 text-[#677b88]" />;
    }
    if (isCompleted) {
      return <Check className="w-8 h-8 text-white stroke-[3.5]" />;
    }
    if (isChest) {
      return <Gift className="w-8 h-8 text-white stroke-[2.5]" />;
    }

    switch (icon_key) {
      case "greetings":
      case "star":
        return <Star className="w-8 h-8 fill-white text-white" />;
      case "crown":
        return <Crown className="w-8 h-8 fill-white text-white" />;
      case "headphones":
        return <Headphones className="w-8 h-8 text-white stroke-[2.5]" />;
      case "trophy":
        return <Trophy className="w-8 h-8 fill-white text-white" />;
      case "sparkles":
        return <Sparkles className="w-8 h-8 text-white" />;
      default:
        return <BookOpen className="w-8 h-8 text-white stroke-[2.5]" />;
    }
  };

  // 3D Button colors based on state
  let buttonClasses = "";
  if (isLocked) {
    buttonClasses =
      "bg-[#37464f] border-b-[6px] border-[#25333a] cursor-not-allowed text-[#677b88] opacity-85";
  } else if (isCompleted) {
    buttonClasses =
      "bg-[#ffc800] border-b-[6px] border-[#e5a500] hover:brightness-105 active:translate-y-1 active:border-b-[2px] text-white shadow-lg shadow-[#ffc800]/20";
  } else if (isChest) {
    buttonClasses =
      "bg-[#ce82ff] border-b-[6px] border-[#a559d9] hover:brightness-105 active:translate-y-1 active:border-b-[2px] text-white shadow-lg shadow-[#ce82ff]/20";
  } else {
    // available or in_progress: vibrant Duolingo green
    buttonClasses =
      "bg-[#58cc02] border-b-[6px] border-[#46a302] hover:brightness-105 active:translate-y-1 active:border-b-[2px] text-white shadow-lg shadow-[#58cc02]/25";
  }

  const handleClick = () => {
    if (!isLocked) {
      onClick(skill);
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Playful "START" banner hovering above the first active available skill node */}
      {isAvailable && isFirstAvailable && (
        <motion.div
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: [0, -6, 0], opacity: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
          }
          className="absolute -top-11 z-20 bg-white text-[#58cc02] font-black text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-lg border-2 border-[#58cc02] flex items-center gap-1 pointer-events-none"
        >
          <span>START</span>
          {/* Tooltip caret */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#58cc02] rotate-45" />
        </motion.div>
      )}

      {/* Wrapping Skill Progress Ring */}
      <SkillProgressRing
        percentage={progress?.progress_percentage || 0}
        status={status}
        size={86}
        strokeWidth={7}
      >
        <button
          type="button"
          onClick={handleClick}
          disabled={isLocked}
          aria-disabled={isLocked}
          aria-label={`Skill: ${title}. Status: ${status}. ${progress?.lessons_completed || 0} of ${
            progress?.total_lessons || 0
          } lessons completed.`}
          className={`w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-100 ${buttonClasses}`}
        >
          {renderIcon()}
        </button>
      </SkillProgressRing>

      {/* Floating Crown Badge for Completed Skills */}
      {isCompleted && (
        <div
          className="absolute -bottom-1 -right-1 z-20 bg-[#ffc800] border-2 border-[#131f24] rounded-full p-1 shadow"
          title={`Crown Level ${progress?.crown_level || 1}`}
        >
          <Crown className="w-4 h-4 fill-white text-white" />
        </div>
      )}

      {/* Accessible Title tooltip / text label below node */}
      <span
        className={`mt-2 text-xs font-extrabold text-center max-w-[110px] truncate ${
          isLocked ? "text-slate-500" : "text-slate-200"
        }`}
      >
        {title}
      </span>
    </div>
  );
};
