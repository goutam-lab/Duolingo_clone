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
  courseTitle = "English",
}) => {
  const streak = user?.current_streak ?? 0;
  const gems = user?.gems ?? 0;
  const hearts = user?.hearts ?? 0;
  const maxHearts = user?.max_hearts ?? 5;
  const totalXp = user?.total_xp ?? user?.stats?.total_xp ?? 0;

  return (
    <header className="lg:hidden w-full sticky top-0 bg-[#131f24]/92 backdrop-blur-md border-b-2 border-[#37464f] z-30 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#1a2c35]"
          title={`Active course: ${courseTitle}`}
        >
          <div className="w-7 h-7 rounded-md bg-[#1cb0f6]/20 border border-[#1cb0f6] flex items-center justify-center">
            <Languages className="w-4 h-4 text-[#1cb0f6]" />
          </div>
          <span className="hidden sm:inline font-bold text-xs text-slate-300 truncate max-w-[140px]">
            {courseTitle}
          </span>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
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
