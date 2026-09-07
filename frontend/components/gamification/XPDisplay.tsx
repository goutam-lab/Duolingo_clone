"use client";

import React from "react";
import { Zap } from "lucide-react";

interface XPDisplayProps {
  totalXp: number;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({ totalXp }) => {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-sm tracking-wide text-[#ffc800] hover:bg-[#ffc800]/10 transition-colors"
      title={`${totalXp} Total XP`}
      role="status"
      aria-label={`${totalXp} total XP`}
    >
      <Zap className="w-5 h-5 fill-[#ffc800]" />
      <span>{totalXp} XP</span>
    </div>
  );
};
