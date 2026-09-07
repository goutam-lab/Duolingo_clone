"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Trophy,
  Target,
  Store,
  User,
  LogOut,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { springSnappy } from "@/lib/motion";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Learn", href: "/", icon: Home, color: "#ffc800" },
  { label: "Leaderboards", href: "/leaderboard", icon: Trophy, color: "#ffc800" },
  { label: "Quests", href: "/quests", icon: Target, color: "#ce82ff" },
  { label: "Shop", href: "/shop", icon: Store, color: "#ff4b4b" },
  { label: "Profile", href: "/profile", icon: User, color: "#1cb0f6" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // Ignored
    }
    router.push("/login");
  };

  return (
    <>
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-dvh w-[216px] border-r-2 border-[#37464f] bg-[#131f24] px-3 pt-5 pb-4 z-40 select-none"
        aria-label="Main Navigation"
      >
        <Link href="/" className="flex items-center gap-2 px-2 py-1 mb-6">
          <span className="w-8 h-8 rounded-xl bg-[#58cc02] shadow-[0_3px_0_#46a302] inline-flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3c3.8 0 7 3.4 7 7.6 0 4.4-3.2 8.4-7 10.4-3.8-2-7-6-7-10.4C5 6.4 8.2 3 12 3Z"
                fill="white"
              />
            </svg>
          </span>
          <span className="font-black text-[24px] leading-none tracking-tight text-[#58cc02]">
            lingua
          </span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <motion.div
                key={item.label}
                whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={springSnappy}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-black text-[13px] uppercase tracking-wider ${
                    isActive
                      ? "bg-[#1cb0f6]/12 text-[#1cb0f6] border-2 border-[#1cb0f6]"
                      : "text-white/90 hover:bg-[#1a2c35] border-2 border-transparent"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className="w-5 h-5 shrink-0"
                    style={{ color: isActive ? "#1cb0f6" : item.color }}
                    strokeWidth={2.4}
                  />
                  <span className="leading-none">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="pt-3 border-t-2 border-[#37464f]">
          <button
            id="sidebar-logout-btn"
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-black text-[13px] uppercase tracking-wider text-[#afafaf] hover:bg-[#ff4b4b]/12 hover:text-[#ff4b4b] border-2 border-transparent"
          >
            <LogOut className="w-5 h-5 shrink-0" strokeWidth={2.4} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-[#131f24]/95 backdrop-blur-md border-t-2 border-[#37464f] flex items-center justify-around px-2 z-40 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[48px] rounded-xl ${
                isActive ? "text-[#1cb0f6]" : "text-[#afafaf]"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: isActive ? "#1cb0f6" : item.color }}
                strokeWidth={2.4}
              />
            </Link>
          );
        })}
      </nav>
    </>
  );
};
