"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quit-modal-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-[#1a2c35] border-2 border-[#2b3d48] p-6 text-center text-white shadow-2xl space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h3 id="quit-modal-title" className="text-xl font-black tracking-tight mb-2">
            Are you sure you want to quit?
          </h3>
          <p className="text-sm text-slate-400">
            All your progress in this current session will be lost.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={onStay}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] border-b-[4px] border-[#46a302] hover:bg-[#61db02] active:translate-y-1 active:border-b-[1px] text-white shadow-lg transition-all cursor-pointer"
          >
            Keep Learning
          </button>

          <button
            type="button"
            onClick={onQuit}
            className="w-full py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-400 hover:text-[#ff4b4b] hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            End Lesson
          </button>
        </div>
      </div>
    </div>
  );
};
