"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck2, Flame } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { popoverTransition } from "@/lib/motion";

interface StreakDisplayProps {
  streak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasStreak = streak > 0;

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openPopover = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setIsOpen(false), 140);
  };

  useEffect(() => () => clearCloseTimer(), []);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && rootRef.current?.contains(next)) return;
    setIsOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openPopover}
      onMouseLeave={scheduleClose}
      onFocus={openPopover}
      onBlur={handleBlur}
    >
      <motion.button
        type="button"
        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-sm tracking-wide cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff9600] ${
          hasStreak
            ? "text-[#ff9600] hover:bg-[#ff9600]/10"
            : "text-slate-400 hover:bg-white/5"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`${streak} day streak`}
      >
        <Flame className={`w-5 h-5 ${hasStreak ? "fill-[#ff9600]" : ""}`} />
        <AnimatedNumber value={streak} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Streak details"
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.96, y: -4 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: -4 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : popoverTransition}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] shadow-[0_12px_32px_rgba(0,0,0,0.45)] z-50 text-center text-white"
            onMouseEnter={openPopover}
            onMouseLeave={scheduleClose}
          >
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-[#ff9600]/15 border-2 border-[#ff9600]/30 flex items-center justify-center text-[#ff9600]">
              <Flame className="w-7 h-7 fill-[#ff9600]" />
            </div>
            <h4 className="text-lg font-black">
              {hasStreak ? `${streak} day streak` : "Start a streak"}
            </h4>
            <p className="text-xs text-[#afafaf] mt-1 leading-relaxed">
              {hasStreak
                ? "Practice tomorrow to keep your streak alive."
                : "Complete a lesson today to light your streak."}
            </p>
            <div className="mt-3 pt-3 border-t border-[#37464f] flex items-center justify-center gap-1.5 text-xs font-bold text-[#ff9600]">
              <CalendarCheck2 className="w-4 h-4" />
              <span>{hasStreak ? "Active today" : "Not started yet"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
