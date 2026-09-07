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
  height = 42,
  isCompleted = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const svgWidth = 280;
  const midX = svgWidth / 2;
  const x1 = midX + startX;
  const y1 = 4;
  const x2 = midX + endX;
  const y2 = height - 4;
  const cy1 = height * 0.45;
  const cy2 = height * 0.55;
  const pathData = `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;
  const strokeColor = isCompleted ? "#ffc800" : "#283944";

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
      >
        <motion.path
          d={pathData}
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
          }
        />
        <path
          d={pathData}
          stroke={isCompleted ? "#ffe169" : "#324450"}
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-50"
        />
      </svg>
    </div>
  );
};
