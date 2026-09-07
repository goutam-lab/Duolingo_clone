"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gem } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

interface GemsDisplayProps {
  gems: number;
}

export const GemsDisplay: React.FC<GemsDisplayProps> = ({ gems }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-sm tracking-wide text-[#1cb0f6] hover:bg-[#1cb0f6]/10"
      title={`${gems} gems`}
      role="status"
      aria-label={`${gems} gems`}
    >
      <Gem className="w-5 h-5 fill-[#1cb0f6]" />
      <AnimatedNumber value={gems} />
    </motion.div>
  );
};
