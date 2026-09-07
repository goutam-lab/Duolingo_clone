"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { springSoft } from "@/lib/motion";

interface QuitModalProps {
  isOpen: boolean;
  onStay: () => void;
  onQuit: () => void;
}

export const QuitModal: React.FC<QuitModalProps> = ({
  isOpen,
  onStay,
  onQuit,
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onStay();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onStay]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quit-modal-title"
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
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3
                id="quit-modal-title"
                className="text-xl font-black tracking-tight mb-2"
              >
                Are you sure you want to quit?
              </h3>
              <p className="text-sm text-[#afafaf]">
                Progress in this current session will be lost.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={onStay}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] border-b-4 border-[#46a302] hover:brightness-105 active:translate-y-1 active:border-b-[1px] text-white"
              >
                Keep learning
              </button>
              <button
                type="button"
                onClick={onQuit}
                className="w-full py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-400 hover:text-[#ff4b4b]"
              >
                End lesson
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
