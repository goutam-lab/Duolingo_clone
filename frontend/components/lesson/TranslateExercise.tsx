"use client";

import React from "react";
import { Languages } from "lucide-react";
import { ExercisePublic } from "@/types/api";
import { AudioSpeakerButton } from "@/components/lesson/AudioSpeakerButton";

interface TranslateExerciseProps {
  exercise: ExercisePublic;
  selectedAnswer: string;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
}

export const TranslateExercise: React.FC<TranslateExerciseProps> = ({
  exercise,
  selectedAnswer,
  onAnswerChange,
  disabled,
}) => {
  // Extract source text or quoted string from prompt if source_text is not provided
  let sourceText = exercise.question_data?.source_text;
  if (!sourceText) {
    const quotedMatch = exercise.prompt.match(/['"‘“]([^'"’”]+)['"’”]/);
    sourceText = quotedMatch ? quotedMatch[1] : exercise.prompt;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Exercise Prompt Title */}
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1cb0f6]">
        <Languages className="w-4 h-4" />
        <span>Translate Sentence</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-left">
        {exercise.prompt}
      </h2>

      {/* Source Text Speech Bubble */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] shadow-sm">
        <AudioSpeakerButton text={sourceText} size="md" />

        <div className="text-lg sm:text-xl font-bold text-white">
          {sourceText}
        </div>
      </div>

      {/* Answer Input Area */}
      <div className="pt-2">
        <textarea
          rows={3}
          value={selectedAnswer || ""}
          disabled={disabled}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type your translation here..."
          className="w-full p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] text-white placeholder:text-slate-500 font-medium text-base sm:text-lg focus:outline-none focus:border-[#1cb0f6] focus:ring-2 focus:ring-[#1cb0f6]/20 transition-all resize-none disabled:opacity-70"
          autoFocus
        />
      </div>
    </div>
  );
};
