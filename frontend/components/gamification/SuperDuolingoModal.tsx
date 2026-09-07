"use client";

import React, { useState } from "react";
import { X, Check, Sparkles, Heart, Shield, Zap, Crown, Star } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface SuperDuolingoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateTrial: () => Promise<void>;
  isActivating?: boolean;
}

const SuperGradientOwl = () => (
  <svg width="180" height="160" viewBox="0 0 170 140" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="modalRainbow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1adfff"/>
        <stop offset="35%" stopColor="#7b6bff"/>
        <stop offset="65%" stopColor="#d16bff"/>
        <stop offset="100%" stopColor="#ff628e"/>
      </linearGradient>
      <linearGradient id="modalHead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7ceaff"/>
        <stop offset="55%" stopColor="#9b79ff"/>
        <stop offset="100%" stopColor="#ff77b6"/>
      </linearGradient>
      <radialGradient id="modalBody" cx="50%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#8be4ff"/>
        <stop offset="50%" stopColor="#9f82ff"/>
        <stop offset="100%" stopColor="#ff73b3"/>
      </radialGradient>
    </defs>

    <circle cx="20" cy="22" r="3" fill="#ff77b6" opacity="0.85"/>
    <circle cx="12" cy="58" r="2.2" fill="#7ceaff" opacity="0.9"/>
    <circle cx="150" cy="20" r="2.8" fill="#9f82ff" opacity="0.95"/>
    <circle cx="158" cy="60" r="2" fill="#8be4ff" opacity="0.85"/>
    <circle cx="82" cy="10" r="2.5" fill="#ffc800" opacity="0.85"/>

    <path d="M46 40 L34 12 L64 34 Z" fill="url(#modalHead)" stroke="#5a3bd1" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M118 40 L130 12 L100 34 Z" fill="url(#modalHead)" stroke="#5a3bd1" strokeWidth="1.4" strokeLinejoin="round"/>
    <ellipse cx="82" cy="56" rx="46" ry="42" fill="url(#modalHead)"/>
    <path d="M34 76 C 26 92, 32 116, 44 126 L 54 106 C 44 94, 42 84, 48 74 Z" fill="#7b4cd9" stroke="#4a2dbb" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M130 76 C 138 92, 132 116, 120 126 L 110 106 C 120 94, 122 84, 116 74 Z" fill="#c24a9a" stroke="#8a2f6a" strokeWidth="1.6" strokeLinejoin="round"/>
    <ellipse cx="82" cy="100" rx="34" ry="30" fill="url(#modalBody)" stroke="#5a3bd1" strokeWidth="1.4"/>
    <ellipse cx="82" cy="60" rx="34" ry="26" fill="#e8faff" opacity="0.75"/>

    <circle cx="66" cy="54" r="16" fill="#ffffff" stroke="#3b279a" strokeWidth="2"/>
    <circle cx="68.5" cy="56" r="8.5" fill="#0d0255"/>
    <circle cx="71.5" cy="52.5" r="2.8" fill="#fff"/>

    <circle cx="98" cy="54" r="16" fill="#ffffff" stroke="#3b279a" strokeWidth="2"/>
    <path d="M 84 54 Q 98 62 112 54" stroke="#0d0255" strokeWidth="4.5" fill="none" strokeLinecap="round"/>

    <path d="M72 70 L 92 70 L 82 84 Z" fill="#ffa93c" stroke="#c55c00" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M70 92 Q 82 100 94 92" stroke="#3b279a" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85"/>
  </svg>
);

const benefits = [
  {
    icon: Heart,
    title: "Unlimited Hearts",
    description: "Never worry about losing hearts again. Keep practicing without limits.",
    color: "text-[#ff4b4b]",
    bg: "bg-[#ff4b4b]/15 border-[#ff4b4b]/30",
  },
  {
    icon: Zap,
    title: "No Ads",
    description: "100% ad-free learning experience. Pure focus, pure progress.",
    color: "text-[#ffc800]",
    bg: "bg-[#ffc800]/15 border-[#ffc800]/30",
  },
  {
    icon: Star,
    title: "Personalized Practice",
    description: "Tailored review sessions crafted just for you to stay sharp.",
    color: "text-[#1cb0f6]",
    bg: "bg-[#1cb0f6]/15 border-[#1cb0f6]/30",
  },
  {
    icon: Crown,
    title: "Unlimited Legendary",
    description: "Take on as many Legendary challenges as you can handle.",
    color: "text-[#d16bff]",
    bg: "bg-[#d16bff]/15 border-[#d16bff]/30",
  },
  {
    icon: Shield,
    title: "Streak Protection",
    description: "Free Streak Freezes every month. Protect your hard-earned streak.",
    color: "text-[#58cc02]",
    bg: "bg-[#58cc02]/15 border-[#58cc02]/30",
  },
];

const plans = [
  {
    id: "weekly",
    label: "Weekly",
    price: "4.99",
    period: "/week",
    highlight: false,
  },
  {
    id: "monthly",
    label: "Monthly",
    price: "12.99",
    period: "/mo",
    highlight: false,
  },
  {
    id: "annual",
    label: "Annual",
    price: "79.99",
    period: "/year",
    highlight: true,
    saveLabel: "Save 60%",
  },
];

export const SuperDuolingoModal: React.FC<SuperDuolingoModalProps> = ({
  isOpen,
  onClose,
  onActivateTrial,
  isActivating = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("annual");
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="super-modal-title"
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative w-full max-w-[560px] max-h-[92dvh] overflow-y-auto rounded-3xl bg-[#131f24] border-2 border-[#37464f] shadow-2xl"
          >
            <div
              className="absolute inset-x-0 top-0 h-52 rounded-t-[22px] opacity-50 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(124,106,255,0.35) 0%, rgba(255,103,156,0.1) 55%, transparent 100%)",
              }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-xl bg-[#1a2c35]/70 hover:bg-[#233743] border border-[#37464f] text-[#afafaf] hover:text-white flex items-center justify-center"
              aria-label="Close Super Duolingo promo"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="relative px-5 pt-5 pb-6 sm:px-6 sm:pt-6 sm:pb-7">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffc800]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white/85">
                    Limited Time Offer
                  </span>
                </div>

                <h2
                  id="super-modal-title"
                  className="text-2xl sm:text-[28px] font-black tracking-tight text-white leading-tight mt-1"
                >
                  Try Super Duolingo
                  <span
                    className="block mt-1 bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #1adfff 0%, #7b6bff 40%, #d16bff 70%, #ff628e 100%)",
                    }}
                  >
                    free for 7 days
                  </span>
                </h2>

                <p className="mt-2 text-[13px] sm:text-sm text-[#cfd8dd] leading-relaxed max-w-md font-semibold">
                  No ads, unlimited hearts, and legendary challenges. Cancel anytime.
                </p>

                <div className="mt-1 -mb-2">
                  <SuperGradientOwl />
                </div>
              </div>

              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {benefits.map(({ icon: Icon, title, description, color, bg }) => (
                  <div
                    key={title}
                    className={`flex items-start gap-3 p-3 rounded-2xl border-2 ${bg}`}
                  >
                    <div className={`shrink-0 mt-0.5 ${color}`}>
                      <Icon className="w-4.5 h-4.5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-[13px] text-white leading-tight">
                        {title}
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-[#aab5bc] leading-relaxed">
                        {description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all ${
                      selectedPlan === plan.id
                        ? "bg-[#5454ff]/10 border-[#5454ff] shadow-md shadow-[#5454ff]/10"
                        : "bg-[#1a2c35] border-[#2b3d48] hover:border-[#37464f]"
                    }`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-2.5 left-4 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#58cc02] text-[#131f24] border-2 border-[#131f24]">
                        {plan.saveLabel}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selectedPlan === plan.id
                            ? "bg-[#5454ff] border-[#5454ff]"
                            : "border-[#37464f]"
                        }`}
                      >
                        {selectedPlan === plan.id && (
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        )}
                      </span>
                      <span className="font-black text-sm text-white">{plan.label}</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[11px] font-bold text-[#aab5bc]">$</span>
                      <span className="font-black text-lg text-white leading-none">
                        {plan.price}
                      </span>
                      <span className="text-[11px] font-bold text-[#aab5bc]">
                        {plan.period}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <motion.button
                type="button"
                onClick={onActivateTrial}
                disabled={isActivating}
                whileHover={shouldReduceMotion || isActivating ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion || isActivating ? undefined : { y: 2 }}
                className="mt-5 w-full py-3.5 px-5 rounded-2xl bg-[#5454ff] border-b-4 border-[#3b3be6] hover:brightness-110 active:border-b-2 font-black text-[13px] sm:text-sm uppercase tracking-[0.14em] text-white shadow-[0_6px_0_#2a2ac2] transition disabled:opacity-60 disabled:cursor-wait"
              >
                {isActivating ? "Activating…" : `Start ${selectedPlan === "annual" ? "Annual" : selectedPlan === "monthly" ? "Monthly" : "Weekly"} Free Trial`}
              </motion.button>

              <p className="mt-3 text-center text-[10.5px] text-[#7c8b95] leading-relaxed font-semibold">
                Your trial begins today. You can cancel anytime before the trial ends
                without being charged. Super Duolingo is a simulated premium upgrade.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
