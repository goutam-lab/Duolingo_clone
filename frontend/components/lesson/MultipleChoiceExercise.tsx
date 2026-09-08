"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExercisePublic } from "@/types/api";
import { AudioSpeakerButton } from "@/components/lesson/AudioSpeakerButton";

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
  const shouldReduceMotion = useReducedMotion();
  const options: string[] = exercise.question_data?.options || [];

  // Extract speech target
  const speechText =
    exercise.question_data?.source_text ||
    exercise.prompt.replace(/^Select the correct answer for:?\s*/i, "");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <AudioSpeakerButton text={speechText} size="md" className="mt-1 shrink-0" />
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-left">
          {exercise.prompt}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;

          return (
            <motion.button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onAnswerChange(option)}
              whileHover={
                shouldReduceMotion || disabled ? undefined : { y: -2 }
              }
              whileTap={
                shouldReduceMotion || disabled ? undefined : { scale: 0.98, y: 2 }
              }
              className={`w-full p-4 rounded-2xl border-2 border-b-4 text-left flex items-center gap-3.5 select-none ${
                isSelected
                  ? "bg-[#1cb0f6]/15 border-[#1cb0f6] text-white"
                  : "bg-[#1a2c35] border-[#37464f] text-slate-200 hover:border-slate-500"
              } ${disabled ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border ${
                  isSelected
                    ? "bg-[#1cb0f6] border-[#1899d6] text-white"
                    : "bg-[#131f24] border-[#37464f] text-slate-400"
                }`}
              >
                {idx + 1}
              </span>
              <span className="text-base font-bold leading-snug">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
