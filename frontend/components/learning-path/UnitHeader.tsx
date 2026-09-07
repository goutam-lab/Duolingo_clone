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
    <header className="sticky top-[49px] lg:top-0 z-20 w-full rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] px-4 py-3 text-white shadow-[0_8px_16px_rgba(19,31,36,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-0.5 text-[11px] font-black uppercase tracking-[0.14em] text-white/85">
            <ChevronLeft className="w-4 h-4" />
            <span>
              Section {sectionNumber}, Unit {unit.order_index}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight mt-0.5 truncate">
            {unit.title}
          </h2>
        </div>

        <button
          type="button"
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131f24]/15 hover:bg-[#131f24]/25 active:scale-95 border border-white/20 font-black text-[11px] uppercase tracking-wider"
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
