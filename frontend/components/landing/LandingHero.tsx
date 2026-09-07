"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Trophy,
  Users,
  Brain,
  ShieldCheck,
  Globe2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  learners: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "es", name: "Spanish", flag: "🇪🇸", learners: "42M learners" },
  { code: "fr", name: "French", flag: "🇫🇷", learners: "28M learners" },
  { code: "de", name: "German", flag: "🇩🇪", learners: "19M learners" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", learners: "16M learners" },
  { code: "it", name: "Italian", flag: "🇮🇹", learners: "11M learners" },
  { code: "ko", name: "Korean", flag: "🇰🇷", learners: "13M learners" },
];

export function LandingHero() {
  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col font-sans selection:bg-[#58cc02] selection:text-black">
      {/* Top Navbar */}
      <header className="w-full border-b border-[#23353e] bg-[#131f24]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-[#58cc02] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_3px_0_#46a302] group-hover:scale-105 transition-transform">
              🦉
            </div>
            <span className="text-2xl font-black tracking-tight text-[#58cc02]">
              duolingo
            </span>
          </Link>

          {/* Nav Right */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5 rounded-lg border border-[#23353e]">
              <Globe2 className="w-3.5 h-3.5 text-[#1cb0f6]" />
              <span>English</span>
            </div>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-bold tracking-wider uppercase text-[#1cb0f6] border-2 border-[#23353e] hover:border-[#1cb0f6]/60 hover:bg-[#1a2c35] transition-all"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex-1 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {/* Left Column: Mascot Artwork */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Soft glow behind mascot */}
              <div className="absolute inset-0 bg-[#58cc02]/15 rounded-full blur-3xl animate-pulse" />

              {/* Duo Mascot SVG / Character Graphic */}
              <div className="relative z-10 flex flex-col items-center select-none transform hover:scale-105 transition-transform duration-300">
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-b from-[#58cc02] to-[#46a302] rounded-[48px] shadow-[0_12px_0_#388402] border-4 border-[#61e002] flex flex-col items-center justify-center p-4 relative">
                  {/* Ears */}
                  <div className="absolute -top-3 left-6 w-8 h-8 bg-[#58cc02] rounded-t-xl rotate-[-15deg] border-t-4 border-l-4 border-[#61e002]" />
                  <div className="absolute -top-3 right-6 w-8 h-8 bg-[#58cc02] rounded-t-xl rotate-[15deg] border-t-4 border-r-4 border-[#61e002]" />

                  {/* Eyes Container */}
                  <div className="flex items-center gap-3 mt-2">
                    {/* Left Eye */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white rounded-full flex items-center justify-center shadow-inner border-2 border-gray-200">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1a2c35] rounded-full flex items-start justify-end p-1">
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      </div>
                    </div>
                    {/* Right Eye */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white rounded-full flex items-center justify-center shadow-inner border-2 border-gray-200">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1a2c35] rounded-full flex items-start justify-end p-1">
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Beak */}
                  <div className="w-9 h-7 bg-[#ff9600] rounded-b-2xl shadow-[0_3px_0_#d87a00] border-t-2 border-[#ffb340] -mt-1 z-20" />

                  {/* Belly Feathers Pattern */}
                  <div className="flex items-center gap-2 mt-4 opacity-70">
                    <div className="w-3 h-3 bg-[#46a302] rounded-full" />
                    <div className="w-3.5 h-3.5 bg-[#46a302] rounded-full" />
                    <div className="w-3 h-3 bg-[#46a302] rounded-full" />
                  </div>
                </div>

                {/* Feet */}
                <div className="flex items-center gap-12 -mt-2 z-0">
                  <div className="w-10 h-5 bg-[#ff9600] rounded-full shadow-[0_3px_0_#d87a00]" />
                  <div className="w-10 h-5 bg-[#ff9600] rounded-full shadow-[0_3px_0_#d87a00]" />
                </div>
              </div>

              {/* Floating Gamification Pill */}
              <div className="absolute bottom-2 -left-2 sm:left-4 z-20 bg-[#1a2c35] border border-[#23353e] shadow-xl px-3.5 py-2 rounded-2xl flex items-center gap-2.5 animate-bounce">
                <span className="text-xl">🔥</span>
                <div className="text-left">
                  <div className="text-[10px] font-black tracking-wider uppercase text-gray-400">
                    Daily Streak
                  </div>
                  <div className="text-sm font-black text-[#ff9600]">
                    7 Days Strong!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Headline & Action CTAs */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a2c35] border border-[#23353e] text-xs font-bold text-[#58cc02] uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Interactive Learning</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-5">
              The free, fun, and effective way to learn a language!
            </h1>

            <p className="text-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
              Bite-sized lessons, real-time gamification, interactive exercise types,
              and competitive weekly leaderboards designed to help you stay committed.
            </p>

            {/* Primary Action Buttons */}
            <div className="w-full sm:w-80 flex flex-col gap-3.5">
              <Link
                href="/signup"
                className="w-full py-4 px-6 rounded-2xl bg-[#58cc02] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 border-b-4 border-[#46a302] text-black font-black text-center text-base tracking-wider uppercase transition-all shadow-lg shadow-[#58cc02]/20 flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </Link>

              <Link
                href="/login"
                className="w-full py-4 px-6 rounded-2xl bg-[#1a2c35] hover:bg-[#223743] active:translate-y-1 active:border-b-0 border-b-4 border-[#131f24] border-t border-l border-r border-[#23353e] text-[#1cb0f6] font-black text-center text-base tracking-wider uppercase transition-all"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Languages Banner */}
        <section className="w-full border-t border-b border-[#23353e] bg-[#1a2c35]/40 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Available Courses & Paths
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {LANGUAGES.map((lang) => (
                <Link
                  key={lang.code}
                  href="/signup"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#131f24] border border-[#23353e] hover:border-[#58cc02] hover:scale-105 transition-all group"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className="text-sm font-bold group-hover:text-[#58cc02] transition-colors">
                      {lang.name}
                    </div>
                    <div className="text-[10px] text-gray-400 font-semibold">
                      {lang.learners}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Why you’ll love learning with us
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Engineered with proven learning psychology, instant feedback, and gamified mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#1a2c35] border border-[#23353e] rounded-3xl p-6 flex flex-col items-start hover:border-[#58cc02]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#58cc02]/15 border border-[#58cc02]/30 flex items-center justify-center text-[#58cc02] mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-2">
                Bite-sized Lessons
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Short, effective exercises for reading, writing, and speaking that fit into your day.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1a2c35] border border-[#23353e] rounded-3xl p-6 flex flex-col items-start hover:border-[#ff9600]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#ff9600]/15 border border-[#ff9600]/30 flex items-center justify-center text-[#ff9600] mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-2">
                Habit-Forming Streaks
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Build an unstoppable daily habit. Earn freezes, avoid heart depletion, and stay on track.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1a2c35] border border-[#23353e] rounded-3xl p-6 flex flex-col items-start hover:border-[#ffc800]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#ffc800]/15 border border-[#ffc800]/30 flex items-center justify-center text-[#ffc800] mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-2">
                Live Leaderboards
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Climb the ranks from Bronze to Diamond league against active language enthusiasts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#1a2c35] border border-[#23353e] rounded-3xl p-6 flex flex-col items-start hover:border-[#1cb0f6]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#1cb0f6]/15 border border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6] mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-2">
                Friends & Quests
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Search friends, send requests, celebrate streak milestones, and complete daily quests.
              </p>
            </div>
          </div>
        </section>

        {/* Pre-Seeded Demo Credentials Callout */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 w-full">
          <div className="bg-gradient-to-r from-[#1a2c35] to-[#131f24] border-2 border-[#23353e] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2 text-[#58cc02] font-black text-sm uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Assignment & Reviewer Quick Demo</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-2">
                Ready to explore with pre-seeded data?
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-lg">
                Log in instantly using the demo learner credentials or create your own fresh account.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-mono bg-[#131f24] px-3 py-1.5 rounded-xl border border-[#23353e] text-gray-300">
                <span>Username: <strong className="text-white">learner</strong></span>
                <span className="text-gray-600">|</span>
                <span>Password: <strong className="text-white">password123</strong></span>
              </div>
            </div>

            <Link
              href="/login"
              className="px-6 py-3 rounded-2xl bg-[#1cb0f6] hover:bg-[#20b8ff] active:translate-y-0.5 border-b-4 border-[#148ec7] text-white font-black text-sm uppercase tracking-wider whitespace-nowrap shadow-md"
            >
              Sign In to Demo
            </Link>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="w-full bg-[#1a2c35]/70 border-t border-[#23353e] py-14 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
              Start learning a language today.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-md">
              Join over millions of learners worldwide. Completely free, gamified, and fun.
            </p>
            <Link
              href="/signup"
              className="w-full sm:w-72 py-4 px-6 rounded-2xl bg-[#58cc02] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 border-b-4 border-[#46a302] text-black font-black text-center text-base tracking-wider uppercase transition-all shadow-xl"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#23353e] bg-[#131f24] py-8 text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🦉</span>
            <span className="font-bold text-gray-300">Duolingo Full-Stack Architecture</span>
          </div>
          <div>
            Built with Next.js, FastAPI, and SQLAlchemy.
          </div>
        </div>
      </footer>
    </div>
  );
}
