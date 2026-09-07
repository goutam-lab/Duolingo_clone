"use client";

import React from "react";
import { BookMarked, ChevronLeft } from "lucide-react";
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
    <header className="w-full max-w-xl mx-auto mb-8 rounded-2xl bg-[#58cc02] border-b-[6px] border-[#46a302] p-5 text-white shadow-[0_10px_24px_rgba(88,204,2,0.18)] relative overflow-hidden">
      <div className="absolute -top-16 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/85 mb-1.5">
            <ChevronLeft className="w-4 h-4" />
            <span>
              Section {sectionNumber}, Unit {unit.order_index}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {unit.title}
          </h2>

          {unit.description && (
            <p className="text-xs sm:text-sm font-medium text-white/90 mt-1 line-clamp-2">
              {unit.description}
            </p>
          )}
        </div>

        <button
          type="button"
          className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#131f24]/15 hover:bg-[#131f24]/25 active:scale-95 border border-white/20 font-black text-xs uppercase tracking-wider"
          title={`View guidebook for ${unit.title}`}
          aria-label={`View guidebook for ${unit.title}`}
        >
          <BookMarked className="w-4 h-4" />
          <span className="hidden sm:inline">Guidebook</span>
        </button>
      </div>
    </header>
  );
};
