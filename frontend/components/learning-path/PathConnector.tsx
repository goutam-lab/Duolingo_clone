"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PathConnectorProps {
  startX: number;
  endX: number;
  height?: number;
  isCompleted?: boolean;
}

export const PathConnector: React.FC<PathConnectorProps> = ({
  startX,
  endX,
  height = 56,
  isCompleted = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const svgWidth = 480;
  const midX = svgWidth / 2;
  const x1 = midX + startX;
  const y1 = 0;
  const x2 = midX + endX;
  const y2 = height;

  const dx = x2 - x1;
  const absDx = Math.abs(dx);
  const isStraight = absDx < 5;

  // Smooth cubic bezier curve - S-curve for zigzag pattern
  let pathData: string;
  if (isStraight) {
    pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
  } else {
    const curveDepth = Math.min(Math.max(absDx * 0.45, 14), height * 0.45);
    const cp1y = y1 + curveDepth;
    const cp2y = y2 - curveDepth;
    pathData = `M ${x1} ${y1} C ${x1} ${cp1y}, ${x2} ${cp2y}, ${x2} ${y2}`;
  }

  const strokeOuter = isCompleted ? "#ffc800" : "#22333d";
  const strokeInner = isCompleted ? "#ffd84d" : "#2f424e";
  const strokeHighlight = isCompleted ? "#fff4b3" : "#3d5363";

  return (
    <div
      className="w-full flex justify-center pointer-events-none z-0"
      style={{ height }}
      aria-hidden="true"
    >
      <svg
        width={svgWidth}
        height={height}
        viewBox={`0 0 ${svgWidth} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Outer shadow/glow for completed (gold) */}
        {isCompleted && (
          <motion.path
            d={pathData}
            stroke="#ffc800"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.22"
            initial={shouldReduceMotion ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }
          />
        )}

        {/* Outer road stroke */}
        <motion.path
          d={pathData}
          stroke={strokeOuter}
          strokeWidth="12"
          strokeLinecap="round"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
          }
        />

        {/* Inner road stroke (road surface) */}
        <path
          d={pathData}
          stroke={strokeInner}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Road highlight / lane dashes for in-progress sections */}
        {!isCompleted && (
          <path
            d={pathData}
            stroke={strokeHighlight}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 8"
            opacity="0.5"
          />
        )}

        {/* Shiny highlight on golden road */}
        {isCompleted && (
          <path
            d={pathData}
            stroke={strokeHighlight}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        )}
      </svg>
    </div>
  );
};
