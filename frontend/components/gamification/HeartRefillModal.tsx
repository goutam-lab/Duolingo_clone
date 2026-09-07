"use client";

import React, { useState, useEffect } from "react";
import { Heart, X, Sparkles, Check, AlertCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface HeartRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearts: number;
  maxHearts: number;
  onHeartsRefilled?: (newHearts: number) => void;
}

export const HeartRefillModal: React.FC<HeartRefillModalProps> = ({
  isOpen,
  onClose,
  hearts,
  maxHearts,
  onHeartsRefilled,
}) => {
  const [isRefilling, setIsRefilling] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFull = hearts >= maxHearts;

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Clear messages on modal open/close
  useEffect(() => {
    if (isOpen) {
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefill = async () => {
    if (isFull || isRefilling) return;
    setIsRefilling(true);
    setErrorMessage(null);

    try {
      const res = await apiClient.refillHearts();
      setSuccessMessage(res.message || "Hearts fully restored!");
      if (onHeartsRefilled) {
        onHeartsRefilled(res.hearts);
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Failed to refill hearts. Please try again."
      );
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="refill-modal-title"
    >
      <div
        className="w-full max-w-md bg-[#1a2c35] border-2 border-[#2b3d48] rounded-3xl p-6 sm:p-8 text-center text-white relative shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#243843] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Visual */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-[#ff4b4b]/15 border-2 border-[#ff4b4b]/30 flex items-center justify-center mb-3">
            <Heart className="w-12 h-12 fill-[#ff4b4b] text-[#ff4b4b] animate-pulse" />
          </div>
          <h2
            id="refill-modal-title"
            className="text-2xl font-black text-white tracking-tight"
          >
            {isFull ? "Full Health!" : "Need More Hearts?"}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
            Hearts keep your practice going. Each mistake in a lesson costs 1
            heart.
          </p>
        </div>

        {/* 5 Heart Icons Visual Row */}
        <div className="flex items-center justify-center gap-3 py-2">
          {Array.from({ length: maxHearts }).map((_, i) => {
            const isFilled = i < hearts;
            return (
              <div
                key={i}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isFilled
                    ? "bg-[#ff4b4b]/20 border-2 border-[#ff4b4b] shadow-sm shadow-[#ff4b4b]/30"
                    : "bg-[#131f24] border-2 border-[#2b3d48] opacity-50"
                }`}
                title={isFilled ? "Full Heart" : "Empty Heart"}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFilled
                      ? "fill-[#ff4b4b] text-[#ff4b4b]"
                      : "text-slate-600"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Success / Error Feedback */}
        {successMessage && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#58cc02]/15 border border-[#58cc02] text-[#58cc02] text-sm font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#ff4b4b]/15 border border-[#ff4b4b] text-[#ff4b4b] text-sm font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3 pt-2">
          {isFull ? (
            <button
              type="button"
              disabled
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#243946] text-slate-400 border-2 border-[#374c5a] cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#58cc02]" />
              <span>Hearts Are Full ({hearts}/{maxHearts})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRefill}
              disabled={isRefilling}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] hover:bg-[#61db02] active:translate-y-1 text-white border-b-[4px] border-[#46a302] active:border-b-[1px] shadow-lg shadow-[#58cc02]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isRefilling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Refilling Hearts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Refill Hearts for Free</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Back to Learning
          </button>
        </div>
      </div>
    </div>
  );
};
