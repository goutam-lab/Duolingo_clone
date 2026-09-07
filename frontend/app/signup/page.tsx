"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { ArrowRight, Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUser = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUser || !cleanEmail || !password) {
      setError("All fields are required.");
      return;
    }

    if (cleanUser.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUser)) {
      setError("Username may only contain letters, numbers, hyphens, and underscores.");
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.signup({
        username: cleanUser,
        email: cleanEmail,
        password,
      });

      // New users must complete onboarding
      router.push("/onboarding");
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
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
          Create your profile
        </h1>
        <p className="text-sm font-bold text-duo-gray-400 text-center mb-6">
          Join millions of language learners today
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
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-duo-gray-300" />
              <input
                id="signup-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a cool handle"
                className="w-full pl-12 pr-4 py-3.5 bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl text-duo-gray-800 font-bold placeholder:text-duo-gray-300 focus:outline-none focus:border-duo-blue focus:bg-white transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-duo-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-duo-gray-300" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl text-duo-gray-800 font-bold placeholder:text-duo-gray-300 focus:outline-none focus:border-duo-blue focus:bg-white transition-colors"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-duo-gray-400 uppercase tracking-wider mb-2">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-duo-gray-300" />
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl text-duo-gray-800 font-bold placeholder:text-duo-gray-300 focus:outline-none focus:border-duo-blue focus:bg-white transition-colors"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            id="signup-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-duo-green hover:bg-[#52be02] text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_4px_0_#46a302] hover:shadow-[0_2px_0_#46a302] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                CREATE ACCOUNT
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center">
        <p className="text-sm font-bold text-duo-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-duo-blue hover:text-duo-blue/80 underline font-extrabold ml-1"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
