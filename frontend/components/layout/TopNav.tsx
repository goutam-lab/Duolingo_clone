"use client";

import React, { useState, useEffect } from "react";
import { Languages, Crown } from "lucide-react";
import { UserMeResponse } from "@/types/api";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { GemsDisplay } from "@/components/gamification/GemsDisplay";
import { HeartsDisplay } from "@/components/gamification/HeartsDisplay";
import { XPDisplay } from "@/components/gamification/XPDisplay";
import { SuperDuolingoModal } from "@/components/gamification/SuperDuolingoModal";

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
  const [isSuperOpen, setIsSuperOpen] = useState(false);
  const [isActivatingSuper, setIsActivatingSuper] = useState(false);
  const [isSuperActive, setIsSuperActive] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("super_active") === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () =>
      setIsSuperActive(localStorage.getItem("super_active") === "true");
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleActivateTrial = async () => {
    setIsActivatingSuper(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      if (typeof window !== "undefined") {
        localStorage.setItem("super_active", "true");
        localStorage.setItem(
          "super_expires_at",
          String(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );
      }
      setIsSuperActive(true);
      setIsSuperOpen(false);
    } finally {
      setIsActivatingSuper(false);
    }
  };

  return (
    <>
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
            <button
              type="button"
              onClick={() => setIsSuperOpen(true)}
              className={`shrink-0 px-2 py-1 rounded-lg border-2 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all ${
                isSuperActive
                  ? "bg-[#5454ff]/25 border-[#7b6bff]/60 text-[#d8d5ff]"
                  : "bg-[#5454ff]/15 border-[#5454ff]/45 text-[#c7c4ff] hover:bg-[#5454ff]/25"
              }`}
              style={{
                WebkitTextFillColor: isSuperActive ? undefined : "transparent",
                backgroundImage: isSuperActive
                  ? undefined
                  : "linear-gradient(90deg, #1adfff, #7b6bff 50%, #ff628e)",
                WebkitBackgroundClip: isSuperActive ? undefined : "text",
                backgroundClip: isSuperActive ? undefined : "text",
                backgroundColor: isSuperActive ? undefined : "rgba(84, 84, 255, 0.1)",
              }}
              title={isSuperActive ? "Super Duolingo Active" : "Try Super Duolingo"}
            >
              <Crown className="w-3 h-3" style={{ fill: "#ffc800", color: "#ffc800" }} />
              <span className="hidden xs:inline">{isSuperActive ? "Super" : "Try Super"}</span>
            </button>
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

      <SuperDuolingoModal
        isOpen={isSuperOpen}
        onClose={() => !isActivatingSuper && setIsSuperOpen(false)}
        onActivateTrial={handleActivateTrial}
        isActivating={isActivatingSuper}
      />
    </>
  );
};
