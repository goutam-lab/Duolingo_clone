"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { ExercisePublic } from "@/types/api";

interface WordBankExerciseProps {
  exercise: ExercisePublic;
  selectedAnswer: string[];
  onAnswerChange: (answer: string[]) => void;
  disabled: boolean;
}

export const WordBankExercise: React.FC<WordBankExerciseProps> = ({
  exercise,
  selectedAnswer = [],
  onAnswerChange,
  disabled,
}) => {
  const words: string[] = exercise.question_data?.words || [];

  // Count occurrences of each word in the source bank
  // and handle duplicate words by tracking indexes
  const placedWords = Array.isArray(selectedAnswer) ? selectedAnswer : [];

  const handleAddWord = (word: string, index: number) => {
    if (disabled) return;
    onAnswerChange([...placedWords, word]);
  };

  const handleRemoveWord = (indexToRemove: number) => {
    if (disabled) return;
    const updated = placedWords.filter((_, idx) => idx !== indexToRemove);
    onAnswerChange(updated);
  };

  // Determine which bank tiles have already been placed
  // Track by word counting to handle duplicate tokens correctly
  const placedCounts: Record<string, number> = {};
  for (const w of placedWords) {
    placedCounts[w] = (placedCounts[w] || 0) + 1;
  }

  const bankTileUsed: boolean[] = [];
  const currentCounts: Record<string, number> = {};
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const usedCount = currentCounts[w] || 0;
    const neededCount = placedCounts[w] || 0;
    if (usedCount < neededCount) {
      bankTileUsed.push(true);
      currentCounts[w] = usedCount + 1;
    } else {
      bankTileUsed.push(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Exercise Prompt Title */}
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ffc800]">
        <LayoutGrid className="w-4 h-4" />
        <span>Build the Sentence</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-left">
        {exercise.prompt}
      </h2>

      {/* Answer Slots Area */}
      <div className="min-h-[90px] p-3.5 rounded-2xl bg-[#131f24] border-2 border-dashed border-[#2b3d48] flex flex-wrap gap-2.5 items-center transition-colors">
        {placedWords.length === 0 ? (
          <span className="text-sm font-semibold text-slate-500 italic px-2">
            Tap the word tiles below to construct your answer
          </span>
        ) : (
          placedWords.map((word, idx) => (
            <button
              key={`placed-${idx}-${word}`}
              type="button"
              disabled={disabled}
              onClick={() => handleRemoveWord(idx)}
              className="py-2.5 px-4 rounded-xl bg-[#1a2c35] border-2 border-b-[3px] border-[#2b3d48] text-white font-bold text-base hover:border-[#ff4b4b] hover:text-[#ff4b4b] active:translate-y-0.5 transition-all cursor-pointer shadow-sm select-none"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Available Word Bank */}
      <div className="pt-4 border-t border-[#2b3d48] flex flex-wrap gap-2.5 justify-center">
        {words.map((word, idx) => {
          const isUsed = bankTileUsed[idx];

          if (isUsed) {
            return (
              <div
                key={`bank-${idx}-${word}`}
                className="py-2.5 px-4 rounded-xl bg-[#202e35]/30 border-2 border-dashed border-[#2b3d48]/40 text-transparent select-none pointer-events-none"
              >
                {word}
              </div>
            );
          }

          return (
            <button
              key={`bank-${idx}-${word}`}
              type="button"
              disabled={disabled}
              onClick={() => handleAddWord(word, idx)}
              className="py-2.5 px-4 rounded-xl bg-[#1a2c35] border-2 border-b-[4px] border-[#2b3d48] hover:border-slate-500 hover:bg-[#203642] active:translate-y-1 active:border-b-[1px] text-white font-bold text-base transition-all cursor-pointer shadow-sm select-none"
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
