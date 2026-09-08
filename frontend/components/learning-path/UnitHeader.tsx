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
    <header className="w-full rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] px-4 py-3 sm:px-5 sm:py-4 text-white keep-white shadow-[0_4px_14px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_16px_rgba(19,31,36,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-0.5 text-[11px] font-black uppercase tracking-[0.14em] text-white/90">
            <ChevronLeft className="w-4 h-4" />
            <span>
              Section {sectionNumber}, Unit {unit.order_index}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight mt-0.5 truncate text-white">
            {unit.title}
          </h2>
          {unit.description && (
            <p className="text-xs sm:text-sm text-white/90 mt-1 leading-snug line-clamp-2">
              {unit.description}
            </p>
          )}
        </div>

        <button
          type="button"
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/15 hover:bg-black/25 active:scale-95 border border-white/20 font-black text-[11px] uppercase tracking-wider text-white cursor-pointer"
          title={`View guidebook for ${unit.title}`}
          aria-label={`View guidebook for ${unit.title}`}
        >
          <BookMarked className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">Guidebook</span>
        </button>
      </div>
    </header>
  );
};
