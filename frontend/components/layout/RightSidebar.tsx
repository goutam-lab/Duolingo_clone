"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Languages, Shield, Trophy, Users, Lock } from "lucide-react";
import { UserMeResponse } from "@/types/api";
import { DailyGoalCard } from "@/components/gamification/DailyGoalCard";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { GemsDisplay } from "@/components/gamification/GemsDisplay";
import { HeartsDisplay } from "@/components/gamification/HeartsDisplay";

interface RightSidebarProps {
  user: UserMeResponse | null;
  onHeartsRefilled?: (hearts: number) => void;
}

const SuperGradientOwl = () => (
  <svg width="170" height="140" viewBox="0 0 170 140" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="superRainbow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1adfff"/>
        <stop offset="35%" stopColor="#7b6bff"/>
        <stop offset="65%" stopColor="#d16bff"/>
        <stop offset="100%" stopColor="#ff628e"/>
      </linearGradient>
      <linearGradient id="superHead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7ceaff"/>
        <stop offset="55%" stopColor="#9b79ff"/>
        <stop offset="100%" stopColor="#ff77b6"/>
      </linearGradient>
      <radialGradient id="superBody" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#8be4ff"/>
        <stop offset="50%" stopColor="#9f82ff"/>
        <stop offset="100%" stopColor="#ff73b3"/>
      </radialGradient>
      <radialGradient id="eyeWhite" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#e9f4ff"/>
      </radialGradient>
      <filter id="superShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000" floodOpacity="0.35"/>
      </filter>
    </defs>

    {/* Floating sparkles */}
    <circle cx="24" cy="30" r="3" fill="#ff77b6" opacity="0.85"/>
    <circle cx="14" cy="62" r="2.2" fill="#7ceaff" opacity="0.9"/>
    <circle cx="146" cy="26" r="2.8" fill="#9f82ff" opacity="0.95"/>
    <circle cx="156" cy="66" r="2" fill="#8be4ff" opacity="0.85"/>

    {/* Ear tufts */}
    <path d="M46 40 L34 12 L64 34 Z" fill="url(#superHead)" stroke="#5a3bd1" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M118 40 L130 12 L100 34 Z" fill="url(#superHead)" stroke="#5a3bd1" strokeWidth="1.4" strokeLinejoin="round"/>

    {/* Head */}
    <ellipse cx="82" cy="56" rx="46" ry="42" fill="url(#superHead)" filter="url(#superShadow)" />

    {/* Left wing */}
    <path d="M34 76 C 26 92, 32 116, 44 126 L 54 106 C 44 94, 42 84, 48 74 Z"
          fill="#7b4cd9" stroke="#4a2dbb" strokeWidth="1.6" strokeLinejoin="round"/>
    {/* Right wing */}
    <path d="M130 76 C 138 92, 132 116, 120 126 L 110 106 C 120 94, 122 84, 116 74 Z"
          fill="#c24a9a" stroke="#8a2f6a" strokeWidth="1.6" strokeLinejoin="round"/>

    {/* Body */}
    <ellipse cx="82" cy="100" rx="34" ry="30" fill="url(#superBody)" stroke="#5a3bd1" strokeWidth="1.4"/>

    {/* Face white */}
    <ellipse cx="82" cy="60" rx="34" ry="26" fill="#e8faff" opacity="0.75"/>

    {/* Left eye */}
    <g>
      <circle cx="66" cy="54" r="16" fill="url(#eyeWhite)" stroke="#3b279a" strokeWidth="2"/>
      <circle cx="68.5" cy="56" r="8.5" fill="#0d0255"/>
      <circle cx="71.5" cy="52.5" r="2.8" fill="#fff"/>
    </g>
    {/* Right eye (winking closed) */}
    <g>
      <circle cx="98" cy="54" r="16" fill="url(#eyeWhite)" stroke="#3b279a" strokeWidth="2"/>
      <path d="M 84 54 Q 98 62 112 54" stroke="#0d0255" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    </g>

    {/* Beak */}
    <path d="M72 70 L 92 70 L 82 84 Z" fill="#ffa93c" stroke="#c55c00" strokeWidth="1.4" strokeLinejoin="round"/>

    {/* Mouth under beak */}
    <path d="M70 92 Q 82 100 94 92" stroke="#3b279a" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85"/>

    {/* Beak mouth line */}
    <path d="M73.5 77 Q 82 81 90.5 77" stroke="#c55c00" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
);

const SuperBadge = () => (
  <svg width="108" height="34" viewBox="0 0 108 34" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="superLogo" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1adfff"/>
        <stop offset="28%" stopColor="#8b7bff"/>
        <stop offset="60%" stopColor="#d66bff"/>
        <stop offset="100%" stopColor="#ff7fa0"/>
      </linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="105" height="31" rx="8" fill="#142130" stroke="url(#superLogo)" strokeWidth="3"/>
    <text x="8" y="24.5" fontFamily="ui-rounded, system-ui, -apple-system, Segoe UI, sans-serif"
          fontWeight="900" fontSize="20" fontStyle="italic" letterSpacing="1.2" fill="url(#superLogo)">
      SUPER
    </text>
  </svg>
);

const LeaderboardLockShield = () => (
  <svg width="52" height="58" viewBox="0 0 52 58" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="shld2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#cfe3ee"/>
        <stop offset="100%" stopColor="#89a7ba"/>
      </linearGradient>
    </defs>
    <path
      d="M26 3 L 47 8 V 24 C 47 36 40 46 26 51 C 12 46 5 36 5 24 V 8 Z"
      fill="url(#shld2)"
      stroke="#4e6d82"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M10 10 L 26 6.5 L 42 10 L 40 17 L 26 15 L 12 17 Z" fill="#ffffff" opacity="0.4"/>
    {/* Lock */}
    <rect x="19" y="26" width="14" height="12" rx="2.4" fill="#2f4251" stroke="#1a2833" strokeWidth="1.5"/>
    <path d="M 21.5 26 V 23 A 4.5 4.5 0 0 1 30.5 23 V 26" stroke="#2f4251" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="26" cy="31.2" r="1.6" fill="#c9d7e1"/>
    <rect x="25.3" y="32.6" width="1.4" height="2.6" fill="#c9d7e1"/>
  </svg>
);

export const RightSidebar: React.FC<RightSidebarProps> = ({
  user,
  onHeartsRefilled,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const dailyGoalXp = user?.daily_goal_xp ?? 20;
  const dailyGoalProgress = user?.daily_goal_progress ?? 0;
  const streak = user?.current_streak ?? 0;
  const gems = user?.gems ?? 0;
  const hearts = user?.hearts ?? 0;
  const maxHearts = user?.max_hearts ?? 5;

  return (
    <aside
      className="hidden lg:flex flex-col gap-3 w-[368px] p-3 pt-3 select-none fixed right-0 top-0 h-dvh overflow-y-auto z-30 bg-[#131f24]"
      aria-label="Companion Sidebar"
    >
      <div className="flex items-center justify-end gap-1">
        <div
          className="w-8 h-8 rounded-lg bg-[#1cb0f6]/15 border border-[#1cb0f6]/40 flex items-center justify-center"
          title="Current course"
        >
          <Languages className="w-4 h-4 text-[#1cb0f6]" />
        </div>
        <StreakDisplay streak={streak} />
        <GemsDisplay gems={gems} />
        <HeartsDisplay
          hearts={hearts}
          maxHearts={maxHearts}
          onHeartsRefilled={onHeartsRefilled}
        />
      </div>

      {/* SUPER promotion card */}
      <motion.div
        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
        className="p-4 rounded-3xl border-2 border-[#37464f] bg-[#1a2c35] relative overflow-hidden"
      >
        {/* Decorative top glow */}
        <div
          className="absolute -top-10 -right-6 rounded-full opacity-50 blur-3xl"
          style={{
            width: "180px",
            height: "180px",
            background:
              "radial-gradient(circle at center, rgba(124,106,255,0.65) 0%, rgba(255,103,156,0.25) 50%, transparent 75%)",
          }}
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <SuperBadge />
            </div>
            <h3 className="text-[18px] font-black text-white leading-snug mb-1.5 tracking-tight">
              Try Super for free
            </h3>
            <p className="text-[13px] text-[#cfd8dd] leading-relaxed mb-4 font-semibold">
              No ads, personalized practice, and unlimited Legendary!
            </p>
            <Link
              href="/shop"
              className="block text-center w-full py-3 px-4 rounded-2xl bg-[#5454ff] border-b-4 border-[#3b3be6] hover:brightness-110 active:translate-y-0.5 active:border-b-2 font-black text-[13px] uppercase tracking-[0.14em] text-white shadow-[0_6px_0_#2a2ac2] transition"
            >
              Try 1 Week Free
            </Link>
          </div>
          <div className="shrink-0 pt-1">
            <SuperGradientOwl />
          </div>
        </div>
      </motion.div>

      {/* Leaderboard unlocks card */}
      <Link
        href="/leaderboard"
        className="block p-5 rounded-3xl border-2 border-[#37464f] bg-[#1a2c35] hover:border-[#ffc800]/50 text-white group transition"
      >
        <h3 className="font-black text-[17px] uppercase tracking-wide text-white leading-snug mb-4">
          Unlock Leaderboards!
        </h3>
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <LeaderboardLockShield />
          </div>
          <div>
            <div className="text-[14px] font-bold text-slate-100 leading-tight">
              Complete 3 more lessons to start competing
            </div>
          </div>
        </div>
      </Link>

      <DailyGoalCard progress={dailyGoalProgress} goal={dailyGoalXp} />

      <footer className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-[#6b7c86] uppercase tracking-wider">
        <span>About</span>
        <span>Blog</span>
        <span>Terms</span>
        <span>Privacy</span>
      </footer>
    </aside>
  );
};
