"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MascotProps {
  className?: string;
  mood?: "happy" | "waving" | "studying";
}

export const Mascot: React.FC<MascotProps> = ({
  className = "",
  mood = "happy",
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? { y: 0 }
          : { y: [0, -6, 0] }
      }
      transition={{
        repeat: Infinity,
        duration: 2.8,
        ease: "easeInOut",
      }}
      className={`inline-block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width="88"
        height="88"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shadow below mascot */}
        <ellipse cx="60" cy="112" rx="34" ry="7" fill="#0c161a" opacity="0.4" />

        {/* Mascot Body - Rounded cheerful green owl shape */}
        <path
          d="M26 64C26 38 41 20 60 20C79 20 94 38 94 64C94 88 80 106 60 106C40 106 26 88 26 64Z"
          fill="#58cc02"
        />
        {/* Body highlight */}
        <path
          d="M34 50C34 36 45 25 60 25C67 25 74 28 80 34"
          stroke="#7ee018"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Cute feathered ears / tufts */}
        <path d="M30 32L22 14L42 24" fill="#58cc02" />
        <path d="M90 32L98 14L78 24" fill="#58cc02" />

        {/* Belly patch */}
        <ellipse cx="60" cy="74" rx="24" ry="24" fill="#7ee018" />
        {/* Feather marks on belly */}
        <path
          d="M52 68C54 71 58 71 60 68M60 68C62 71 66 71 68 68"
          stroke="#46a302"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M56 78C58 81 62 81 64 78"
          stroke="#46a302"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Big expressive friendly eyes */}
        {/* Left eye */}
        <circle cx="45" cy="48" r="14" fill="#ffffff" />
        <circle cx="47" cy="48" r="7.5" fill="#1b2e35" />
        <circle cx="49" cy="46" r="3" fill="#ffffff" />

        {/* Right eye */}
        <circle cx="75" cy="48" r="14" fill="#ffffff" />
        <circle cx="73" cy="48" r="7.5" fill="#1b2e35" />
        <circle cx="75" cy="46" r="3" fill="#ffffff" />

        {/* Orange Beak */}
        <path
          d="M54 54L60 65L66 54C64 53 56 53 54 54Z"
          fill="#ff9600"
        />

        {/* Wings */}
        <path
          d="M26 62C22 66 18 76 22 84C25 81 27 75 28 68"
          fill="#46a302"
        />
        <path
          d="M94 62C98 66 102 76 98 84C95 81 93 75 92 68"
          fill="#46a302"
        />

        {/* Little Orange Feet */}
        <ellipse cx="49" cy="106" rx="7" ry="4" fill="#ff9600" />
        <ellipse cx="71" cy="106" rx="7" ry="4" fill="#ff9600" />
      </svg>
    </motion.div>
  );
};
