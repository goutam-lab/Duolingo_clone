"use client";

import React from "react";
import {
  Check,
  Crown,
  Gift,
  Headphones,
  Lock,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SkillPathResponse } from "@/types/api";
import { SkillProgressRing } from "./SkillProgressRing";
import { springSnappy } from "@/lib/motion";

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
  const isCompleted = status === "completed";
  const isChest = node_type === "chest" || icon_key === "chest";

  const renderIcon = () => {
    if (isLocked) {
      return <Lock className="w-7 h-7 text-[#677b88]" />;
    }
    if (isCompleted) {
      return <Check className="w-7 h-7 text-white stroke-[3.5]" />;
    }
    if (isChest) {
      return <Gift className="w-7 h-7 text-white stroke-[2.5]" />;
    }

    switch (icon_key) {
      case "greetings":
      case "star":
        return <Star className="w-7 h-7 fill-white text-white" />;
      case "crown":
        return <Crown className="w-7 h-7 fill-white text-white" />;
      case "headphones":
        return <Headphones className="w-7 h-7 text-white stroke-[2.5]" />;
      case "trophy":
        return <Trophy className="w-7 h-7 fill-white text-white" />;
      case "sparkles":
        return <Sparkles className="w-7 h-7 text-white" />;
      default:
        return <Star className="w-7 h-7 fill-white text-white" />;
    }
  };

  let buttonClasses = "";
  if (isLocked) {
    buttonClasses =
      "bg-[#37464f] border-b-[6px] border-[#25333a] cursor-not-allowed text-[#677b88] opacity-85";
  } else if (isCompleted) {
    buttonClasses =
      "bg-[#ffc800] border-b-[6px] border-[#e5a500] text-white shadow-[0_8px_18px_rgba(255,200,0,0.22)]";
  } else if (isChest) {
    buttonClasses =
      "bg-[#ce82ff] border-b-[6px] border-[#a559d9] text-white shadow-[0_8px_18px_rgba(206,130,255,0.22)]";
  } else {
    buttonClasses =
      "bg-[#58cc02] border-b-[6px] border-[#46a302] text-white shadow-[0_8px_18px_rgba(88,204,2,0.28)]";
  }

  const handleClick = () => {
    if (!isLocked) {
      onClick(skill);
    }
  };

  return (
    <div
      data-skill-id={skill.id}
      data-skill-status={status}
      className="relative z-10 flex flex-col items-center select-none w-[88px]"
    >
      {isAvailable && isFirstAvailable && (
        <motion.div
          initial={{ y: -4, opacity: 0 }}
          animate={
            shouldReduceMotion
              ? { y: 0, opacity: 1 }
              : { y: [0, -3, 0], opacity: 1 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }
          className="absolute -top-7 z-20 bg-[#131f24] text-[#58cc02] font-black text-[11px] uppercase tracking-wider px-3 py-0.5 rounded-md border-2 border-[#58cc02] pointer-events-none"
        >
          <span>Start</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#131f24] border-r-2 border-b-2 border-[#58cc02] rotate-45" />
        </motion.div>
      )}

      <SkillProgressRing
        percentage={progress?.progress_percentage || 0}
        status={status}
        size={80}
        strokeWidth={6}
      >
        <motion.button
          type="button"
          onClick={handleClick}
          disabled={isLocked}
          aria-disabled={isLocked}
          whileHover={
            shouldReduceMotion || isLocked ? undefined : { y: -2, scale: 1.03 }
          }
          whileTap={
            shouldReduceMotion || isLocked ? undefined : { y: 3, scale: 0.97 }
          }
          transition={springSnappy}
          aria-label={`Skill: ${title}. Status: ${status}. ${
            progress?.lessons_completed || 0
          } of ${progress?.total_lessons || 0} lessons completed.`}
          className={`w-[64px] h-[64px] rounded-full flex items-center justify-center ${buttonClasses}`}
        >
          {renderIcon()}
        </motion.button>
      </SkillProgressRing>

      {isCompleted && (
        <div
          className="absolute bottom-0 right-1 z-20 bg-[#ffc800] border-2 border-[#131f24] rounded-full p-0.5 shadow"
          title={`Crown Level ${progress?.crown_level || 1}`}
        >
          <Crown className="w-4 h-4 fill-white text-white" />
        </div>
      )}
    </div>
  );
};
