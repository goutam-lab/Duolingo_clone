"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Target, Flame, Trophy, Award, CheckCircle2 } from "lucide-react";
import { LessonCompleteResponse } from "@/types/api";

interface LessonCompleteProps {
  data: LessonCompleteResponse;
}

export const LessonComplete: React.FC<LessonCompleteProps> = ({ data }) => {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/");
    router.refresh();
  };

  const dailyGoalPct = Math.min(
    100,
    Math.round(
      ((data.daily_goal.progress || 0) / (data.daily_goal.goal || 20)) * 100
    )
  );

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center space-y-8 select-none animate-in fade-in duration-300">
      {/* Trophy & Mascot Celebration */}
      <div className="relative">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#ffc800]/20 border-2 border-[#ffc800]/40 flex items-center justify-center text-[#ffc800] shadow-[0_0_30px_rgba(255,200,0,0.3)] animate-bounce">
          <Trophy className="w-14 h-14 sm:w-16 sm:h-16 stroke-[2.2]" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#58cc02] text-white flex items-center justify-center shadow-lg border-2 border-[#131f24]">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Lesson Complete!
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-medium">
          You're making steady progress in your language learning journey.
        </p>
      </div>

      {/* Rewards Grid */}
      <div className="w-full grid grid-cols-3 gap-3">
        {/* Total XP Card */}
        <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col items-center justify-center text-center space-y-1 shadow-sm">
          <div className="text-xs font-black uppercase tracking-wider text-[#ffc800] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>XP Earned</span>
          </div>
          <div className="text-2xl font-black text-white">
            +{data.xp_earned}
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col items-center justify-center text-center space-y-1 shadow-sm">
          <div className="text-xs font-black uppercase tracking-wider text-[#58cc02] flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </div>
          <div className="text-2xl font-black text-white">
            {data.score}%
          </div>
        </div>

        {/* Streak Card */}
        <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col items-center justify-center text-center space-y-1 shadow-sm">
          <div className="text-xs font-black uppercase tracking-wider text-[#ff9600] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Streak</span>
          </div>
          <div className="text-2xl font-black text-white">
            {data.streak.current} {data.streak.current === 1 ? "day" : "days"}
          </div>
        </div>
      </div>

      {/* Daily Goal Card */}
      <div className="w-full p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] space-y-2 text-left">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
          <span>Daily Goal</span>
          <span className="text-white font-bold">
            {data.daily_goal.progress} / {data.daily_goal.goal} XP
          </span>
        </div>

        <div className="w-full bg-[#131f24] h-3 rounded-full overflow-hidden p-0.5 border border-[#2b3d48]">
          <div
            className="bg-[#58cc02] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${dailyGoalPct}%` }}
          />
        </div>

        {data.daily_goal.completed && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#58cc02] pt-0.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Daily goal reached! Keep it up!</span>
          </div>
        )}
      </div>

      {/* New Achievements Badge (if any) */}
      {data.new_achievements && data.new_achievements.length > 0 && (
        <div className="w-full p-4 rounded-2xl bg-[#ce82ff]/10 border-2 border-[#ce82ff]/30 flex items-center gap-3 text-left">
          <Award className="w-8 h-8 text-[#ce82ff] shrink-0" />
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#ce82ff]">
              Achievement Unlocked!
            </div>
            <div className="text-sm font-bold text-white">
              {data.new_achievements.join(", ")}
            </div>
          </div>
        </div>
      )}

      {/* Return to Learning Path Button */}
      <div className="w-full pt-4">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-wider bg-[#58cc02] border-b-[4px] border-[#46a302] hover:bg-[#61db02] active:translate-y-1 active:border-b-[1px] text-white shadow-xl transition-all cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
