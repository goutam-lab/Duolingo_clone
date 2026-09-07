"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { Sparkles, ArrowRight, Lock, User, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.login({
        username_or_email: identifier.trim(),
        password,
      });

      if (!res.onboarding_completed) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setIdentifier("learner");
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      {/* Top Brand Bar */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-[#58cc02] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_0_#46a302]">
          🦉
        </div>
        <span className="text-3xl font-black tracking-wider text-[#58cc02]">
          duolingo
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#1a2c35] rounded-3xl border-2 border-[#2b3d48] shadow-2xl p-8 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-black text-white text-center mb-2">
          Log in to your account
        </h1>
        <p className="text-sm font-bold text-slate-400 text-center mb-6">
          Resume your streak and continue learning
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border-2 border-red-500/40 rounded-2xl flex items-start gap-3 text-red-300 text-sm font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="learner or you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-[#131f24] border-2 border-[#2b3d48] rounded-2xl text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-[#1cb0f6] focus:bg-[#16252d] transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-[#131f24] border-2 border-[#2b3d48] rounded-2xl text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-[#1cb0f6] focus:bg-[#16252d] transition-colors"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-[#58cc02] hover:bg-[#61e002] text-white font-black text-base tracking-wider rounded-2xl shadow-[0_4px_0_#46a302] hover:shadow-[0_2px_0_#46a302] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                LOG IN
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper */}
        <div className="mt-6 pt-6 border-t-2 border-[#2b3d48] flex flex-col items-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="px-4 py-2.5 bg-[#1cb0f6]/15 hover:bg-[#1cb0f6]/25 border border-[#1cb0f6]/40 text-[#1cb0f6] rounded-xl font-black text-xs tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            FILL DEMO CREDENTIALS (LEARNER)
          </button>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center">
        <p className="text-sm font-bold text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#1cb0f6] hover:underline font-black ml-1"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
