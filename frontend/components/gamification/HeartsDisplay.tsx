"use client";

import React, { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts: number;
  onHeartsRefilled?: (newHearts: number) => void;
}

export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({
  hearts,
  maxHearts,
  onHeartsRefilled,
}) => {
  const [isRefilling, setIsRefilling] = useState(false);
  const isFull = hearts >= maxHearts;

  const handleRefill = async () => {
    if (isFull || isRefilling) return;
    try {
      setIsRefilling(true);
      const res = await apiClient.refillHearts();
      if (onHeartsRefilled) {
        onHeartsRefilled(res.hearts);
      }
    } catch (err) {
      console.error("Failed to refill hearts:", err);
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm tracking-wide text-[#ff4b4b] hover:bg-[#ff4b4b]/10 transition-colors cursor-pointer group"
      onClick={handleRefill}
      title={isFull ? `${hearts} Hearts (Full)` : `Click to refill hearts (${hearts}/${maxHearts})`}
      role="status"
      aria-label={`${hearts} out of ${maxHearts} hearts remaining`}
    >
      <Heart className="w-5 h-5 fill-[#ff4b4b] transition-transform group-hover:scale-110" />
      <span>{hearts}</span>
      {!isFull && (
        <span
          className="ml-1 px-1.5 py-0.5 text-xs bg-[#ff4b4b] text-white rounded-full flex items-center gap-0.5 animate-bounce"
          title="Refill Hearts"
        >
          <Plus className="w-3 h-3" />
        </span>
      )}
    </div>
  );
};
