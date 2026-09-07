"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { Mascot } from "@/components/learning-path/Mascot";

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No learning units are available for this course yet.",
}) => {
  return (
    <div className="w-full max-w-md mx-auto py-16 px-6 flex flex-col items-center text-center">
      <div className="mb-6">
        <Mascot mood="happy" />
      </div>

      <div className="flex items-center gap-2 text-[#1cb0f6] font-black text-sm uppercase tracking-wider mb-2">
        <BookOpen className="w-5 h-5" />
        <span>Course Empty</span>
      </div>

      <h2 className="text-xl font-black text-white mb-2">
        Ready for New Adventures!
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed">
        {message}
      </p>
    </div>
  );
};
