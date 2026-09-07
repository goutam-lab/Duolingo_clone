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
  Dumbbell,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SkillPathResponse } from "@/types/api";
import { SkillProgressRing } from "./SkillProgressRing";
import { springSnappy } from "@/lib/motion";

interface SkillNodeProps {
  skill: SkillPathResponse;
  onClick: (skill: SkillPathResponse) => void;
  isFirstAvailable?: boolean;
  showLabel?: boolean;
}

export const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  onClick,
  isFirstAvailable = false,
  showLabel = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { status, progress, title, node_type, icon_key } = skill;

  const isLocked = status === "locked";
  const isAvailable = status === "available";
  const isCompleted = status === "completed";
  const isChest = node_type === "chest" || icon_key === "chest";

  // Real Duolingo rule: show LABEL ONLY for COMPLETED (gold) nodes.
  // Locked/available nodes show NO labels.
  const showNodeLabel = showLabel && isCompleted;

  // LOCKED CHEST ICON (real duolingo style - locked chest not gift)
  const renderLockedChestSvg = () => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Chest body */}
      <rect x="8" y="22" width="32" height="20" rx="3" fill="#5f7b8c" />
      <rect x="8" y="22" width="32" height="8" rx="2" fill="#7d97a6" />
      {/* Lid top band */}
      <rect x="6" y="18" width="36" height="6" rx="2" fill="#48606f" />
      {/* Chest bands */}
      <rect x="12" y="22" width="2" height="20" fill="#48606f" />
      <rect x="34" y="22" width="2" height="20" fill="#48606f" />
      {/* Lock plate */}
      <rect x="20" y="28" width="8" height="8" rx="1.5" fill="#3a505d" />
      {/* Shackle */}
      <path d="M20 28 V25 A4 4 0 0 1 28 25 V28" stroke="#7d97a6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Keyhole */}
      <circle cx="24" cy="31.2" r="1.4" fill="#1c2a33" />
      <rect x="23.2" y="32.4" width="1.6" height="2.4" fill="#1c2a33" />
    </svg>
  );

  const renderDumbbellSvg = () => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Left weight */}
      <rect x="4" y="16" width="8" height="16" rx="3" fill="#7d97a6" />
      <rect x="4" y="16" width="8" height="5" rx="2" fill="#93acba" />
      {/* Left plate */}
      <rect x="10" y="14" width="4" height="20" rx="1.5" fill="#5f7b8c" />
      {/* Bar */}
      <rect x="14" y="22" width="20" height="4" rx="2" fill="#7d97a6" />
      {/* Right plate */}
      <rect x="34" y="14" width="4" height="20" rx="1.5" fill="#5f7b8c" />
      {/* Right weight */}
      <rect x="36" y="16" width="8" height="16" rx="3" fill="#7d97a6" />
      <rect x="36" y="16" width="8" height="5" rx="2" fill="#93acba" />
    </svg>
  );

  const renderTrophyCupSvg = () => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Cup body */}
      <path d="M14 10 H34 V24 C34 32 28 36 24 36 C20 36 14 32 14 24 Z" fill="#7d97a6" />
      <path d="M14 10 H34 V15 H14 Z" fill="#93acba" />
      {/* Left handle */}
      <path d="M14 14 H10 C7 14 6 17 6 20 C6 23 8 26 11 26 H14" stroke="#7d97a6" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Right handle */}
      <path d="M34 14 H38 C41 14 42 17 42 20 C42 23 40 26 37 26 H34" stroke="#7d97a6" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Stem */}
      <rect x="21.5" y="36" width="5" height="6" rx="1" fill="#5f7b8c" />
      {/* Base */}
      <rect x="16" y="42" width="16" height="4" rx="2" fill="#5f7b8c" />
      <rect x="16" y="42" width="16" height="1.5" rx="1" fill="#7d97a6" />
    </svg>
  );

  const renderIcon = () => {
    if (isLocked && isChest) {
      return renderLockedChestSvg();
    }
    if (isLocked) {
      return <Lock className="w-8 h-8 text-[#677b88]" strokeWidth={2.2} />;
    }
    if (isCompleted && isChest) {
      return <Gift className="w-7 h-7 text-white stroke-[2.5]" />;
    }
    if (isCompleted) {
      return <Check className="w-8 h-8 text-white stroke-[3.2]" />;
    }
    if (isChest) {
      return renderLockedChestSvg();
    }

    switch (icon_key) {
      case "greetings":
      case "star":
        return (
          <Star className="w-8 h-8 fill-white text-white" strokeWidth={0} />
        );
      case "crown":
        return (
          <Crown className="w-8 h-8 fill-white text-white" strokeWidth={1.5} />
        );
      case "headphones":
        return (
          <Headphones className="w-8 h-8 text-white" strokeWidth={2.2} />
        );
      case "trophy":
        return renderTrophyCupSvg();
      case "sparkles":
        return <Sparkles className="w-7 h-7 text-white" />;
      case "dumbbells":
      case "weights":
        return renderDumbbellSvg();
      default:
        return (
          <Star className="w-8 h-8 fill-white text-white" strokeWidth={0} />
        );
    }
  };

  let buttonClasses = "";
  if (isLocked) {
    buttonClasses =
      "bg-[#2f3f48] border-b-[6px] border-[#223038] cursor-not-allowed text-[#677b88] opacity-90";
  } else if (isCompleted) {
    buttonClasses =
      "bg-[#ffc800] border-b-[6px] border-[#e5a500] text-white shadow-[0_10px_24px_rgba(255,200,0,0.26)]";
  } else if (isChest) {
    buttonClasses =
      "bg-[#2f3f48] border-b-[6px] border-[#223038] text-white";
  } else {
    buttonClasses =
      "bg-[#58cc02] border-b-[6px] border-[#46a302] text-white shadow-[0_10px_24px_rgba(88,204,2,0.32)]";
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
      className="relative z-10 flex flex-col items-center select-none"
    >
      {/* LABEL (only for COMPLETED nodes — gold uppercase, above node) */}
      {showNodeLabel && (
        <div
          className="mb-4 px-3 py-1 text-center text-[15px] sm:text-[16px] font-black uppercase tracking-[0.12em] leading-tight text-[#ffc800] pointer-events-none max-w-[200px] break-words"
        >
          {title}
        </div>
      )}

      {/* Node ring wrapper with START badge properly positioned ABOVE the entire ring (including label spacing) */}
      <div className="relative flex items-center justify-center">
        {/* START badge — sits ABOVE the progress ring, pointing DOWN at ring
            Fixed distance above the 80px ring (top offset = ~ -96px to clear ring top + label space) */}
        {isAvailable && isFirstAvailable && (
          <motion.div
            initial={shouldReduceMotion ? false : { y: -6, opacity: 0 }}
            animate={
              shouldReduceMotion
                ? { y: 0, opacity: 1 }
                : { y: [0, -4, 0], opacity: 1 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
            }
            className="absolute left-1/2 -translate-x-1/2 z-40 bg-[#131f24] text-[#58cc02] font-black text-[12px] uppercase tracking-[0.14em] px-4 py-1.5 rounded-xl border-2 border-[#58cc02] pointer-events-none"
            style={{ top: "-92px" }}
          >
            <span>START</span>
            {/* Arrow pointing DOWN to the ring */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#131f24] border-r-2 border-b-2 border-[#58cc02] rotate-45"
              style={{ bottom: "-7px" }}
            />
          </motion.div>
        )}

        <SkillProgressRing
          percentage={progress?.progress_percentage || 0}
          status={status}
          size={94}
          strokeWidth={7}
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
            className={`w-[76px] h-[76px] rounded-full flex items-center justify-center ${buttonClasses}`}
          >
            {renderIcon()}
          </motion.button>
        </SkillProgressRing>

        {/* Crown badge — bottom-right of ring, outside button bounds */}
        {isCompleted && (
          <div
            className="absolute -bottom-1 right-0 z-30 bg-[#ffc800] border-2 border-[#131f24] rounded-full p-1 shadow-md"
            title={`Crown Level ${progress?.crown_level || 1}`}
          >
            <Crown className="w-5 h-5 fill-white text-white" strokeWidth={1.8} />
          </div>
        )}
      </div>
    </div>
  );
};
