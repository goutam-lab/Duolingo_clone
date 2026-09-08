"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Target,
  Volume2,
  Sparkles,
  LogOut,
  Check,
  ChevronRight,
  Flame,
  Zap,
  Sun,
  Moon,
  Monitor,
  Palette,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse } from "@/types/api";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { usePreferences } from "@/context/PreferencesContext";
import { soundEffects } from "@/lib/sound";

interface GoalOption {
  xp: number;
  label: string;
  desc: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  { xp: 10, label: "Casual", desc: "1 lesson per day" },
  { xp: 20, label: "Regular", desc: "2 lessons per day" },
  { xp: 30, label: "Serious", desc: "3 lessons per day" },
  { xp: 50, label: "Intense", desc: "5 lessons per day" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  // Global preferences hook
  const {
    soundEnabled,
    animationsEnabled,
    motivationalEnabled,
    theme,
    setSoundEnabled,
    setAnimationsEnabled,
    setMotivationalEnabled,
    setTheme,
  } = usePreferences();

  const showToast = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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
      setError(err instanceof Error ? err.message : "Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleGoalChange = async (newGoalXp: number) => {
    if (!user || user.daily_goal_xp === newGoalXp || isSavingGoal) return;
    setIsSavingGoal(true);
    try {
      const updated = await apiClient.updateSettings({ daily_goal_xp: newGoalXp });
      setUser(updated);
      soundEffects.playCorrect();
      showToast("Daily goal updated!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update daily goal.");
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    showToast(`Sound effects ${next ? "enabled" : "disabled"}`);
  };

  const handleToggleAnimations = () => {
    const next = !animationsEnabled;
    setAnimationsEnabled(next);
    soundEffects.playClick();
    showToast(`Animations ${next ? "enabled" : "disabled"}`);
  };

  const handleToggleMotivational = () => {
    const next = !motivationalEnabled;
    setMotivationalEnabled(next);
    soundEffects.playClick();
    showToast(`Motivational messages ${next ? "enabled" : "disabled"}`);
  };

  const handleSelectTheme = (selectedTheme: "dark" | "light") => {
    setTheme(selectedTheme);
    showToast(`${selectedTheme === "light" ? "Light" : "Dark"} mode activated`);
  };

  const handleLogout = async () => {
    soundEffects.playClick();
    try {
      await apiClient.logout();
    } catch {
      // Ignored
    }
    router.push("/login");
  };

  const handleHeartsRefilled = (newHearts: number) => {
    if (user) {
      setUser({ ...user, hearts: newHearts });
    }
  };

  return (
    <AppShell user={user} onHeartsRefilled={handleHeartsRefilled}>
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {isLoading && <LoadingState />}

        {!isLoading && error && !user && (
          <ErrorState message={error} onRetry={loadUser} />
        )}

        {!isLoading && user && (
          <>
            {/* Header */}
            <header className="flex items-center gap-3.5 pb-2">
              <div className="w-11 h-11 rounded-2xl bg-[#1cb0f6]/15 border border-[#1cb0f6]/40 flex items-center justify-center text-[#1cb0f6] shadow-sm">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">Settings</h1>
                <p className="text-xs text-[#afafaf] font-semibold">
                  Manage your account, appearance, and learning preferences.
                </p>
              </div>
            </header>

            {saveMessage && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#58cc02]/15 border-2 border-[#58cc02]/40 text-[#58cc02] text-xs font-black uppercase tracking-wider animate-in fade-in">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{saveMessage}</span>
              </div>
            )}

            {/* Account Card */}
            <section
              aria-label="Account Overview"
              className="p-5 rounded-3xl bg-[#1a2c35] border-2 border-[#37464f] space-y-4"
            >
              <div className="flex items-center gap-2.5 text-[#1cb0f6] font-black text-xs uppercase tracking-wider">
                <UserIcon className="w-4 h-4" />
                <span>Account</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#131f24] border-2 border-[#37464f] flex items-center justify-center text-xl font-black text-[#58cc02] select-none">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-black text-lg text-white truncate">{user.username}</div>
                  <div className="text-xs text-[#afafaf] font-semibold truncate">{user.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-[#131f24] border border-[#2b3d48] flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#ffc800] fill-[#ffc800]" />
                  <div>
                    <div className="text-[11px] font-black uppercase text-[#afafaf]">Total XP</div>
                    <div className="text-base font-black text-white">{user.total_xp.toLocaleString()}</div>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#131f24] border border-[#2b3d48] flex items-center gap-3">
                  <Flame className="w-5 h-5 text-[#ff9600] fill-[#ff9600]" />
                  <div>
                    <div className="text-[11px] font-black uppercase text-[#afafaf]">Streak</div>
                    <div className="text-base font-black text-white">{user.current_streak} days</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Appearance / Theme Section */}
            <section
              aria-label="Appearance Theme"
              className="p-5 rounded-3xl bg-[#1a2c35] border-2 border-[#37464f] space-y-4"
            >
              <div className="flex items-center gap-2.5 text-[#ce82ff] font-black text-xs uppercase tracking-wider">
                <Palette className="w-4 h-4" />
                <span>Appearance</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Dark Mode Option */}
                <button
                  type="button"
                  onClick={() => handleSelectTheme("dark")}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all cursor-pointer ${
                    theme === "dark"
                      ? "bg-[#131f24] border-[#1cb0f6] shadow-md ring-2 ring-[#1cb0f6]/20"
                      : "bg-[#131f24]/50 border-[#2b3d48] hover:border-slate-500 opacity-70"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1a2c35] border border-[#37464f] flex items-center justify-center text-[#1cb0f6]">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-sm text-white flex items-center justify-center gap-1.5">
                      <span>Dark Theme</span>
                      {theme === "dark" && <Check className="w-3.5 h-3.5 text-[#1cb0f6] stroke-[3]" />}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                      Sleek & high contrast
                    </div>
                  </div>
                </button>

                {/* Light Mode Option */}
                <button
                  type="button"
                  onClick={() => handleSelectTheme("light")}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all cursor-pointer ${
                    theme === "light"
                      ? "bg-[#ffffff] border-[#1cb0f6] shadow-md ring-2 ring-[#1cb0f6]/20"
                      : "bg-[#131f24]/50 border-[#2b3d48] hover:border-slate-500 opacity-70"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ffc800]/15 border border-[#ffc800]/30 flex items-center justify-center text-[#ffc800]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-sm text-white flex items-center justify-center gap-1.5">
                      <span>Light Theme</span>
                      {theme === "light" && <Check className="w-3.5 h-3.5 text-[#1cb0f6] stroke-[3]" />}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                      Vibrant & daytime friendly
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* Daily Goal Target */}
            <section
              aria-label="Daily Goal"
              className="p-5 rounded-3xl bg-[#1a2c35] border-2 border-[#37464f] space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#ffc800] font-black text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4" />
                  <span>Daily Goal</span>
                </div>
                <span className="text-[11px] font-bold text-[#afafaf]">
                  Current: {user.daily_goal_xp} XP / day
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GOAL_OPTIONS.map((opt) => {
                  const isSelected = user.daily_goal_xp === opt.xp;
                  return (
                    <button
                      key={opt.xp}
                      type="button"
                      disabled={isSavingGoal}
                      onClick={() => handleGoalChange(opt.xp)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1cb0f6]/15 border-[#1cb0f6] shadow-sm"
                          : "bg-[#131f24]/70 border-[#2b3d48] hover:border-[#37464f] hover:bg-[#131f24]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white">{opt.label}</span>
                          <span className="text-xs font-black text-[#ffc800]">{opt.xp} XP</span>
                        </div>
                        <div className="text-[11px] font-semibold text-[#afafaf] mt-0.5">
                          {opt.desc}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-[#1cb0f6] bg-[#1cb0f6] text-white"
                            : "border-[#37464f]"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Sound & Learning Preferences */}
            <section
              aria-label="App Preferences"
              className="p-5 rounded-3xl bg-[#1a2c35] border-2 border-[#37464f] space-y-4"
            >
              <div className="flex items-center gap-2.5 text-[#58cc02] font-black text-xs uppercase tracking-wider">
                <Volume2 className="w-4 h-4" />
                <span>Preferences</span>
              </div>

              <div className="space-y-3">
                {/* Sound Effects */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#131f24]/70 border border-[#2b3d48]">
                  <div>
                    <div className="font-black text-sm text-white">Sound Effects</div>
                    <div className="text-[11px] font-semibold text-[#afafaf]">
                      Play sounds for correct answers, exercises, and completions
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    role="switch"
                    aria-checked={soundEnabled}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                      soundEnabled ? "bg-[#58cc02]" : "bg-[#37464f]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        soundEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Animations */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#131f24]/70 border border-[#2b3d48]">
                  <div>
                    <div className="font-black text-sm text-white">Animations</div>
                    <div className="text-[11px] font-semibold text-[#afafaf]">
                      Enable rich celebration and transition effects
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleAnimations}
                    role="switch"
                    aria-checked={animationsEnabled}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                      animationsEnabled ? "bg-[#58cc02]" : "bg-[#37464f]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        animationsEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Motivational Messages */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#131f24]/70 border border-[#2b3d48]">
                  <div>
                    <div className="font-black text-sm text-white">Motivational Messages</div>
                    <div className="text-[11px] font-semibold text-[#afafaf]">
                      Show encouraging remarks after practice rounds
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleMotivational}
                    role="switch"
                    aria-checked={motivationalEnabled}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                      motivationalEnabled ? "bg-[#58cc02]" : "bg-[#37464f]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        motivationalEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* Subscription Card */}
            <section
              aria-label="Super Lingua Membership"
              className="p-5 rounded-3xl bg-linear-to-br from-[#1a2c35] to-[#1d1f38] border-2 border-[#7c6aff]/40 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#7c6aff]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Super Lingua</span>
                </div>
                <h3 className="font-black text-base text-white">Fast-track your learning</h3>
                <p className="text-xs text-[#cfd8dd] font-semibold max-w-sm">
                  Unlimited hearts, progress tracking, and zero ads to keep you focused.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  router.push("/shop");
                }}
                className="shrink-0 flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-[#5454ff] border-b-4 border-[#3b3be6] active:translate-y-0.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#4d4dff] transition cursor-pointer"
              >
                <span>View</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </section>

            {/* Logout Section */}
            <section className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#37464f]/60">
              <span className="text-xs font-semibold text-[#afafaf]">
                Signed in as <strong className="text-white">{user.username}</strong>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ff4b4b]/15 border border-[#ff4b4b]/30 text-[#ff4b4b] hover:bg-[#ff4b4b]/25 active:translate-y-0.5 text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
