"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  Search,
  ChevronDown,
  BookOpen,
  Heart,
  Flame,
  Trophy,
  Users,
  Sparkles,
  Mail,
  ExternalLink,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { UserMeResponse } from "@/types/api";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/ui/LoadingState";

interface FaqItem {
  question: string;
  answer: string;
  category: "basics" | "hearts" | "streaks" | "leaderboard" | "friends";
}

const FAQS: FaqItem[] = [
  {
    category: "basics",
    question: "How does Lingua teach languages?",
    answer:
      "Lingua uses gamified, bite-sized lessons focused on active recall, spaced repetition, and varied exercise formats including translations, matching pairs, fill-in-the-blank, and word bank exercises.",
  },
  {
    category: "basics",
    question: "What exercise types are supported?",
    answer:
      "Lingua supports six interactive exercise formats: Multiple Choice, Sentence Translation, Word Bank assembly, Matching Pairs, Fill-in-the-Blank, and Type-Your-Answer.",
  },
  {
    category: "hearts",
    question: "How do Hearts work?",
    answer:
      "You start each day with 5 Hearts. Answering an exercise incorrectly consumes 1 Heart. When you run out of hearts, you can refill them instantly in the Companion Sidebar or upgrade to Super Lingua for unlimited hearts.",
  },
  {
    category: "hearts",
    question: "Can I refill my Hearts for free?",
    answer:
      "Yes! Click on the Hearts icon in the top right sidebar or your lesson drawer to refill your hearts to maximum whenever you need a quick boost.",
  },
  {
    category: "streaks",
    question: "How do I maintain my streak?",
    answer:
      "Complete at least one lesson or reach your daily XP goal before midnight each day. Consistent practice keeps your streak flame burning!",
  },
  {
    category: "streaks",
    question: "Where can I configure my daily XP goal?",
    answer:
      "Go to Settings > Daily Goal to choose between Casual (10 XP), Regular (20 XP), Serious (30 XP), or Intense (50 XP) daily targets.",
  },
  {
    category: "leaderboard",
    question: "How do Leagues and Leaderboards work?",
    answer:
      "Once you complete your first 3 lessons, you unlock the Weekly League! You compete against learners based on XP earned. The top 10 learners at the end of each weekly cycle advance to the next league.",
  },
  {
    category: "leaderboard",
    question: "Why does the leaderboard reset?",
    answer:
      "Leaderboard rankings run on a 7-day competitive cycle to give everyone a fresh opportunity to climb the ranks and earn promotional medals.",
  },
  {
    category: "friends",
    question: "How do I add and follow friends?",
    answer:
      "Click 'Friends' in the sidebar or navigate to the Friends tab. Use the search bar to find learners by their username and click '+ ADD' to send them a friend request.",
  },
  {
    category: "friends",
    question: "Can I cancel a friend request?",
    answer:
      "Yes! In the Friends tab under 'Sent requests', click the 'Cancel' button beside any pending invitation to revoke it immediately.",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Questions", icon: HelpCircle },
  { key: "basics", label: "Learning", icon: BookOpen },
  { key: "hearts", label: "Hearts", icon: Heart },
  { key: "streaks", label: "Streaks", icon: Flame },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
  { key: "friends", label: "Friends", icon: Users },
];

export default function HelpPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

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

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FAQS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleHeartsRefilled = (newHearts: number) => {
    if (user) {
      setUser({ ...user, hearts: newHearts });
    }
  };

  return (
    <AppShell user={user} onHeartsRefilled={handleHeartsRefilled}>
      <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {isLoading && <LoadingState />}

        {!isLoading && (
          <>
            {/* Hero Header */}
            <header className="p-6 rounded-3xl bg-linear-to-br from-[#1a2c35] via-[#1e3440] to-[#14232b] border-2 border-[#37464f] shadow-lg relative overflow-hidden flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#58cc02]/20 border-2 border-[#58cc02] flex items-center justify-center text-[#58cc02] shadow-md shadow-[#58cc02]/20">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  How can we help?
                </h1>
                <p className="text-xs sm:text-sm text-[#afafaf] font-semibold max-w-md">
                  Find answers to common questions about exercises, hearts, streaks, and leaderboards.
                </p>
              </div>

              {/* Search Box */}
              <div className="w-full max-w-md relative mt-2">
                <Search className="w-4 h-4 text-[#afafaf] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles or topics..."
                  className="w-full bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl pl-10 pr-4 py-2.5 text-sm font-semibold text-white outline-none placeholder:text-[#6a7c86] transition"
                />
              </div>
            </header>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setExpandedIndex(null);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap border-2 transition ${
                      isSelected
                        ? "bg-[#1cb0f6]/15 border-[#1cb0f6] text-[#1cb0f6]"
                        : "bg-[#1a2c35] border-[#37464f] text-[#afafaf] hover:text-white hover:border-[#4a5b66]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* FAQ Accordion List */}
            <section className="space-y-2.5">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center bg-[#1a2c35] border-2 border-[#37464f] rounded-2xl text-[#afafaf]">
                  <HelpCircle className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                  <p className="font-bold">No results found for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for different terms or browse categories above.
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isOpen = expandedIndex === index;
                  return (
                    <div
                      key={faq.question}
                      className="rounded-2xl border-2 border-[#37464f] bg-[#1a2c35] overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left font-black text-sm text-white hover:bg-[#1f3540] transition-colors"
                      >
                        <span className="pr-4">{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#afafaf] transition-transform duration-200 shrink-0 ${
                            isOpen ? "rotate-180 text-[#1cb0f6]" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#cfd8dd] leading-relaxed border-t border-[#2b3d48] bg-[#15232a]/70">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </section>

            {/* Quick Contact & Support Card */}
            <section
              aria-label="Support Assistance"
              className="p-5 rounded-3xl bg-[#1a2c35] border-2 border-[#37464f] flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-11 h-11 rounded-2xl bg-[#ff9600]/15 border border-[#ff9600]/40 flex items-center justify-center text-[#ff9600] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Still have questions?</h3>
                  <p className="text-xs text-[#afafaf] font-semibold">
                    We&apos;re here to help you get the most out of your learning journey.
                  </p>
                </div>
              </div>
              <a
                href="mailto:support@lingua.app"
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#58cc02] border-b-4 border-[#46a302] text-xs font-black uppercase tracking-wider text-[#131f24] hover:bg-[#4ebb02] active:translate-y-0.5 active:border-b-2 transition"
              >
                <span>Contact Support</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
