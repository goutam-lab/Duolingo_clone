"use client";

import React from "react";
import { Languages } from "lucide-react";
import { UserMeResponse } from "@/types/api";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { GemsDisplay } from "@/components/gamification/GemsDisplay";
import { HeartsDisplay } from "@/components/gamification/HeartsDisplay";
import { XPDisplay } from "@/components/gamification/XPDisplay";

interface TopNavProps {
  user: UserMeResponse | null;
  onHeartsRefilled?: (hearts: number) => void;
  courseTitle?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  onHeartsRefilled,
  courseTitle = "English (Hindi)",
}) => {
  const streak = user?.current_streak ?? 0;
  const gems = user?.gems ?? 0;
  const hearts = user?.hearts ?? 5;
  const maxHearts = user?.max_hearts ?? 5;
  const totalXp = user?.total_xp ?? 0;

  return (
    <header className="w-full sticky top-0 bg-[#131f24]/90 backdrop-blur-md border-b-2 border-[#2b3d48] z-30 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Course Switcher / Flag Badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#1a2c35] border border-transparent hover:border-[#2b3d48] transition-colors cursor-pointer"
          title={`Active course: ${courseTitle}`}
        >
          <div className="w-6 h-6 rounded-md bg-[#1cb0f6]/20 border border-[#1cb0f6] flex items-center justify-center text-xs font-black text-[#1cb0f6]">
            <Languages className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline font-bold text-xs text-slate-300">
            {courseTitle}
          </span>
        </div>

        {/* Gamification Stats Header Items */}
        <div className="flex items-center gap-1 sm:gap-3">
          <StreakDisplay streak={streak} />
          <GemsDisplay gems={gems} />
          <HeartsDisplay
            hearts={hearts}
            maxHearts={maxHearts}
            onHeartsRefilled={onHeartsRefilled}
          />
          <div className="hidden sm:block">
            <XPDisplay totalXp={totalXp} />
          </div>
        </div>
      </div>
    </header>
  );
};
