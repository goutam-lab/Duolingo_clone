"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Target, Store, User, Sparkles } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Learn", href: "/", icon: Home },
  { label: "Leaderboards", href: "/leaderboard", icon: Trophy },
  { label: "Quests", href: "/quests", icon: Target },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "Profile", href: "/profile", icon: User },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Left Sidebar (hidden on mobile, visible md and up) */}
      <aside
        className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r-2 border-[#2b3d48] bg-[#131f24] p-4 shrink-0 select-none z-30"
        aria-label="Main Navigation"
      >
        {/* Playful Brand Logo */}
        <div className="flex items-center gap-2 px-4 py-5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#58cc02] flex items-center justify-center text-white shadow-md shadow-[#58cc02]/30">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <span className="font-black text-2xl tracking-tight text-[#58cc02] lowercase">
            duolingo
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-100 ${
                  isActive
                    ? "bg-[#1cb0f6]/15 text-[#1cb0f6] border-2 border-[#1cb0f6]"
                    : "text-slate-400 hover:bg-[#1a2c35] hover:text-slate-200 border-2 border-transparent"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "stroke-[2.5]" : "stroke-2 text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar (visible on mobile only) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131f24] border-t-2 border-[#2b3d48] flex items-center justify-around px-2 z-40"
        aria-label="Mobile Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl ${
                isActive ? "text-[#1cb0f6]" : "text-slate-400 hover:text-slate-200"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}
      </nav>
    </>
  );
};
