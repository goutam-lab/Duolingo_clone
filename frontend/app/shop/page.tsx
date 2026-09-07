"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Sparkles,
  Zap,
  Check,
  Loader2,
  Shield,
  Gem,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse } from "@/types/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { ErrorState } from "@/components/ui/ErrorState";

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefilling, setIsRefilling] = useState<boolean>(false);
  const [refillSuccess, setRefillSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const isHeartsFull = user ? user.hearts >= user.max_hearts : false;

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-row justify-center pb-20 md:pb-0">
      <Sidebar />

      <main className="flex-1 max-w-2xl min-h-screen flex flex-col border-r border-[#2b3d48]/40">
        <TopNav user={user} onHeartsRefilled={(h) => user && setUser({ ...user, hearts: h })} />

        <div className="flex-1 w-full p-4 sm:p-6 space-y-6">
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
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#131f24] border-2 border-[#2b3d48] text-[#1cb0f6] font-black text-base shrink-0">
                  <Gem className="w-5 h-5 fill-[#1cb0f6]" />
                  <span>{user?.gems ?? 0}</span>
                </div>
              </section>

              {/* Hearts Refill Section */}
              <section aria-label="Heart Refills" className="space-y-3">
                <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 px-1">
                  Hearts
                </h2>

                <div className="p-5 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] flex flex-col sm:flex-row items-center justify-between gap-4">
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
      </main>

      <RightSidebar user={user} />
    </div>
  );
}
