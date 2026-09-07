"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Mascot } from "@/components/learning-path/Mascot";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Unable to connect to the learning server.",
  onRetry,
}) => {
  return (
    <div
      className="w-full max-w-md mx-auto py-16 px-6 flex flex-col items-center text-center"
      role="alert"
    >
      <div className="mb-6">
        <Mascot mood="happy" />
      </div>

      <div className="flex items-center gap-2 text-[#ff4b4b] font-black text-sm uppercase tracking-wider mb-2">
        <AlertCircle className="w-5 h-5" />
        <span>Connection Error</span>
      </div>

      <h2 className="text-xl font-black text-white mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-3 rounded-2xl bg-[#58cc02] border-b-[4px] border-[#46a302] hover:bg-[#62db03] active:translate-y-1 active:border-b-[2px] font-black text-xs uppercase tracking-wider text-white flex items-center gap-2 shadow-lg shadow-[#58cc02]/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
