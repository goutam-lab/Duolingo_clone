"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SkillProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  status: "locked" | "available" | "in_progress" | "completed";
  children: React.ReactNode;
}

export const SkillProgressRing: React.FC<SkillProgressRingProps> = ({
  percentage,
  size = 94,
  strokeWidth = 8,
  status,
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Visual color tokens based on status
  const ringColor =
    status === "completed"
      ? "#ffc800" // Gold for completed
      : status === "in_progress"
      ? "#58cc02" // Vibrant green for active progress
      : "#37464f"; // Slate for locked/unstarted

  const showRing = status === "in_progress" || (status === "completed" && clampedPercentage > 0);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {showRing && (
        <svg
          className="absolute inset-0 -rotate-90 pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#24343d"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.8, ease: "easeOut" }
            }
          />
        </svg>
      )}

      {/* Child node (the button) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
