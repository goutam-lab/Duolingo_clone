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
    <div className="min-h-screen bg-duo-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Top Brand Bar */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-12 h-12 bg-duo-green rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-[0_4px_0_#46a302]">
          🦉
        </div>
        <span className="text-3xl font-extrabold tracking-wider text-duo-green">
          duolingo
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-duo-gray-200 shadow-xl p-8 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-duo-gray-800 text-center mb-2">
          Log in to your account
        </h1>
        <p className="text-sm font-bold text-duo-gray-400 text-center mb-6">
          Resume your streak and continue learning
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 text-red-600 text-sm font-bold animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-duo-gray-400 uppercase tracking-wider mb-2">
              Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-duo-gray-300" />
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="learner or you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl text-duo-gray-800 font-bold placeholder:text-duo-gray-300 focus:outline-none focus:border-duo-blue focus:bg-white transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-duo-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-duo-gray-300" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl text-duo-gray-800 font-bold placeholder:text-duo-gray-300 focus:outline-none focus:border-duo-blue focus:bg-white transition-colors"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-duo-green hover:bg-[#52be02] text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_4px_0_#46a302] hover:shadow-[0_2px_0_#46a302] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
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
        <div className="mt-6 pt-6 border-t-2 border-duo-gray-100 flex flex-col items-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="px-4 py-2 bg-duo-blue/10 hover:bg-duo-blue/20 text-duo-blue rounded-xl font-extrabold text-xs tracking-wider transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            FILL DEMO CREDENTIALS (LEARNER)
          </button>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center">
        <p className="text-sm font-bold text-duo-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-duo-blue hover:text-duo-blue/80 underline font-extrabold ml-1"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
