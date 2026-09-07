"use client";

import React from "react";
import { Gem } from "lucide-react";

interface GemsDisplayProps {
  gems: number;
}

export const GemsDisplay: React.FC<GemsDisplayProps> = ({ gems }) => {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-sm tracking-wide text-[#1cb0f6] hover:bg-[#1cb0f6]/10 transition-colors"
      title={`${gems} Gems`}
      role="status"
      aria-label={`${gems} gems`}
    >
      <Gem className="w-5 h-5 fill-[#1cb0f6]" />
      <span>{gems}</span>
    </div>
  );
};
