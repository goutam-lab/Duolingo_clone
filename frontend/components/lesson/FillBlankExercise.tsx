"use client";

import React from "react";
import { Edit3 } from "lucide-react";
import { ExercisePublic } from "@/types/api";

interface FillBlankExerciseProps {
  exercise: ExercisePublic;
  selectedAnswer: string;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
}

export const FillBlankExercise: React.FC<FillBlankExerciseProps> = ({
  exercise,
  selectedAnswer,
  onAnswerChange,
  disabled,
}) => {
  const prefix = exercise.question_data?.prefix || "";
  const suffix = exercise.question_data?.suffix || "";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Exercise Prompt Title */}
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ff9600]">
        <Edit3 className="w-4 h-4" />
        <span>Fill in the Blank</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-left">
        {exercise.prompt}
      </h2>

      {/* Sentence with Inline Input */}
      <div className="p-6 rounded-3xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-wrap items-center gap-2 text-xl sm:text-2xl font-bold text-white shadow-sm">
        {prefix && <span>{prefix}</span>}

        <input
          type="text"
          value={selectedAnswer || ""}
          disabled={disabled}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="___"
          className="min-w-[140px] max-w-[220px] px-3 py-1.5 rounded-xl bg-[#131f24] border-2 border-b-[4px] border-[#1cb0f6] text-[#1cb0f6] placeholder:text-slate-500 font-extrabold text-xl sm:text-2xl text-center focus:outline-none focus:border-[#58cc02] transition-all disabled:opacity-70"
          autoFocus
        />

        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
};
