"use client";

import React from "react";
import { ExercisePublic } from "@/types/api";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise";
import { TranslateExercise } from "./TranslateExercise";
import { WordBankExercise } from "./WordBankExercise";
import { MatchPairsExercise } from "./MatchPairsExercise";
import { FillBlankExercise } from "./FillBlankExercise";
import { TypeAnswerExercise } from "./TypeAnswerExercise";

interface ExerciseRendererProps {
  exercise: ExercisePublic;
  selectedAnswer: any;
  onAnswerChange: (answer: any) => void;
  disabled: boolean;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  selectedAnswer,
  onAnswerChange,
  disabled,
}) => {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoiceExercise
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "translate":
      return (
        <TranslateExercise
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "word_bank":
      return (
        <WordBankExercise
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "match_pairs":
      return (
        <MatchPairsExercise
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "fill_blank":
      return (
        <FillBlankExercise
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "type_answer":
      return (
        <TypeAnswerExercise
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onAnswerChange={onAnswerChange}
          disabled={disabled}
        />
      );

    default:
      return (
        <div className="p-8 text-center text-slate-400">
          Unsupported exercise type: {exercise.type}
        </div>
      );
  }
};
