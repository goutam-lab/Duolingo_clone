"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { springSoft } from "@/lib/motion";

interface FeedbackDrawerProps {
  isSubmitted: boolean;
  isCorrect: boolean | null;
  feedbackText: string;
  correctAnswerRevealed?: string | null;
  canCheck: boolean;
  isChecking: boolean;
  onCheck: () => void;
  onContinue: () => void;
}

export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({
  isSubmitted,
  isCorrect,
  feedbackText,
  correctAnswerRevealed,
  canCheck,
  isChecking,
  onCheck,
  onContinue,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isSuccess = isCorrect === true;

  return (
    <footer className="w-full select-none">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="w-full border-t-2 border-[#37464f] bg-[#131f24] py-4 px-4 sm:px-8"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-end">
              <button
                type="button"
                onClick={onCheck}
                disabled={!canCheck || isChecking}
                className={`w-full sm:w-44 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 ${
                  canCheck && !isChecking
                    ? "bg-[#58cc02] border-b-4 border-[#46a302] hover:brightness-105 active:translate-y-1 active:border-b-[1px] text-white cursor-pointer"
                    : "bg-[#273339] border-b-4 border-[#1d272c] text-slate-500 cursor-not-allowed opacity-60"
                }`}
              >
                {isChecking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Check</span>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 16, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={shouldReduceMotion ? { duration: 0 } : springSoft}
            className={`w-full border-t-2 py-5 px-4 sm:px-8 ${
              isSuccess
                ? "border-[#58cc02] bg-[#132819] text-white"
                : "border-[#ff4b4b] bg-[#331515] text-white"
            }`}
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <motion.div
                  initial={shouldReduceMotion ? false : { scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 16 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    isSuccess
                      ? "bg-[#58cc02] text-white shadow-[0_0_15px_rgba(88,204,2,0.4)]"
                      : "bg-[#ff4b4b] text-white shadow-[0_0_15px_rgba(255,75,75,0.4)]"
                  }`}
                >
                  {isSuccess ? (
                    <Check className="w-7 h-7 stroke-[3]" />
                  ) : (
                    <X className="w-7 h-7 stroke-[3]" />
                  )}
                </motion.div>

                <div className="text-left">
                  <h4
                    className={`text-xl font-black tracking-tight ${
                      isSuccess ? "text-[#58cc02]" : "text-[#ff4b4b]"
                    }`}
                  >
                    {isSuccess ? "Nice job!" : "Correct solution:"}
                  </h4>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">
                    {!isSuccess && correctAnswerRevealed
                      ? correctAnswerRevealed
                      : feedbackText || (isSuccess ? "Great work!" : "Not quite.")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onContinue}
                autoFocus
                className={`w-full sm:w-44 py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                  isSuccess
                    ? "bg-[#58cc02] border-b-4 border-[#46a302] hover:brightness-105 active:translate-y-1 active:border-b-[1px] text-white"
                    : "bg-[#ff4b4b] border-b-4 border-[#ea2b2b] hover:brightness-105 active:translate-y-1 active:border-b-[1px] text-white"
                }`}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};
