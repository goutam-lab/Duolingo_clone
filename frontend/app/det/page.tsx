"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Award, CheckCircle2, Globe, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse } from "@/types/api";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/ui/LoadingState";

export default function DetPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getCurrentUser();
      setUser(data);
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      if (
        errorObj?.status === 401 ||
        errorObj?.message?.toLowerCase().includes("authentication") ||
        errorObj?.message?.toLowerCase().includes("log in")
      ) {
        router.push("/login");
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AppShell user={user}>
      <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {isLoading && <LoadingState />}

        {!isLoading && (
          <>
            <header className="p-8 rounded-3xl bg-linear-to-br from-[#1a2c35] via-[#1a382d] to-[#12241d] border-2 border-[#58cc02]/40 shadow-xl relative overflow-hidden flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-[#58cc02]/20 border-2 border-[#58cc02] flex items-center justify-center text-[#58cc02] shadow-lg shadow-[#58cc02]/20">
                <Award className="w-9 h-9" />
              </div>
              <div className="space-y-1.5 max-w-lg">
                <span className="text-xs font-black uppercase tracking-wider text-[#58cc02] flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official Certification
                </span>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  Duolingo English Test
                </h1>
                <p className="text-sm text-[#cfd8dd] font-semibold leading-relaxed">
                  Certify your English proficiency with a convenient, fast, and globally accepted online test.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] text-sm font-black uppercase tracking-wider text-[#131f24] hover:bg-[#4ebb02] active:translate-y-0.5 active:border-b-2 transition"
                >
                  <span>Practice on Lingua</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] space-y-1.5">
                <div className="text-[#1cb0f6] font-black text-sm uppercase">Convenient</div>
                <p className="text-xs text-[#afafaf] font-semibold">
                  Test online from anywhere, anytime — no test centers required.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] space-y-1.5">
                <div className="text-[#ffc800] font-black text-sm uppercase">Fast Results</div>
                <p className="text-xs text-[#afafaf] font-semibold">
                  Receive your certified score reports within 48 hours.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] space-y-1.5">
                <div className="text-[#58cc02] font-black text-sm uppercase">Accepted Worldwide</div>
                <p className="text-xs text-[#afafaf] font-semibold">
                  Recognized by over 4,500 institutions and universities globally.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
