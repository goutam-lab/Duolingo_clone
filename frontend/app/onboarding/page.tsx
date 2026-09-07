"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { CourseSummary } from "@/types/api";
import { Check, ArrowRight, ArrowLeft, Globe, Zap, Compass, Sparkles, Loader2, AlertCircle } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User selections
  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [dailyGoalXp, setDailyGoalXp] = useState<number>(20);
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  useEffect(() => {
    // Fetch available courses
    const loadCourses = async () => {
      try {
        const list = await apiClient.getCourses();
        if (list && list.length > 0) {
          setCourses(list);
          setSelectedCourseId(list[0].id);
        }
      } catch {
        // Fallback demo course if API not ready
        setCourses([
          {
            id: 1,
            code: "en-hi",
            title: "English to Hindi",
            source_language: "English",
            target_language: "Hindi",
          },
        ]);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Final submission
      setSubmitting(true);
      setError(null);
      try {
        await apiClient.completeOnboarding({
          course_id: selectedCourseId,
          daily_goal_xp: dailyGoalXp,
          experience_level: experienceLevel,
        });

        router.push("/");
      } catch (err: any) {
        setError(err?.message || "Failed to complete onboarding. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const goalOptions = [
    { xp: 10, label: "Casual", time: "3 mins / day", badge: "Easy pace" },
    { xp: 20, label: "Regular", time: "5 mins / day", badge: "Recommended" },
    { xp: 30, label: "Serious", time: "10 mins / day", badge: "Dedicated" },
    { xp: 50, label: "Intense", time: "15 mins / day", badge: "Rapid progress" },
  ];

  const experienceOptions = [
    {
      level: "beginner" as const,
      title: "New to this language",
      desc: "Start from scratch with the alphabet, pronunciation, and basic greetings.",
      icon: "🌱",
    },
    {
      level: "intermediate" as const,
      title: "I know some basics",
      desc: "I can hold simple conversations and understand essential phrases.",
      icon: "🌿",
    },
    {
      level: "advanced" as const,
      title: "Comfortable speaker",
      desc: "I want to refine my grammar, master complex idioms, and practice daily.",
      icon: "🌳",
    },
  ];

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Header & Progress */}
      <header className="max-w-4xl w-full mx-auto px-4 py-6 flex items-center gap-4">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="p-2 text-duo-gray-400 hover:text-duo-gray-600 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        <div className="flex-1 bg-duo-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-duo-green h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-xs font-black text-duo-gray-400 uppercase tracking-widest">
          {step} of 3
        </span>
      </header>

      {/* Main Form Content */}
      <main className="max-w-xl w-full mx-auto px-4 py-6 flex-1 flex flex-col justify-center">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 text-red-600 text-sm font-bold animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Select Course */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🌍</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-duo-gray-800">
                What do you want to learn?
              </h1>
            </div>
            <p className="text-sm font-bold text-duo-gray-400 mb-6">
              Choose your target language course to begin your journey.
            </p>

            {loadingCourses ? (
              <div className="py-12 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-duo-green animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((c) => {
                  const isSelected = selectedCourseId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCourseId(c.id)}
                      className={`w-full p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-duo-green bg-duo-green/5 shadow-[0_4px_0_#58cc02]"
                          : "border-duo-gray-200 hover:border-duo-gray-300 hover:bg-duo-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-duo-gray-100 rounded-xl flex items-center justify-center text-2xl">
                          🇮🇳
                        </div>
                        <div>
                          <div className="font-extrabold text-lg text-duo-gray-800">
                            {c.title}
                          </div>
                          <div className="text-xs font-bold text-duo-gray-400">
                            {c.target_language} • Complete beginners & advanced
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-duo-green bg-duo-green text-white"
                            : "border-duo-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Pick Daily Goal */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⚡</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-duo-gray-800">
                Pick a daily goal
              </h1>
            </div>
            <p className="text-sm font-bold text-duo-gray-400 mb-6">
              You can always adjust this later in your settings.
            </p>

            <div className="space-y-3">
              {goalOptions.map((opt) => {
                const isSelected = dailyGoalXp === opt.xp;
                return (
                  <button
                    key={opt.xp}
                    type="button"
                    onClick={() => setDailyGoalXp(opt.xp)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-duo-green bg-duo-green/5 shadow-[0_4px_0_#58cc02]"
                        : "border-duo-gray-200 hover:border-duo-gray-300 hover:bg-duo-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-duo-yellow/20 text-duo-yellow flex items-center justify-center font-black text-base">
                        {opt.xp}
                      </div>
                      <div>
                        <div className="font-extrabold text-base text-duo-gray-800 flex items-center gap-2">
                          {opt.label}
                          {opt.badge === "Recommended" && (
                            <span className="px-2 py-0.5 bg-duo-green/15 text-duo-green rounded-full text-[10px] font-black uppercase tracking-wider">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-duo-gray-400">
                          {opt.time} • {opt.xp} XP per day
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-duo-green bg-duo-green text-white"
                          : "border-duo-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Experience Level */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-duo-gray-800">
                What is your experience level?
              </h1>
            </div>
            <p className="text-sm font-bold text-duo-gray-400 mb-6">
              This helps us personalize your journey from day one.
            </p>

            <div className="space-y-3">
              {experienceOptions.map((opt) => {
                const isSelected = experienceLevel === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setExperienceLevel(opt.level)}
                    className={`w-full p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-duo-green bg-duo-green/5 shadow-[0_4px_0_#58cc02]"
                        : "border-duo-gray-200 hover:border-duo-gray-300 hover:bg-duo-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl mt-0.5">{opt.icon}</span>
                      <div>
                        <div className="font-extrabold text-base text-duo-gray-800">
                          {opt.title}
                        </div>
                        <div className="text-xs font-bold text-duo-gray-400 mt-0.5">
                          {opt.desc}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ml-3 flex items-center justify-center ${
                        isSelected
                          ? "border-duo-green bg-duo-green text-white"
                          : "border-duo-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="border-t-2 border-duo-gray-200 bg-white py-4 px-4">
        <div className="max-w-xl w-full mx-auto">
          <button
            id="onboarding-continue-btn"
            type="button"
            disabled={submitting || loadingCourses}
            onClick={handleNext}
            className="w-full py-4 bg-duo-green hover:bg-[#52be02] text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_4px_0_#46a302] hover:shadow-[0_2px_0_#46a302] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {step === 3 ? "START LEARNING" : "CONTINUE"}
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
