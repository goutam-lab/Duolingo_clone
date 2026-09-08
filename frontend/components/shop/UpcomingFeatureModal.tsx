"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Rocket, X, Gem, Bell, Check, Zap } from "lucide-react";
import { soundEffects } from "@/lib/sound";

export interface UpcomingShopItem {
  id: string;
  name: string;
  category: string;
  cost: number | string;
  isGems?: boolean;
  icon?: React.ReactNode;
  description: string;
  tagline?: string;
}

interface UpcomingFeatureModalProps {
  isOpen: boolean;
  item: UpcomingShopItem | null;
  onClose: () => void;
}

export const UpcomingFeatureModal: React.FC<UpcomingFeatureModalProps> = ({
  isOpen,
  item,
  onClose,
}) => {
  const [notified, setNotified] = useState(false);

  if (!isOpen || !item) return null;

  const handleNotify = () => {
    soundEffects.playCorrect();
    setNotified(true);
    setTimeout(() => {
      setNotified(false);
    }, 3500);
  };

  const handleClose = () => {
    soundEffects.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-[#1a2c35] border-2 border-[#37464f] shadow-2xl text-center space-y-5 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Top glow decoration */}
          <div
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-50"
            style={{
              background: "radial-gradient(circle, #1cb0f6 0%, #7c6aff 60%, transparent 75%)",
            }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Icon Hero */}
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#1cb0f6]/15 border border-[#1cb0f6]/40 text-[#1cb0f6]">
              <Rocket className="w-3.5 h-3.5" />
              <span>Upcoming Feature</span>
            </div>

            <div className="relative w-20 h-20 rounded-3xl bg-linear-to-br from-[#1cb0f6]/25 to-[#7c6aff]/25 border-2 border-[#1cb0f6]/40 flex items-center justify-center shadow-lg">
              {item.icon ? (
                <div className="text-[#1cb0f6]">{item.icon}</div>
              ) : (
                <Sparkles className="w-10 h-10 text-[#ffc800]" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">
              {item.name}
            </h3>

            {/* Price tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#131f24] border border-[#2b3d48] text-sm font-black text-white">
              {item.isGems !== false ? (
                <>
                  <Gem className="w-4 h-4 text-[#1cb0f6] fill-[#1cb0f6]" />
                  <span>{item.cost} Gems</span>
                </>
              ) : (
                <span>{item.cost}</span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed pt-1">
              {item.description}
            </p>

            <div className="p-3 rounded-2xl bg-[#131f24]/70 border border-[#2b3d48] text-[12px] text-slate-400 font-semibold">
              🚀 We are fine-tuning this item in the Lingua Lab. You will be able to purchase and equip it in the upcoming release!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleNotify}
              disabled={notified}
              className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-b-4 active:translate-y-0.5 active:border-b-2 cursor-pointer ${
                notified
                  ? "bg-[#58cc02] border-[#46a302] text-white"
                  : "bg-[#1cb0f6] border-[#1899d6] hover:brightness-105 text-white shadow-lg shadow-[#1cb0f6]/20"
              }`}
            >
              {notified ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Waitlist Joined! We&apos;ll notify you</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Notify Me When Ready</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
