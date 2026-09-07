"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Users, CheckCircle2, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse } from "@/types/api";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/ui/LoadingState";

export default function SchoolsPage() {
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
            <header className="p-8 rounded-3xl bg-linear-to-br from-[#1a2c35] via-[#1f2d3d] to-[#141f2b] border-2 border-[#1cb0f6]/40 shadow-xl relative overflow-hidden flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-[#1cb0f6]/20 border-2 border-[#1cb0f6] flex items-center justify-center text-[#1cb0f6] shadow-lg shadow-[#1cb0f6]/20">
                <GraduationCap className="w-9 h-9" />
              </div>
              <div className="space-y-1.5 max-w-lg">
                <span className="text-xs font-black uppercase tracking-wider text-[#1cb0f6] flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Classroom Learning
                </span>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  Lingua for Schools
                </h1>
                <p className="text-sm text-[#cfd8dd] font-semibold leading-relaxed">
                  Empower educators and learners with personalized practice, track student growth, and assign lessons seamlessly.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-sm font-black uppercase tracking-wider text-white hover:bg-[#19a0e0] active:translate-y-0.5 active:border-b-2 transition"
                >
                  <span>Go to Learn Path</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] space-y-1.5">
                <div className="text-[#58cc02] font-black text-sm uppercase">100% Free</div>
                <p className="text-xs text-[#afafaf] font-semibold">
                  Free language education tools designed for teachers and classrooms worldwide.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] space-y-1.5">
                <div className="text-[#ffc800] font-black text-sm uppercase">Track Progress</div>
                <p className="text-xs text-[#afafaf] font-semibold">
                  Detailed dashboards showing lesson completions, streaks, and skill mastery.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1a2c35] border-2 border-[#37464f] space-y-1.5">
                <div className="text-[#1cb0f6] font-black text-sm uppercase">Gamified Habits</div>
                <p className="text-xs text-[#afafaf] font-semibold">
                  Keep students motivated and excited to learn outside the classroom.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
