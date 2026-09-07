"use client";

import React from "react";
import { BookMarked, Sparkles } from "lucide-react";
import { UnitPathResponse } from "@/types/api";

interface UnitHeaderProps {
  unit: UnitPathResponse;
  sectionNumber?: number;
}

export const UnitHeader: React.FC<UnitHeaderProps> = ({
  unit,
  sectionNumber = 1,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto mb-8 rounded-2xl bg-[#58cc02] border-b-[6px] border-[#46a302] p-5 text-white shadow-lg shadow-[#58cc02]/15 relative overflow-hidden">
      {/* Subtle decorative background shimmer */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-green-100 opacity-90 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Section {sectionNumber}, Unit {unit.order_index}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {unit.title}
          </h2>

          {unit.description && (
            <p className="text-xs sm:text-sm font-medium text-green-50 mt-1 line-clamp-1 opacity-95">
              {unit.description}
            </p>
          )}
        </div>

        {/* Guidebook button */}
        <button
          type="button"
          className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 font-black text-xs uppercase tracking-wider transition-all"
          title={`View Guidebook for ${unit.title}`}
          aria-label={`View Guidebook for ${unit.title}`}
        >
          <BookMarked className="w-4 h-4" />
          <span className="hidden sm:inline">Guidebook</span>
        </button>
      </div>
    </header>
  );
};
