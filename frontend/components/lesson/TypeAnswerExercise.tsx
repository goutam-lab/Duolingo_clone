"use client";

import React from "react";
import { Keyboard } from "lucide-react";
import { ExercisePublic } from "@/types/api";
import { AudioSpeakerButton } from "@/components/lesson/AudioSpeakerButton";

interface TypeAnswerExerciseProps {
  exercise: ExercisePublic;
  selectedAnswer: string;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
}

export const TypeAnswerExercise: React.FC<TypeAnswerExerciseProps> = ({
  exercise,
  selectedAnswer,
  onAnswerChange,
  disabled,
}) => {
  const speechTarget =
    exercise.question_data?.source_text ||
    exercise.prompt.replace(/^Type the answer for:?\s*|^Translate:?\s*/i, "");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Exercise Prompt Title */}
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1cb0f6]">
        <Keyboard className="w-4 h-4" />
        <span>Type the Answer</span>
      </div>

      <div className="flex items-start gap-4">
        <AudioSpeakerButton text={speechTarget} size="md" className="mt-1 shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-left">
          {exercise.prompt}
        </h2>
      </div>

      {/* Answer Input Field */}
      <div className="pt-2">
        <input
          type="text"
          value={selectedAnswer || ""}
          disabled={disabled}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type in English..."
          className="w-full p-4 rounded-2xl bg-[#1a2c35] border-2 border-b-[4px] border-[#2b3d48] text-white placeholder:text-slate-500 font-bold text-lg sm:text-xl focus:outline-none focus:border-[#1cb0f6] focus:border-b-[4px] focus:ring-2 focus:ring-[#1cb0f6]/20 transition-all disabled:opacity-70"
          autoFocus
        />
      </div>
    </div>
  );
};
