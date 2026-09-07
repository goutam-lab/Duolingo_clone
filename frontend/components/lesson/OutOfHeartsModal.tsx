"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HeartCrack, Loader2, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { springSoft } from "@/lib/motion";

interface OutOfHeartsModalProps {
  isOpen: boolean;
  onRefilled: (hearts: number) => void;
  onQuit: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  isOpen,
  onRefilled,
  onQuit,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isRefilling, setIsRefilling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isRefilling) onQuit();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isRefilling, onQuit]);

  const handleRefill = async () => {
    setIsRefilling(true);
    setError(null);
    try {
      const res = await apiClient.refillHearts();
      onRefilled(res.hearts);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to refill hearts. Please try again."
      );
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="out-of-hearts-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl bg-[#1a2c35] border-2 border-[#37464f] p-6 text-center text-white shadow-2xl space-y-5"
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
            <div className="mx-auto w-16 h-16 rounded-3xl bg-[#ff4b4b]/15 border border-[#ff4b4b]/30 flex items-center justify-center text-[#ff4b4b]">
              <HeartCrack className="w-9 h-9" />
            </div>
            <div>
              <h3
                id="out-of-hearts-title"
                className="text-2xl font-black tracking-tight mb-2"
              >
                You ran out of hearts
              </h3>
              <p className="text-sm text-[#afafaf]">
                Refill your hearts for free to continue this lesson.
              </p>
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleRefill}
                disabled={isRefilling}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] border-b-4 border-[#46a302] hover:brightness-105 active:translate-y-1 active:border-b-[1px] text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRefilling ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Refill hearts (free)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onQuit}
                disabled={isRefilling}
                className="w-full py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-400 hover:text-white"
              >
                Return to learning path
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
