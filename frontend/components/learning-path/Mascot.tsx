"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MascotProps {
  mood?: "happy" | "sad" | "excited" | "neutral";
}

export const Mascot: React.FC<MascotProps> = ({ mood = "happy" }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative pointer-events-none select-none" aria-hidden="true">
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, -6, 0], rotate: [0, 1.5, -1.5, 0] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative z-10"
      >
        <svg
          width="130"
          height="150"
          viewBox="0 0 130 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="owlBodyGrad" cx="50%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#a6e56a" />
              <stop offset="45%" stopColor="#70d32a" />
              <stop offset="100%" stopColor="#4aaf00" />
            </radialGradient>
            <radialGradient id="owlBellyGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#bff087" />
              <stop offset="100%" stopColor="#96d854" />
            </radialGradient>
            <radialGradient id="owlHeadGrad" cx="50%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#b2ea72" />
              <stop offset="55%" stopColor="#77d72d" />
              <stop offset="100%" stopColor="#3c9500" />
            </radialGradient>
            <linearGradient id="beakGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffbb55" />
              <stop offset="100%" stopColor="#ff8800" />
            </linearGradient>
            <linearGradient id="footGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffb43c" />
              <stop offset="100%" stopColor="#e77a00" />
            </linearGradient>
            <radialGradient id="eyeWhiteGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e9f4ff" />
            </radialGradient>
            <filter id="owlShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.35" />
            </filter>
            <filter id="innerBevel" x="-10%" y="-10%" width="120%" height="120%">
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Left ear tuft */}
          <path d="M34 40 L24 10 L50 34 Z" fill="url(#owlHeadGrad)" stroke="#3c9500" strokeWidth="1.5" strokeLinejoin="round"/>
          {/* Right ear tuft */}
          <path d="M96 40 L106 10 L80 34 Z" fill="url(#owlHeadGrad)" stroke="#3c9500" strokeWidth="1.5" strokeLinejoin="round"/>

          {/* HEAD */}
          <ellipse cx="65" cy="58" rx="46" ry="44" fill="url(#owlHeadGrad)" filter="url(#owlShadow)" />
          {/* Head top highlight */}
          <ellipse cx="58" cy="34" rx="28" ry="14" fill="#d1f19e" opacity="0.55" />

          {/* Left wing (behind body) */}
          <path d="M22 78 C 14 90, 18 118, 30 130 L 40 108 C 30 94, 28 84, 34 76 Z" fill="#4aaf00" stroke="#337a00" strokeWidth="1.8" strokeLinejoin="round"/>
          {/* Right wing (behind body) */}
          <path d="M108 78 C 116 90, 112 118, 100 130 L 90 108 C 100 94, 102 84, 96 76 Z" fill="#4aaf00" stroke="#337a00" strokeWidth="1.8" strokeLinejoin="round"/>

          {/* BODY */}
          <ellipse cx="65" cy="102" rx="36" ry="38" fill="url(#owlBodyGrad)" stroke="#3c9500" strokeWidth="1.6"/>
          {/* Belly lighter area */}
          <ellipse cx="65" cy="106" rx="24" ry="28" fill="url(#owlBellyGrad)" />

          {/* Face / cheek white area */}
          <ellipse cx="65" cy="62" rx="36" ry="30" fill="#e5f8c4" opacity="0.75" />

          {/* LEFT EYE */}
          <g>
            <circle cx="50" cy="56" r="17" fill="url(#eyeWhiteGrad)" stroke="#2e6f00" strokeWidth="2.2"/>
            <circle cx="52" cy="58" r="9.5" fill="#0b1c00"/>
            <circle cx="55.5" cy="54.5" r="3" fill="#fff"/>
          </g>

          {/* RIGHT EYE */}
          <g>
            <circle cx="80" cy="56" r="17" fill="url(#eyeWhiteGrad)" stroke="#2e6f00" strokeWidth="2.2"/>
            <circle cx="82" cy="58" r="9.5" fill="#0b1c00"/>
            <circle cx="85.5" cy="54.5" r="3" fill="#fff"/>
          </g>

          {/* BEAK */}
          <path
            d="M56 72 L 74 72 L 65 90 Z"
            fill="url(#beakGrad)"
            stroke="#cc5c00"
            strokeWidth="1.6"
            strokeLinejoin="round"
            filter="url(#innerBevel)"
          />
          {/* Beak mouth line */}
          <path d="M58 80 Q 65 85 72 80" stroke="#cc5c00" strokeWidth="1.4" fill="none" strokeLinecap="round"/>

          {/* Smile / mouth under beak */}
          <path
            d="M57 100 Q 65 108 73 100"
            stroke="#2e6f00"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Cheek blush */}
          <circle cx="36" cy="76" r="6" fill="#ff8da1" opacity="0.35"/>
          <circle cx="94" cy="76" r="6" fill="#ff8da1" opacity="0.35"/>

          {/* FEET */}
          <g>
            {/* Left foot */}
            <path
              d="M48 136 L 50 148 L 42 149 L 39 144 L 44 142 Z M 50 148 L 50 151.5 L 47 150.5 Z M 50 148 L 54.5 151 L 54 146.5 Z"
              fill="url(#footGrad)"
              stroke="#b36400"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Right foot */}
            <path
              d="M82 136 L 80 148 L 88 149 L 91 144 L 86 142 Z M 80 148 L 80 151.5 L 83 150.5 Z M 80 148 L 75.5 151 L 76 146.5 Z"
              fill="url(#footGrad)"
              stroke="#b36400"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </motion.div>

      {/* Circular DARK BASE / platform — owl sits on it */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "-6px" }}>
        <div
          className="rounded-full bg-[#10241f] opacity-90"
          style={{ width: "120px", height: "26px", filter: "blur(1px)" }}
        />
        <div
          className="absolute inset-0 rounded-full border-t-2 border-[#1d3a33]"
          style={{ marginTop: "1px" }}
        />
      </div>

      {/* Soft ground shadow */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "-12px" }}>
        <div
          className="rounded-full bg-black"
          style={{
            width: "110px",
            height: "14px",
            opacity: 0.45,
            filter: "blur(6px)",
          }}
        />
      </div>
    </div>
  );
};
