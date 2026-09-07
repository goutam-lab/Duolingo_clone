"use client";

import React, { useState } from "react";
import { Flame, CalendarCheck2, X } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  const [showPopover, setShowPopover] = useState(false);
  const hasStreak = streak > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPopover((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-sm tracking-wide transition-colors cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#ff9600]/40 ${
          hasStreak
            ? "text-[#ff9600] hover:bg-[#ff9600]/10"
            : "text-slate-400 hover:bg-slate-800"
        }`}
        title={`${streak} Day Streak. Click to view streak details.`}
        role="status"
        aria-label={`${streak} day streak. Click for details.`}
      >
        <Flame
          className={`w-5 h-5 transition-transform group-hover:scale-110 ${
            hasStreak ? "fill-[#ff9600] animate-pulse" : "text-slate-500"
          }`}
        />
        <span>{streak}</span>
      </button>

      {/* Interactive Streak Popover */}
      {showPopover && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopover(false)}
          />
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-[#1a2c35] border-2 border-[#2b3d48] rounded-2xl shadow-xl z-50 text-center animate-in fade-in zoom-in-95 duration-150 text-white select-none"
            role="dialog"
            aria-label="Streak details"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPopover(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#243843] transition-colors"
                aria-label="Close streak details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-[#ff9600]/15 border-2 border-[#ff9600]/30 flex items-center justify-center text-[#ff9600]">
              <Flame className="w-8 h-8 fill-[#ff9600]" />
            </div>

            <h4 className="text-lg font-black text-white">
              {hasStreak ? `${streak} Day Streak!` : "No Active Streak"}
            </h4>

            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {hasStreak
                ? "You're on fire! Practice tomorrow to keep your flame burning and build your learning habit."
                : "Complete a lesson today to ignite your streak and build momentum!"}
            </p>

            <div className="mt-3 pt-3 border-t border-[#2b3d48] flex items-center justify-center gap-1.5 text-xs font-bold text-[#ff9600]">
              <CalendarCheck2 className="w-4 h-4" />
              <span>{hasStreak ? "Active for today" : "Practice to activate"}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
