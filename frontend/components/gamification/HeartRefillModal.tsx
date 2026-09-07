"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Heart, Loader2, Sparkles, X } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { springSoft } from "@/lib/motion";

interface HeartRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearts: number;
  maxHearts: number;
  onHeartsRefilled?: (newHearts: number) => void;
}

export const HeartRefillModal: React.FC<HeartRefillModalProps> = ({
  isOpen,
  onClose,
  hearts,
  maxHearts,
  onHeartsRefilled,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isRefilling, setIsRefilling] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isFull = hearts >= maxHearts;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleRefill = async () => {
    if (isFull || isRefilling) return;
    setIsRefilling(true);
    setErrorMessage(null);

    try {
      const res = await apiClient.refillHearts();
      setSuccessMessage(res.message || "Hearts fully restored!");
      if (onHeartsRefilled) {
        onHeartsRefilled(res.hearts);
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to refill hearts. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="refill-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-[#1a2c35] border-2 border-[#37464f] rounded-3xl p-6 sm:p-8 text-center text-white relative shadow-2xl space-y-6"
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

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-[#ff4b4b]/15 border-2 border-[#ff4b4b]/30 flex items-center justify-center mb-3">
                <Heart className="w-12 h-12 fill-[#ff4b4b] text-[#ff4b4b]" />
              </div>
              <h2
                id="refill-modal-title"
                className="text-2xl font-black text-white tracking-tight"
              >
                {isFull ? "Full health" : "Need more hearts?"}
              </h2>
              <p className="text-sm text-[#afafaf] mt-1 max-w-xs leading-relaxed">
                Hearts keep your practice going. Each mistake in a lesson costs 1
                heart.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 py-2">
              {Array.from({ length: maxHearts }).map((_, index) => {
                const isFilled = index < hearts;
                return (
                  <div
                    key={index}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      isFilled
                        ? "bg-[#ff4b4b]/20 border-2 border-[#ff4b4b]"
                        : "bg-[#131f24] border-2 border-[#37464f] opacity-50"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isFilled
                          ? "fill-[#ff4b4b] text-[#ff4b4b]"
                          : "text-slate-600"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {successMessage && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#58cc02]/15 border border-[#58cc02] text-[#58cc02] text-sm font-bold">
                <Check className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#ff4b4b]/15 border border-[#ff4b4b] text-[#ff4b4b] text-sm font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {isFull ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#243946] text-slate-400 border-2 border-[#374c5a] cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#58cc02]" />
                  <span>
                    Hearts are full ({hearts}/{maxHearts})
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRefill}
                  disabled={isRefilling}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] hover:brightness-105 active:translate-y-1 text-white border-b-4 border-[#46a302] active:border-b-[1px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isRefilling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Refilling hearts...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Refill hearts for free</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
              >
                Back to learning
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
