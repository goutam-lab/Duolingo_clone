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
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse } from "@/types/api";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState } from "@/components/ui/ErrorState";
import { SuperDuolingoModal } from "@/components/gamification/SuperDuolingoModal";

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

    setIsRefilling(true);
    setRefillSuccess(false);

    try {
      const res = await apiClient.refillHearts();
      setUser({ ...user, hearts: res.hearts });
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
      setIsSuperOpen(false);
    } finally {
      setIsActivatingSuper(false);
    }
  }, []);

  const isHeartsFull = user ? user.hearts >= user.max_hearts : false;

  return (
    <AppShell
      user={user}
      onHeartsRefilled={(h) => user && setUser({ ...user, hearts: h })}
    >
      <div className="w-full p-3 sm:p-4 space-y-4">
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
                      onClick={() => setIsSuperOpen(true)}
                      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                      whileTap={shouldReduceMotion ? undefined : { y: 2 }}
                      disabled={isSuperActive}
                      className={`w-full px-5 py-3 rounded-2xl font-black text-[12px] uppercase tracking-[0.14em] text-white shadow-lg transition-all border-b-4 active:translate-y-0.5 active:border-b-2 ${
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

                <div className="p-5 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#ff4b4b]/40">
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
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 px-1">
                  Power-Ups
                </h2>

                <div className="p-5 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex items-center justify-between gap-4 opacity-90">
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

                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 shrink-0">
                    Equipped
                  </span>
                </div>
              </section>
            </>
          )}
        </div>

      <SuperDuolingoModal
        isOpen={isSuperOpen}
        onClose={() => !isActivatingSuper && setIsSuperOpen(false)}
        onActivateTrial={handleActivateSuperTrial}
        isActivating={isActivatingSuper}
      />
    </AppShell>
  );
}
