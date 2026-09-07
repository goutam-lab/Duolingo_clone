"use client";

import React from "react";
import { ExercisePublic } from "@/types/api";

interface MultipleChoiceExerciseProps {
  exercise: ExercisePublic;
  selectedAnswer: string | null;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  exercise,
  selectedAnswer,
  onAnswerChange,
  disabled,
}) => {
  const options: string[] = exercise.question_data?.options || [];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Exercise Prompt */}
      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-left">
        {exercise.prompt}
      </h2>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onAnswerChange(option)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 select-none ${
                isSelected
                  ? "bg-[#1cb0f6]/15 border-[#1cb0f6] text-white shadow-[0_0_12px_rgba(28,176,246,0.3)]"
                  : "bg-[#1a2c35] border-[#2b3d48] text-slate-200 hover:border-slate-500 hover:bg-[#203642]"
              } ${
                disabled ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
              }`}
            >
              {/* Keyboard Index Badge */}
              <span
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border ${
                  isSelected
                    ? "bg-[#1cb0f6] border-[#1899d6] text-white"
                    : "bg-[#131f24] border-[#2b3d48] text-slate-400"
                }`}
              >
                {idx + 1}
              </span>

              {/* Option Text */}
              <span className="text-base font-bold leading-snug">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
