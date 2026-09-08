"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Sparkles,
  Check,
  Loader2,
  Shield,
  Gem,
  Zap,
  Crown,
  Star,
  ChevronRight,
  Award,
  Flame,
  Clock,
  Shirt,
  ShoppingBag,
  Coins,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse } from "@/types/api";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState } from "@/components/ui/ErrorState";
import { SuperDuolingoModal } from "@/components/gamification/SuperDuolingoModal";
import {
  UpcomingFeatureModal,
  UpcomingShopItem,
} from "@/components/shop/UpcomingFeatureModal";
import { soundEffects } from "@/lib/sound";

const SmallSuperOwl = () => (
  <svg width="130" height="110" viewBox="0 0 170 140" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="shopHead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7ceaff"/>
        <stop offset="55%" stopColor="#9b79ff"/>
        <stop offset="100%" stopColor="#ff77b6"/>
      </linearGradient>
      <radialGradient id="shopBody" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#8be4ff"/>
        <stop offset="50%" stopColor="#9f82ff"/>
        <stop offset="100%" stopColor="#ff73b3"/>
      </radialGradient>
    </defs>
    <circle cx="28" cy="28" r="3.2" fill="#ff77b6" opacity="0.8"/>
    <circle cx="144" cy="24" r="2.6" fill="#9f82ff" opacity="0.9"/>
    <circle cx="86" cy="14" r="2.2" fill="#ffc800" opacity="0.85"/>
    <path d="M48 44 L36 16 L66 38 Z" fill="url(#shopHead)" stroke="#5a3bd1" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M116 44 L128 16 L98 38 Z" fill="url(#shopHead)" stroke="#5a3bd1" strokeWidth="1.4" strokeLinejoin="round"/>
    <ellipse cx="82" cy="60" rx="44" ry="40" fill="url(#shopHead)"/>
    <path d="M36 80 C 28 96, 34 120, 46 130 L 56 110 C 46 98, 44 88, 50 78 Z" fill="#7b4cd9" stroke="#4a2dbb" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M128 80 C 136 96, 130 120, 118 130 L 108 110 C 118 98, 120 88, 114 78 Z" fill="#c24a9a" stroke="#8a2f6a" strokeWidth="1.6" strokeLinejoin="round"/>
    <ellipse cx="82" cy="104" rx="32" ry="28" fill="url(#shopBody)" stroke="#5a3bd1" strokeWidth="1.4"/>
    <ellipse cx="82" cy="64" rx="32" ry="24" fill="#e8faff" opacity="0.72"/>
    <circle cx="66" cy="58" r="15" fill="#ffffff" stroke="#3b279a" strokeWidth="2"/>
    <circle cx="68.5" cy="60" r="8" fill="#0d0255"/>
    <circle cx="71" cy="56.5" r="2.6" fill="#fff"/>
    <circle cx="98" cy="58" r="15" fill="#ffffff" stroke="#3b279a" strokeWidth="2"/>
    <path d="M 84 58 Q 98 66 112 58" stroke="#0d0255" strokeWidth="4.2" fill="none" strokeLinecap="round"/>
    <path d="M74 74 L 90 74 L 82 86 Z" fill="#ffa93c" stroke="#c55c00" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

export default function ShopPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefilling, setIsRefilling] = useState<boolean>(false);
  const [refillSuccess, setRefillSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuperOpen, setIsSuperOpen] = useState(false);
  const [isActivatingSuper, setIsActivatingSuper] = useState(false);
  const [isSuperActive, setIsSuperActive] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("super_active") === "true";
  });

  // Upcoming feature modal state
  const [upcomingModalOpen, setUpcomingModalOpen] = useState(false);
  const [selectedUpcomingItem, setSelectedUpcomingItem] = useState<UpcomingShopItem | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let userData: UserMeResponse;
      try {
        userData = await apiClient.getCurrentUser();
      } catch (authErr: any) {
        if (
          authErr?.status === 401 ||
          authErr?.message?.toLowerCase().includes("authentication") ||
          authErr?.message?.toLowerCase().includes("log in")
        ) {
          router.push("/login");
          return;
        }
        throw authErr;
      }

      setUser(userData);
    } catch (err) {
      console.error("Failed to load shop:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the shop server."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefill = async () => {
    if (!user || user.hearts >= user.max_hearts || isRefilling) return;

    soundEffects.playClick();
    setIsRefilling(true);
    setRefillSuccess(false);

    try {
      const res = await apiClient.refillHearts();
      setUser({ ...user, hearts: res.hearts });
      soundEffects.playRefill();
      setRefillSuccess(true);
      setTimeout(() => setRefillSuccess(false), 3000);
    } catch (err: any) {
      alert(err?.message || "Failed to refill hearts. Please retry.");
    } finally {
      setIsRefilling(false);
    }
  };

  const handleActivateSuperTrial = useCallback(async () => {
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
      soundEffects.playComplete();
      setIsSuperOpen(false);
    } finally {
      setIsActivatingSuper(false);
    }
  }, []);

  const openUpcomingItem = (item: UpcomingShopItem) => {
    soundEffects.playClick();
    setSelectedUpcomingItem(item);
    setUpcomingModalOpen(true);
  };

  const isHeartsFull = user ? user.hearts >= user.max_hearts : false;

  return (
    <AppShell
      user={user}
      onHeartsRefilled={(h) => user && setUser({ ...user, hearts: h })}
    >
      <div className="w-full p-3 sm:p-4 space-y-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="w-full h-32 rounded-3xl bg-[#1a2c35]" />
            <div className="w-full h-28 rounded-2xl bg-[#1a2c35]" />
            <div className="w-full h-28 rounded-2xl bg-[#1a2c35]" />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : (
          <>
            {/* Super Duolingo Promotion */}
            <section
              aria-label="Super Duolingo"
              className="relative overflow-hidden rounded-3xl p-6 border-2 shadow-2xl"
              style={{
                borderColor: isSuperActive
                  ? "rgba(124,106,255,0.55)"
                  : "rgba(124,106,255,0.35)",
                background: isSuperActive
                  ? "linear-gradient(135deg, rgba(124,106,255,0.28) 0%, rgba(255,103,156,0.22) 100%), #1a2c35"
                  : "linear-gradient(135deg, rgba(124,106,255,0.18) 0%, rgba(255,103,156,0.14) 100%), #1a2c35",
              }}
            >
              <div
                className="absolute -top-16 -right-10 rounded-full blur-3xl pointer-events-none"
                style={{
                  width: "220px",
                  height: "220px",
                  background:
                    "radial-gradient(circle at center, rgba(124,106,255,0.55) 0%, rgba(255,103,156,0.22) 50%, transparent 75%)",
                }}
              />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="shrink-0 mt-1">
                    <SmallSuperOwl />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[11px] uppercase tracking-[0.14em]"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #1adfff 0%, #7b6bff 40%, #d16bff 70%, #ff628e 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        backgroundColor: "rgba(124,106,255,0.12)",
                        border: "1px solid rgba(124,106,255,0.35)",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      <Star className="w-3 h-3" style={{ fill: "#ffc800", color: "#ffc800" }} />
                      Super Duolingo
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                      {isSuperActive ? (
                        <>Enjoy your Super benefits!</>
                      ) : (
                        <>
                          Get{" "}
                          <span
                            className="bg-clip-text text-transparent"
                            style={{
                              backgroundImage:
                                "linear-gradient(90deg, #1adfff, #7b6bff 50%, #ff628e)",
                            }}
                          >
                            unlimited hearts
                          </span>{" "}
                          & more
                        </>
                      )}
                    </h2>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {[
                        { Icon: Heart, label: "Unlimited Hearts" },
                        { Icon: Zap, label: "No Ads" },
                        { Icon: Crown, label: "Legendary" },
                      ].map(({ Icon, label }) => (
                        <div
                          key={label}
                          className="flex items-center gap-1.5 text-[12px] font-bold text-white/85"
                        >
                          <Icon className="w-3.5 h-3.5 text-[#ffc800]" />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0 sm:min-w-[200px]">
                  <motion.button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setIsSuperOpen(true);
                    }}
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { y: 2 }}
                    disabled={isSuperActive}
                    className={`w-full px-5 py-3 rounded-2xl font-black text-[12px] uppercase tracking-[0.14em] text-white shadow-lg transition-all border-b-4 active:translate-y-0.5 active:border-b-2 cursor-pointer ${
                      isSuperActive
                        ? "bg-[#131f24]/50 border-[#37464f] text-white/80 cursor-default"
                        : "bg-[#5454ff] border-[#3b3be6] hover:brightness-110 shadow-[#5454ff]/25"
                    }`}
                  >
                    {isSuperActive ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Award className="w-4 h-4" />
                        Super Active
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        Try 1 Week Free
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </motion.button>
                  {!isSuperActive && (
                    <p className="mt-1.5 text-center text-[10.5px] font-bold text-white/55 leading-snug">
                      Cancel anytime · No payment required
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Shop Header Banner */}
            <section
              aria-label="Shop Header"
              className="p-6 rounded-3xl bg-linear-to-br from-[#1a2c35] to-[#1a2735] border-2 border-[#1cb0f6]/30 shadow-lg flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white">Shop</h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Use gems to replenish hearts and protect your daily streaks.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#131f24] border-2 border-[#37464f] text-[#1cb0f6] font-black text-base shrink-0">
                <Gem className="w-5 h-5 fill-[#1cb0f6]" />
                <span>{user?.gems ?? 0}</span>
              </div>
            </section>

            {/* Hearts Refill Section */}
            <section aria-label="Heart Refills" className="space-y-3">
              <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 px-1">
                Hearts
              </h2>

              <div className="p-5 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#ff4b4b]/40 transition-colors">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-[#ff4b4b]/15 border-2 border-[#ff4b4b]/30 flex items-center justify-center shrink-0">
                    <Heart className="w-8 h-8 fill-[#ff4b4b] text-[#ff4b4b]" />
                  </div>
                  <div>
                    <div className="font-black text-white text-base">
                      Refill Hearts
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Restore your hearts to maximum ({user?.hearts}/{user?.max_hearts}) so you can keep practicing without pause.
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  {isHeartsFull ? (
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#243946] text-slate-400 border-2 border-[#374c5a] cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 text-[#58cc02]" />
                      <span>Full</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRefill}
                      disabled={isRefilling}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#58cc02] hover:bg-[#61db02] text-white border-b-[4px] border-[#46a302] active:translate-y-1 active:border-b-[1px] shadow-lg shadow-[#58cc02]/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isRefilling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Refilling...</span>
                        </>
                      ) : refillSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Restored!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Refill Free</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Power-ups Section */}
            <section aria-label="Power-ups" className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">
                  Power-Ups
                </h2>
                <span className="text-xs text-slate-400 font-semibold">
                  Boost your progress
                </span>
              </div>

              {/* Streak Freeze */}
              <div className="p-5 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#1cb0f6]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1cb0f6]/15 border-2 border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6] shrink-0">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-black text-white text-base">
                      Streak Freeze
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Streak Freeze allows your streak to remain in place for one full day of inactivity.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openUpcomingItem({
                      id: "streak_freeze",
                      name: "Streak Freeze",
                      category: "Power-Up",
                      cost: 200,
                      isGems: true,
                      icon: <Shield className="w-10 h-10" />,
                      description:
                        "Equip a protective freeze shield to save your precious learning streak from breaking if you miss a single day.",
                    })
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#1cb0f6] hover:bg-[#1899d6] border-b-4 border-[#1479ab] active:translate-y-0.5 active:border-b-2 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 shadow-sm"
                >
                  <Gem className="w-3.5 h-3.5 fill-white" />
                  <span>Buy (200)</span>
                </button>
              </div>

              {/* Double or Nothing */}
              <div className="p-5 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#ff9600]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#ff9600]/15 border-2 border-[#ff9600]/30 flex items-center justify-center text-[#ff9600] shrink-0">
                    <Flame className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-black text-white text-base">
                      Double or Nothing
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Double your 50 gems wager by maintaining a 7-day learning streak!
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openUpcomingItem({
                      id: "double_or_nothing",
                      name: "Double or Nothing",
                      category: "Power-Up",
                      cost: 50,
                      isGems: true,
                      icon: <Flame className="w-10 h-10 text-[#ff9600]" />,
                      description:
                        "Bet 50 gems to prove your dedication! Maintain a 7-day streak and win 100 gems back.",
                    })
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#ff9600] hover:bg-[#e08500] border-b-4 border-[#b86d00] active:translate-y-0.5 active:border-b-2 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 shadow-sm"
                >
                  <Gem className="w-3.5 h-3.5 fill-white" />
                  <span>Wager (50)</span>
                </button>
              </div>

              {/* Timer Boost */}
              <div className="p-5 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#ce82ff]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#ce82ff]/15 border-2 border-[#ce82ff]/30 flex items-center justify-center text-[#ce82ff] shrink-0">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-black text-white text-base">
                      Timer Boost
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Add an extra 2 minutes to timed practice rounds and speed reviews.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openUpcomingItem({
                      id: "timer_boost",
                      name: "Timer Boost",
                      category: "Power-Up",
                      cost: 100,
                      isGems: true,
                      icon: <Clock className="w-10 h-10 text-[#ce82ff]" />,
                      description:
                        "Don't let the clock stop your learning! Add 120 seconds of bonus time to any challenge.",
                    })
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-[#ce82ff] hover:bg-[#a559d9] border-b-4 border-[#823fb0] active:translate-y-0.5 active:border-b-2 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 shadow-sm"
                >
                  <Gem className="w-3.5 h-3.5 fill-white" />
                  <span>Buy (100)</span>
                </button>
              </div>
            </section>

            {/* Duo Character Outfits Section */}
            <section aria-label="Character Outfits" className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">
                  Duo Outfits
                </h2>
                <span className="text-xs text-slate-400 font-semibold">
                  Personalize your mascot
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Formal Tuxedo */}
                <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col justify-between gap-3 hover:border-slate-500 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#5454ff]/15 border border-[#5454ff]/30 flex items-center justify-center text-[#5454ff] shrink-0">
                      <Shirt className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm">Formal Tuxedo</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Duo dresses sharp for elegant vocabulary mastery.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openUpcomingItem({
                        id: "tuxedo_duo",
                        name: "Formal Tuxedo Duo",
                        category: "Outfit",
                        cost: 400,
                        isGems: true,
                        icon: <Shirt className="w-10 h-10 text-[#5454ff]" />,
                        description:
                          "Give your owl a dapper look with bow tie and tailcoat across your learning path.",
                      })
                    }
                    className="w-full py-2 px-3 rounded-xl bg-[#131f24] hover:bg-[#18262e] border border-[#2b3d48] text-xs font-black uppercase text-[#1cb0f6] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Gem className="w-3.5 h-3.5 fill-[#1cb0f6]" />
                    <span>Get (400 Gems)</span>
                  </button>
                </div>

                {/* Space Suit */}
                <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col justify-between gap-3 hover:border-slate-500 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#ffc800]/15 border border-[#ffc800]/30 flex items-center justify-center text-[#ffc800] shrink-0">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm">Astronaut Suit</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Explore extraterrestrial dialects in zero gravity.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openUpcomingItem({
                        id: "astronaut_duo",
                        name: "Astronaut Suit Duo",
                        category: "Outfit",
                        cost: 600,
                        isGems: true,
                        icon: <Star className="w-10 h-10 text-[#ffc800]" />,
                        description:
                          "Equip Duo with a high-tech space helmet and astronaut booster pack.",
                      })
                    }
                    className="w-full py-2 px-3 rounded-xl bg-[#131f24] hover:bg-[#18262e] border border-[#2b3d48] text-xs font-black uppercase text-[#1cb0f6] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Gem className="w-3.5 h-3.5 fill-[#1cb0f6]" />
                    <span>Get (600 Gems)</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Gems Vault Section */}
            <section aria-label="Gems Vault" className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">
                  Gems Vault
                </h2>
                <span className="text-xs text-slate-400 font-semibold">
                  Replenish your balance
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "gems_500",
                    name: "Pocket of Gems",
                    gems: "500",
                    price: "$4.99",
                  },
                  {
                    id: "gems_1200",
                    name: "Sack of Gems",
                    gems: "1,200",
                    price: "$9.99",
                  },
                  {
                    id: "gems_3000",
                    name: "Chest of Gems",
                    gems: "3,000",
                    price: "$19.99",
                  },
                ].map((pack) => (
                  <div
                    key={pack.id}
                    className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col items-center text-center gap-3 hover:border-[#1cb0f6]/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#1cb0f6]/15 border border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6]">
                      <Gem className="w-6 h-6 fill-[#1cb0f6]" />
                    </div>
                    <div>
                      <div className="font-black text-white text-base">
                        {pack.gems} Gems
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        {pack.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openUpcomingItem({
                          id: pack.id,
                          name: pack.name,
                          category: "Gems",
                          cost: pack.price,
                          isGems: false,
                          icon: <Gem className="w-10 h-10 text-[#1cb0f6] fill-[#1cb0f6]" />,
                          description: `Instantly add ${pack.gems} shining gems to your Lingua vault.`,
                        })
                      }
                      className="w-full py-2 px-3 rounded-xl bg-[#58cc02] hover:bg-[#61db02] border-b-4 border-[#46a302] active:translate-y-0.5 active:border-b-2 font-black text-xs uppercase tracking-wider text-white shadow-sm cursor-pointer transition-all"
                    >
                      {pack.price}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Super Duolingo Trial Modal */}
      <SuperDuolingoModal
        isOpen={isSuperOpen}
        onClose={() => !isActivatingSuper && setIsSuperOpen(false)}
        onActivateTrial={handleActivateSuperTrial}
        isActivating={isActivatingSuper}
      />

      {/* Upcoming Feature Preview Modal */}
      <UpcomingFeatureModal
        isOpen={upcomingModalOpen}
        item={selectedUpcomingItem}
        onClose={() => {
          setUpcomingModalOpen(false);
          setSelectedUpcomingItem(null);
        }}
      />
    </AppShell>
  );
}
