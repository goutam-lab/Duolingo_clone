"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { HeartRefillModal } from "./HeartRefillModal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { popoverTransition } from "@/lib/motion";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts: number;
  onHeartsRefilled?: (newHearts: number) => void;
}

export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({
  hearts,
  maxHearts,
  onHeartsRefilled,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const isFull = hearts >= maxHearts;

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openPopover = () => {
    clearCloseTimer();
    setIsPopoverOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      setIsPopoverOpen(false);
    }, 140);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isPopoverOpen && !isModalOpen) {
        setIsPopoverOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPopoverOpen, isModalOpen]);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && rootRef.current?.contains(next)) {
      return;
    }
    setIsPopoverOpen(false);
  };

  return (
    <>
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
          onClick={() => setIsPopoverOpen((open) => !open)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-sm tracking-wide text-[#ff4b4b] hover:bg-[#ff4b4b]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4b4b] cursor-pointer"
          aria-expanded={isPopoverOpen}
          aria-haspopup="dialog"
          aria-label={`${hearts} out of ${maxHearts} hearts remaining`}
        >
          <motion.span
            key={hearts}
            initial={shouldReduceMotion ? false : { scale: 1.18 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="inline-flex"
          >
            <Heart className="w-5 h-5 fill-[#ff4b4b]" />
          </motion.span>
          <AnimatedNumber value={hearts} />
          {!isFull && (
            <span className="ml-0.5 px-1 py-0.5 text-[10px] bg-[#ff4b4b] text-white rounded-full inline-flex items-center">
              <Plus className="w-3 h-3 stroke-[3]" />
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {isPopoverOpen && (
            <motion.div
              role="dialog"
              aria-label="Heart status"
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
              className="absolute top-full right-0 mt-2 w-72 p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] shadow-[0_12px_32px_rgba(0,0,0,0.45)] z-50 text-white"
              onMouseEnter={openPopover}
              onMouseLeave={scheduleClose}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                {Array.from({ length: maxHearts }).map((_, index) => {
                  const filled = index < hearts;
                  return (
                    <Heart
                      key={index}
                      className={`w-6 h-6 ${
                        filled
                          ? "fill-[#ff4b4b] text-[#ff4b4b]"
                          : "text-[#52656f]"
                      }`}
                    />
                  );
                })}
              </div>

              <p className="text-center font-black text-lg">
                {hearts}/{maxHearts} hearts
              </p>
              <p className="text-center text-xs text-[#afafaf] mt-1 leading-relaxed">
                {isFull
                  ? "You have a full set of hearts. Keep practicing!"
                  : "You lose a heart when you miss an answer. Refill to keep learning."}
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsPopoverOpen(false);
                  setIsModalOpen(true);
                }}
                disabled={isFull}
                className={`mt-4 w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider ${
                  isFull
                    ? "bg-[#243946] text-slate-400 cursor-not-allowed"
                    : "bg-[#58cc02] text-white border-b-4 border-[#46a302] hover:brightness-105 active:translate-y-0.5 active:border-b-2"
                }`}
              >
                {isFull ? "Hearts are full" : "Refill hearts"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HeartRefillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hearts={hearts}
        maxHearts={maxHearts}
        onHeartsRefilled={onHeartsRefilled}
      />
    </>
  );
};
