"use client";

import React from "react";

interface PathConnectorProps {
  startX: number; // Offset from center in px (e.g., -40, 0, 40)
  endX: number;   // Offset from center in px
  height?: number; // Distance between rows in px
  isCompleted?: boolean;
}

export const PathConnector: React.FC<PathConnectorProps> = ({
  startX,
  endX,
  height = 54,
  isCompleted = false,
}) => {
  // Center is mapped to an SVG width of 240px (midpoint at 120)
  const svgWidth = 240;
  const midX = svgWidth / 2;

  const x1 = midX + startX;
  const y1 = 0;
  const x2 = midX + endX;
  const y2 = height;

  // Cubic Bezier curve control points
  const cy1 = height * 0.55;
  const cy2 = height * 0.45;

  const pathData = `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;

  const strokeColor = isCompleted ? "#ffc800" : "#283944";

  return (
    <div
      className="w-full flex justify-center -my-3 pointer-events-none z-0"
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
        <path
          d={pathData}
          stroke={strokeColor}
          strokeWidth="11"
          strokeLinecap="round"
          className="transition-colors duration-500"
        />
        {/* Subtle inner highlight track */}
        <path
          d={pathData}
          stroke={isCompleted ? "#ffe169" : "#324450"}
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-colors duration-500 opacity-60"
        />
      </svg>
    </div>
  );
};
