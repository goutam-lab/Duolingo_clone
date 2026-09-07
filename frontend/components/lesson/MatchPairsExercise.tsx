"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeftRight, Check } from "lucide-react";
import { ExercisePublic } from "@/types/api";

interface MatchPairsExerciseProps {
  exercise: ExercisePublic;
  selectedAnswer: [string, string][];
  onAnswerChange: (pairs: [string, string][]) => void;
  disabled: boolean;
}

export const MatchPairsExercise: React.FC<MatchPairsExerciseProps> = ({
  exercise,
  selectedAnswer = [],
  onAnswerChange,
  disabled,
}) => {
  const leftItems: string[] = exercise.question_data?.left || [];
  const rightItems: string[] = exercise.question_data?.right || [];

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const currentPairs: [string, string][] = Array.isArray(selectedAnswer)
    ? selectedAnswer
    : [];

  const isLeftMatched = (item: string) =>
    currentPairs.some(([l]) => l === item);
  const isRightMatched = (item: string) =>
    currentPairs.some(([, r]) => r === item);

  const handleLeftClick = (item: string) => {
    if (disabled) return;
    if (isLeftMatched(item)) {
      // Unpair if already matched
      const updated = currentPairs.filter(([l]) => l !== item);
      onAnswerChange(updated);
      setSelectedLeft(null);
      return;
    }

    if (selectedLeft === item) {
      setSelectedLeft(null);
      return;
    }

    setSelectedLeft(item);

    // If right item is already selected, pair them
    if (selectedRight) {
      const updated = [...currentPairs, [item, selectedRight] as [string, string]];
      onAnswerChange(updated);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const handleRightClick = (item: string) => {
    if (disabled) return;
    if (isRightMatched(item)) {
      // Unpair if already matched
      const updated = currentPairs.filter(([, r]) => r !== item);
      onAnswerChange(updated);
      setSelectedRight(null);
      return;
    }

    if (selectedRight === item) {
      setSelectedRight(null);
      return;
    }

    setSelectedRight(item);

    // If left item is already selected, pair them
    if (selectedLeft) {
      const updated = [...currentPairs, [selectedLeft, item] as [string, string]];
      onAnswerChange(updated);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Exercise Prompt Title */}
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ce82ff]">
        <ArrowLeftRight className="w-4 h-4" />
        <span>Tap the Matching Pairs</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-left">
        {exercise.prompt}
      </h2>

      {/* Matching Columns Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2 select-none">
        {/* Left Column */}
        <div className="space-y-3">
          {leftItems.map((item, idx) => {
            const matched = isLeftMatched(item);
            const isSelected = selectedLeft === item;

            return (
              <button
                key={`left-${idx}-${item}`}
                type="button"
                disabled={disabled}
                onClick={() => handleLeftClick(item)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base sm:text-lg transition-all flex items-center justify-between ${
                  matched
                    ? "bg-[#58cc02]/15 border-[#58cc02] text-white shadow-[0_0_10px_rgba(88,204,2,0.25)]"
                    : isSelected
                    ? "bg-[#1cb0f6]/20 border-[#1cb0f6] text-white shadow-[0_0_12px_rgba(28,176,246,0.3)]"
                    : "bg-[#1a2c35] border-[#2b3d48] text-slate-200 hover:border-slate-500 hover:bg-[#203642]"
                } ${disabled ? "cursor-default" : "cursor-pointer active:scale-[0.98]"}`}
              >
                <span>{item}</span>
                {matched && <Check className="w-5 h-5 text-[#58cc02] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightItems.map((item, idx) => {
            const matched = isRightMatched(item);
            const isSelected = selectedRight === item;

            return (
              <button
                key={`right-${idx}-${item}`}
                type="button"
                disabled={disabled}
                onClick={() => handleRightClick(item)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base sm:text-lg transition-all flex items-center justify-between ${
                  matched
                    ? "bg-[#58cc02]/15 border-[#58cc02] text-white shadow-[0_0_10px_rgba(88,204,2,0.25)]"
                    : isSelected
                    ? "bg-[#1cb0f6]/20 border-[#1cb0f6] text-white shadow-[0_0_12px_rgba(28,176,246,0.3)]"
                    : "bg-[#1a2c35] border-[#2b3d48] text-slate-200 hover:border-slate-500 hover:bg-[#203642]"
                } ${disabled ? "cursor-default" : "cursor-pointer active:scale-[0.98]"}`}
              >
                <span>{item}</span>
                {matched && <Check className="w-5 h-5 text-[#58cc02] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
