"use client";

import React, { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { HeartRefillModal } from "./HeartRefillModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFull = hearts >= maxHearts;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm tracking-wide text-[#ff4b4b] hover:bg-[#ff4b4b]/10 transition-colors cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#ff4b4b]/50"
        title={isFull ? `${hearts} Hearts (Full)` : `Click to view or refill hearts (${hearts}/${maxHearts})`}
        role="status"
        aria-label={`${hearts} out of ${maxHearts} hearts remaining. Click to view refill options.`}
      >
        <Heart className="w-5 h-5 fill-[#ff4b4b] transition-transform group-hover:scale-110" />
        <span>{hearts}</span>
        {!isFull && (
          <span
            className="ml-1 px-1.5 py-0.5 text-xs bg-[#ff4b4b] text-white rounded-full flex items-center gap-0.5 animate-bounce shadow-xs"
            title="Refill Hearts"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
          </span>
        )}
      </button>

      <HeartRefillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hearts={hearts}
        maxHearts={maxHearts}
        onHeartsRefilled={onHeartsRefilled}
      />
    </>
  );
};
