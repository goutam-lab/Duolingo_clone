"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { LogOut, Users } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { springSnappy } from "@/lib/motion";

interface NavItem {
  label: string;
  href: string;
  icon: (props: { active?: boolean }) => ReactNode;
  activeColor?: string;
}

// ─── Custom Duo-like SVG icons ───────────────────────────────────────────────

const HouseIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Roof */}
    <path d="M4 16 L 16 4 L 28 16 L 26 18 L 16 8 L 6 18 L 4 16 Z" fill={active ? "#1cb0f6" : "#ff4b4b"} stroke={active ? "#1899d6" : "#c23030"} strokeWidth="1.6" strokeLinejoin="round"/>
    {/* House body */}
    <rect x="7" y="16" width="18" height="12" rx="2" fill={active ? "#1cb0f6" : "#ffc800"} stroke={active ? "#1899d6" : "#e5a500"} strokeWidth="1.6"/>
    {/* Roof detail line */}
    <path d="M7 16 L 25 16" stroke={active ? "#1899d6" : "#e5a500"} strokeWidth="1.6"/>
    {/* Door */}
    <rect x="14" y="20" width="5" height="8" rx="1.2" fill={active ? "#131f24" : "#5d2f00"} opacity="0.55"/>
    {/* Door knob */}
    <circle cx="17.8" cy="24.4" r="0.7" fill={active ? "#ffffff" : "#fff3bf"}/>
  </svg>
);

const LaughMouthIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Face outer */}
    <ellipse cx="16" cy="16" rx="12.5" ry="10" fill={active ? "#1cb0f6" : "#f4c69a"} stroke={active ? "#1899d6" : "#c28a5a"} strokeWidth="1.6"/>
    {/* Inner mouth lining */}
    <path d="M6 15 Q 16 28 26 15 L 24 18 Q 16 24.5 8 18 Z" fill="#6c2c2c" stroke={active ? "#1899d6" : "#a05f5f"} strokeWidth="1.4"/>
    {/* Teeth */}
    <path d="M9.5 16 L 12.5 16 M 14.5 16 L 17.5 16 M 19.5 16 L 22.5 16" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.95"/>
    {/* Tongue tip */}
    <path d="M12 20.5 Q 16 23.5 20 20.5 Q 18.5 22 16 22 Q 13.5 22 12 20.5 Z" fill="#ff7fa0"/>
  </svg>
);

const ShieldIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="shldG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={active ? "#6ed5ff" : "#ffe066"}/>
        <stop offset="100%" stopColor={active ? "#1cb0f6" : "#f5b800"}/>
      </linearGradient>
      <linearGradient id="shldSt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={active ? "#1899d6" : "#e5a500"}/>
        <stop offset="100%" stopColor={active ? "#0f6ea0" : "#997300"}/>
      </linearGradient>
    </defs>
    <path
      d="M16 3 L 27 7 V 17 C 27 23 22 27 16 29 C 10 27 5 23 5 17 V 7 Z"
      fill="url(#shldG)"
      stroke="url(#shldSt)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Highlight */}
    <path d="M10 8 L 16 5.5 L 22 8 L 21 13 L 16 11.5 L 11 13 Z" fill="#ffffff" opacity="0.35"/>
    {/* Chevron bottom emblem */}
    <path d="M12 19 L 16 23 L 20 19" stroke={active ? "#ffffff" : "#8d5a00"} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChestIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Chest body */}
    <rect x="4" y="14" width="24" height="14" rx="2.5" fill={active ? "#1cb0f6" : "#ce82ff"} stroke={active ? "#1899d6" : "#8e49c9"} strokeWidth="1.8"/>
    {/* Chest top lid */}
    <rect x="3" y="11" width="26" height="5" rx="1.8" fill={active ? "#6ed5ff" : "#e7b2ff"} stroke={active ? "#1899d6" : "#8e49c9"} strokeWidth="1.8"/>
    {/* Side bands */}
    <rect x="8" y="14" width="2" height="14" fill={active ? "#1899d6" : "#8e49c9"}/>
    <rect x="22" y="14" width="2" height="14" fill={active ? "#1899d6" : "#8e49c9"}/>
    {/* Lock */}
    <rect x="13.5" y="18" width="5" height="5" rx="1" fill="#1c2a33"/>
    {/* Keyhole */}
    <circle cx="16" cy="20" r="0.9" fill="#ffc800"/>
    <rect x="15.65" y="20.8" width="0.7" height="1.3" fill="#ffc800"/>
    {/* Lock plate highlight */}
    <path d="M14 19.2 H 19" stroke="#ffffff" opacity="0.22"/>
  </svg>
);

const ShopIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Roof / Awning */}
    <path d="M4 12 L 16 4 L 28 12 Z" fill={active ? "#1cb0f6" : "#ff4b4b"} stroke={active ? "#1899d6" : "#c23030"} strokeWidth="1.8" strokeLinejoin="round"/>
    {/* Awning stripe highlight */}
    <path d="M7 10 L 10 8 M 13 6.2 L 16 4.2 M 19 6.2 L 22 8 M 25 10 L 28 12" stroke="#ffffff" strokeWidth="0.8" opacity="0.28"/>
    {/* Facade / shop body */}
    <rect x="6" y="12" width="20" height="16" rx="1.8" fill={active ? "#6ed5ff" : "#ffc800"} stroke={active ? "#1899d6" : "#e5a500"} strokeWidth="1.8"/>
    {/* Door */}
    <rect x="13" y="19" width="6" height="9" rx="1.2" fill="#6b4a1a" opacity="0.55"/>
    <rect x="18" y="19" width="0.7" height="9" fill="#1c2a33" opacity="0.35"/>
    {/* Door knob */}
    <circle cx="17.5" cy="23.7" r="0.55" fill="#ffffff" opacity="0.85"/>
    {/* Window */}
    <rect x="8.5" y="14.5" width="5.5" height="4" rx="0.8" fill="#ffffff" opacity="0.45"/>
    <rect x="18" y="14.5" width="5.5" height="4" rx="0.8" fill="#ffffff" opacity="0.45"/>
    {/* Window frames */}
    <path d="M11.25 14.5 V 18.5 M 8.5 16.5 H 14" stroke={active ? "#1899d6" : "#997300"} strokeWidth="0.7" opacity="0.8"/>
    <path d="M20.75 14.5 V 18.5 M 18 16.5 H 23.5" stroke={active ? "#1899d6" : "#997300"} strokeWidth="0.7" opacity="0.8"/>
  </svg>
);

const ProfileIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Dashed circle (profile placeholder) */}
    <circle cx="16" cy="16" r="12.5" stroke={active ? "#1cb0f6" : "#7d97a6"} strokeWidth="2" strokeDasharray="3 3.2" fill="none"/>
    {/* G letter */}
    <text x="16" y="21.5" textAnchor="middle" fontFamily="ui-rounded, system-ui, -apple-system, Segoe UI, sans-serif" fontSize="15" fontWeight="800" fill={active ? "#1cb0f6" : "#afafaf"}>G</text>
  </svg>
);

const MoreIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="12" fill={active ? "#1cb0f6" : "#c77dff"}/>
    <circle cx="16" cy="16" r="12" fill="none" stroke={active ? "#1899d6" : "#8e49c9"} strokeWidth="1.6"/>
    <circle cx="12" cy="16" r="1.7" fill="#ffffff"/>
    <circle cx="16" cy="16" r="1.7" fill="#ffffff"/>
    <circle cx="20" cy="16" r="1.7" fill="#ffffff"/>
  </svg>
);

const DetIcon = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="12" fill="#58cc02"/>
    <path d="M8 12 C 11 9, 14 11, 16 14 C 18 11, 21 9, 24 12 L 22 22 C 20 26, 12 26, 10 22 Z" fill="#ffffff" opacity="0.9"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="12" fill="#58cc02" stroke="#46a302" strokeWidth="1.4"/>
    <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#46a302" strokeWidth="1.2" fill="none"/>
    <path d="M16 4 V 28 M 7 10 Q 11 16 7 22 M 25 10 Q 21 16 25 22" stroke="#46a302" strokeWidth="1.2" fill="none"/>
    {/* Stand */}
    <path d="M16 28 L 16 30 L 10 30 L 10 31.5 L 22 31.5 L 22 30 L 16 30" stroke="#b36400" strokeWidth="1.3" fill="#ffb43c" strokeLinejoin="round"/>
  </svg>
);

const FriendsIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Left person head */}
    <circle cx="11" cy="10" r="4.5" fill={active ? "#1cb0f6" : "#2bd47d"} stroke={active ? "#1899d6" : "#1ca35d"} strokeWidth="1.6"/>
    {/* Left person body */}
    <path d="M4 25 C 4 19.5, 7 17.5, 11 17.5 C 15 17.5, 18 19.5, 18 25" fill={active ? "#1cb0f6" : "#2bd47d"} stroke={active ? "#1899d6" : "#1ca35d"} strokeWidth="1.6" strokeLinejoin="round"/>
    {/* Right person head */}
    <circle cx="21" cy="12" r="4" fill={active ? "#6ed5ff" : "#55eb9f"} stroke={active ? "#1899d6" : "#1ca35d"} strokeWidth="1.5"/>
    {/* Right person body */}
    <path d="M15 25 C 15.5 21, 18 19, 21 19 C 24 19, 27.5 21, 28 25" fill={active ? "#6ed5ff" : "#55eb9f"} stroke={active ? "#1899d6" : "#1ca35d"} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  { label: "Learn", href: "/", icon: HouseIcon },
  { label: "Leaderboards", href: "/leaderboard", icon: ShieldIcon },
  { label: "Quests", href: "/quests", icon: ChestIcon },
  { label: "Shop", href: "/shop", icon: ShopIcon },
  { label: "Friends", href: "/friends", icon: FriendsIcon },
  { label: "Profile", href: "/profile", icon: ProfileIcon },
  { label: "More", href: "/more", icon: MoreIcon },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement | null>(null);
  const morePanelRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // Ignored
    }
    router.push("/login");
  };

  // Close MORE dropdown on outside click
  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        morePanelRef.current?.contains(t) ||
        moreBtnRef.current?.contains(t)
      )
        return;
      setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [moreOpen]);

  return (
    <>
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-dvh w-[280px] border-r-2 border-[#37464f] bg-[#131f24] px-4 pt-7 pb-5 z-40 select-none"
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 px-2 py-2 mb-8 hover:opacity-95 transition-opacity"
        >
          <span className="w-10 h-10 rounded-2xl bg-[#58cc02] shadow-[0_3px_0_#46a302] inline-flex items-center justify-center shrink-0">
            <svg
              width="22"
              height="22"
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
          <span className="font-black text-[26px] leading-none tracking-tight text-[#58cc02]">
            lingua
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 relative">
          {NAV_ITEMS.map((item) => {
            const isMore = item.label === "More";
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            const content = (
              <div
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-[13px] uppercase tracking-wider ${
                  isActive
                    ? "bg-[#1cb0f6]/12 text-[#1cb0f6] border-2 border-[#1cb0f6]"
                    : "text-white/90 hover:bg-[#1a2c35] border-2 border-transparent"
                }`}
              >
                <span className="inline-flex items-center justify-center w-7 shrink-0">
                  <Icon active={isActive} />
                </span>
                <span className="leading-none">{item.label}</span>
              </div>
            );

            if (isMore) {
              return (
                <React.Fragment key={item.label}>
                  <div className="relative">
                    <button
                      ref={moreBtnRef}
                      type="button"
                      onClick={() => setMoreOpen((o) => !o)}
                      aria-haspopup="menu"
                      aria-expanded={moreOpen}
                      className="w-full text-left"
                    >
                      {content}
                    </button>

                    <AnimatePresence>
                      {moreOpen && (
                        <motion.div
                          ref={morePanelRef}
                          role="menu"
                          initial={shouldReduceMotion ? false : { opacity: 0, y: -6, x: 8 }}
                          animate={{ opacity: 1, y: 0, x: 0 }}
                          exit={{ opacity: 0, y: -4, x: 6 }}
                          transition={springSnappy}
                          className="absolute left-[272px] top-0 w-[360px] bg-[#1a2c35] border-2 border-[#37464f] rounded-2xl overflow-hidden shadow-2xl z-50"
                        >
                          <div className="flex flex-col">
                            <button
                              role="menuitem"
                              className="flex items-center gap-4 px-5 py-4 hover:bg-[#131f24] transition-colors text-left"
                              onClick={() => router.push("/det")}
                            >
                              <DetIcon />
                              <span className="font-black text-[15px] tracking-wide uppercase text-white">
                                Duolingo English Test
                              </span>
                            </button>
                            <div className="h-px bg-[#37464f] mx-4" />
                            <button
                              role="menuitem"
                              className="flex items-center gap-4 px-5 py-4 hover:bg-[#131f24] transition-colors text-left"
                              onClick={() => router.push("/schools")}
                            >
                              <GlobeIcon />
                              <span className="font-black text-[15px] tracking-wide uppercase text-white">
                                Schools
                              </span>
                            </button>
                          </div>
                          <div className="h-px bg-[#37464f] mx-0" />
                          <div className="px-5 py-3 flex flex-col gap-0.5 text-[#afafaf] font-bold text-[14px] uppercase tracking-wider">
                            <button
                              role="menuitem"
                              type="button"
                              className="text-left hover:text-white px-2 py-2 rounded-xl hover:bg-[#131f24] transition-colors"
                              onClick={() => router.push("/settings")}
                            >
                              Settings
                            </button>
                            <button
                              role="menuitem"
                              type="button"
                              className="text-left hover:text-white px-2 py-2 rounded-xl hover:bg-[#131f24] transition-colors"
                              onClick={() => router.push("/help")}
                            >
                              Help
                            </button>
                            <button
                              role="menuitem"
                              type="button"
                              className="text-left hover:text-[#ff4b4b] px-2 py-2 rounded-xl hover:bg-[#131f24] transition-colors"
                              onClick={handleLogout}
                            >
                              Log out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </React.Fragment>
              );
            }

            return (
              <motion.div
                key={item.label}
                whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                transition={springSnappy}
              >
                <Link
                  href={item.href}
                  className="block"
                  aria-current={isActive ? "page" : undefined}
                >
                  {content}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Flexible space keeps bottom items anchored below */}
        <div className="flex-1" />

        {/* Bottom logout hidden because MORE > Log out is the primary access point now
            Keep original button accessible via aria-only fallback */}
        <button
          id="sidebar-logout-btn"
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="sr-only"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </aside>

      {/* Mobile bottom navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-[62px] bg-[#131f24]/95 backdrop-blur-md border-t-2 border-[#37464f] flex items-center justify-around px-1 z-40 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile Navigation"
      >
        {NAV_ITEMS.slice(0, 5).concat(NAV_ITEMS.filter(n => n.label === "Profile")).map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-xl ${
                isActive ? "text-[#1cb0f6]" : "text-[#afafaf]"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon active={isActive} />
            </Link>
          );
        })}
      </nav>
    </>
  );
};
