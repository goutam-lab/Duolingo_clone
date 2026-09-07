"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

interface XPDisplayProps {
  totalXp: number;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({ totalXp }) => {
  const shouldReduceMotion = useReducedMotion();
  const safeXp = Number.isFinite(totalXp) ? totalXp : 0;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-sm tracking-wide text-[#ffc800] hover:bg-[#ffc800]/10"
      title={`${safeXp} total XP`}
      role="status"
      aria-label={`${safeXp} total XP`}
    >
      <Zap className="w-5 h-5 fill-[#ffc800]" />
      <AnimatedNumber value={safeXp} />
    </motion.div>
  );
};
