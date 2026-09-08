"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { LessonDetailResponse, LessonCompleteResponse } from "@/types/api";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { QuitModal } from "@/components/lesson/QuitModal";
import { OutOfHeartsModal } from "@/components/lesson/OutOfHeartsModal";
import { FeedbackDrawer } from "@/components/lesson/FeedbackDrawer";
import { ExerciseRenderer } from "@/components/lesson/ExerciseRenderer";
import { LessonComplete } from "@/components/lesson/LessonComplete";
import { soundEffects } from "@/lib/sound";
import { getMotivationalCorrectMessage } from "@/lib/motivation";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const lessonIdStr = params?.lessonId as string;
  const lessonId = parseInt(lessonIdStr, 10);

  // Core Lesson State
  const [lesson, setLesson] = useState<LessonDetailResponse | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [hearts, setHearts] = useState(5);

  // Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [correctAnswerRevealed, setCorrectAnswerRevealed] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Modals & UI States
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<LessonCompleteResponse | null>(null);

  // 1. Initial Load: Fetch Lesson and Start Authoritative Attempt
  useEffect(() => {
    if (isNaN(lessonId)) {
      setErrorMessage("Invalid lesson ID.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function initializeLesson() {
      setIsLoading(true);
      setErrorMessage(null);
      setIsLocked(false);

      try {
        // Step 1: Fetch lesson definition (without answers)
        const lessonData = await apiClient.getLesson(lessonId);
        if (!isMounted) return;
        setLesson(lessonData);

        // Step 2: Start server attempt
        const attemptData = await apiClient.startLessonAttempt(lessonId);
        if (!isMounted) return;
        setAttemptId(attemptData.attempt_id);
        setHearts(attemptData.hearts_remaining);

        // Check if starting with 0 hearts
        if (attemptData.hearts_remaining <= 0) {
          setShowOutOfHeartsModal(true);
        }
      } catch (err: any) {
        if (!isMounted) return;
        if (err?.status === 401) {
          router.push("/login");
          return;
        }
        if (err?.status === 403 || err?.message?.toLowerCase().includes("locked")) {
          setIsLocked(true);
        } else if (err?.message?.includes("0 hearts")) {
          setShowOutOfHeartsModal(true);
        } else {
          setErrorMessage(err?.message || "Failed to load lesson. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeLesson();

    return () => {
      isMounted = false;
    };
  }, [lessonId, router]);

  // Current exercise object
  const exercises = lesson?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;

  // Evaluate if user is allowed to click "Check"
  const getCanCheck = () => {
    if (!currentExercise || isSubmitted || isChecking) return false;

    switch (currentExercise.type) {
      case "multiple_choice":
        return typeof selectedAnswer === "string" && selectedAnswer.length > 0;

      case "translate":
      case "fill_blank":
      case "type_answer":
        return (
          typeof selectedAnswer === "string" && selectedAnswer.trim().length > 0
        );

      case "word_bank":
        return Array.isArray(selectedAnswer) && selectedAnswer.length > 0;

      case "match_pairs": {
        const requiredCount =
          currentExercise.question_data?.left?.length ||
          currentExercise.question_data?.pairs?.length ||
          4;
        return (
          Array.isArray(selectedAnswer) &&
          selectedAnswer.length >= requiredCount
        );
      }

      default:
        return Boolean(selectedAnswer);
    }
  };

  // 2. Submit Answer to Backend Authority
  const handleCheck = async () => {
    if (!currentExercise || !attemptId || !getCanCheck() || isChecking) return;

    setIsChecking(true);
    try {
      const result = await apiClient.submitExerciseAnswer(lessonId, attemptId, {
        exercise_id: currentExercise.id,
        answer: selectedAnswer,
      });

      setIsSubmitted(true);
      setIsCorrect(result.is_correct);

      if (result.is_correct) {
        soundEffects.playCorrect();
        const motivational = getMotivationalCorrectMessage();
        setFeedbackText(motivational);
      } else {
        soundEffects.playIncorrect();
        setFeedbackText(result.feedback || "Not quite.");
      }

      setHearts(result.hearts_remaining);

      if (result.correct_answer) {
        if (Array.isArray(result.correct_answer)) {
          if (Array.isArray(result.correct_answer[0])) {
            // Pairs format: [["Hello", "Namaste"], ...]
            setCorrectAnswerRevealed(
              result.correct_answer.map((p) => p.join(" ↔ ")).join(", ")
            );
          } else {
            // List of words
            setCorrectAnswerRevealed(result.correct_answer.join(" "));
          }
        } else {
          setCorrectAnswerRevealed(String(result.correct_answer));
        }
      } else {
        setCorrectAnswerRevealed(null);
      }

      // Check if hearts dropped to 0
      if (result.hearts_remaining <= 0) {
        setTimeout(() => {
          setShowOutOfHeartsModal(true);
        }, 600);
      }
    } catch (err: any) {
      alert(err?.message || "Error submitting answer. Please retry.");
    } finally {
      setIsChecking(false);
    }
  };

  // 3. Continue to Next Exercise or Complete Lesson
  const handleContinue = async () => {
    if (!isSubmitted) return;

    soundEffects.playClick();
    const isLastExercise = currentExerciseIndex >= totalExercises - 1;

    if (!isLastExercise) {
      // Advance to next exercise
      setCurrentExerciseIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setIsCorrect(null);
      setFeedbackText("");
      setCorrectAnswerRevealed(null);
    } else {
      // Complete the lesson
      if (!attemptId) return;
      setIsChecking(true);
      try {
        const completeResult = await apiClient.completeLesson(lessonId, attemptId);
        soundEffects.playComplete();
        setCompletionData(completeResult);
        setIsCompleted(true);
      } catch (err: any) {
        alert(err?.message || "Failed to finalize lesson. Please try again.");
      } finally {
        setIsChecking(false);
      }
    }
  };

  // Keyboard shortcut: Enter key triggers Check or Continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (!isSubmitted && getCanCheck()) {
          e.preventDefault();
          handleCheck();
        } else if (isSubmitted) {
          e.preventDefault();
          handleContinue();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitted, selectedAnswer, currentExerciseIndex, attemptId, isChecking]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-[#58cc02] animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Loading lesson exercises...
        </p>
      </div>
    );
  }

  // Locked Lesson State
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#1a2c35] border-2 border-[#2b3d48] space-y-5">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#ff9600]/20 border border-[#ff9600]/40 flex items-center justify-center text-[#ff9600]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              Lesson Locked
            </h2>
            <p className="text-sm text-slate-400">
              This lesson is currently locked. Complete the earlier lessons along the path to unlock it!
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] border-b-[4px] border-[#46a302] hover:bg-[#61db02] active:translate-y-1 active:border-b-[1px] text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Learning Path</span>
          </button>
        </div>
      </div>
    );
  }

  // Error State
  if (errorMessage || !lesson) {
    return (
      <div className="min-h-screen bg-[#131f24] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#1a2c35] border-2 border-[#2b3d48] space-y-5">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#ff4b4b]/20 border border-[#ff4b4b]/40 flex items-center justify-center text-[#ff4b4b]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              Unable to Load Lesson
            </h2>
            <p className="text-sm text-slate-400">
              {errorMessage || "Lesson details could not be found."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#2b3d48] hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Return to Learning Path
          </button>
        </div>
      </div>
    );
  }

  // Completed State
  if (isCompleted && completionData) {
    return (
      <div className="min-h-screen bg-[#131f24] flex items-center justify-center">
        <LessonComplete data={completionData} />
      </div>
    );
  }

  // Active Lesson Interaction View
  return (
    <div className="min-h-screen bg-[#131f24] flex flex-col justify-between text-white select-none">
      {/* Top Header Bar */}
      <LessonHeader
        currentExerciseIndex={currentExerciseIndex}
        totalExercises={totalExercises}
        hearts={hearts}
        onQuitClick={() => setShowQuitModal(true)}
      />

      {/* Main Exercise Question Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 w-full max-w-4xl mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          {currentExercise ? (
            <motion.div
              key={currentExercise.id}
              className="w-full"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: 28, scale: 0.98 }
              }
              animate={
                isSubmitted && isCorrect === false && !shouldReduceMotion
                  ? { opacity: 1, x: [0, -8, 8, -5, 5, 0], scale: 1 }
                  : { opacity: 1, x: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -24, scale: 0.98 }
              }
              transition={
                isSubmitted && isCorrect === false && !shouldReduceMotion
                  ? { duration: 0.42 }
                  : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <ExerciseRenderer
                exercise={currentExercise}
                selectedAnswer={selectedAnswer}
                onAnswerChange={(ans) => setSelectedAnswer(ans)}
                disabled={isSubmitted || isChecking}
              />
            </motion.div>
          ) : (
            <div className="text-center text-slate-400">
              No exercises available in this lesson.
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Action / Feedback Drawer */}
      <FeedbackDrawer
        isSubmitted={isSubmitted}
        isCorrect={isCorrect}
        feedbackText={feedbackText}
        correctAnswerRevealed={correctAnswerRevealed}
        canCheck={getCanCheck()}
        isChecking={isChecking}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />

      {/* Quit Confirmation Modal */}
      <QuitModal
        isOpen={showQuitModal}
        onStay={() => setShowQuitModal(false)}
        onQuit={() => router.push("/")}
      />

      {/* Out of Hearts Modal */}
      <OutOfHeartsModal
        isOpen={showOutOfHeartsModal}
        onRefilled={(refilledCount) => {
          setHearts(refilledCount);
          setShowOutOfHeartsModal(false);
        }}
        onQuit={() => router.push("/")}
      />
    </div>
  );
}
