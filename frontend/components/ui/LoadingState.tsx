"use client";

import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div
      className="w-full max-w-xl mx-auto py-8 px-4 flex flex-col items-center animate-pulse"
      aria-busy="true"
      aria-label="Loading learning path"
    >
      {/* Skeleton Unit Header */}
      <div className="w-full h-28 rounded-2xl bg-[#1a2c35] border-2 border-[#2b3d48] mb-12 p-5 flex flex-col justify-between">
        <div className="w-32 h-4 rounded-md bg-slate-700/60" />
        <div className="w-48 h-6 rounded-md bg-slate-700/80" />
        <div className="w-64 h-3.5 rounded-md bg-slate-700/50" />
      </div>

      {/* Skeleton Skill Nodes along serpentine path */}
      <div className="flex flex-col items-center gap-10 w-full">
        {[0, -44, -64, -44, 0, 44].map((offset, i) => (
          <div
            key={i}
            className="flex flex-col items-center"
            style={{ transform: `translateX(${offset}px)` }}
          >
            <div className="w-[74px] h-[74px] rounded-full bg-[#1a2c35] border-4 border-[#2b3d48] shadow-inner" />
            <div className="w-16 h-3 rounded-md bg-slate-800 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
