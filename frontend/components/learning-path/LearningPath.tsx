"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { CoursePathResponse, SkillPathResponse } from "@/types/api";
import { UnitSection } from "./UnitSection";
import { SkillPopover } from "./SkillPopover";

interface LearningPathProps {
  coursePath: CoursePathResponse;
}

export const LearningPath: React.FC<LearningPathProps> = ({ coursePath }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillPathResponse | null>(
    null
  );
  const [showJump, setShowJump] = useState(false);

  const units = coursePath.units || [];

  let firstAvailableSkillId: number | null = null;
  for (const unit of units) {
    const found = unit.skills.find(
      (s) => s.status === "available" || s.status === "in_progress"
    );
    if (found) {
      firstAvailableSkillId = found.id;
      break;
    }
  }

  useEffect(() => {
    const onScroll = () => {
      setShowJump(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!firstAvailableSkillId) return;
    const node = document.querySelector(
      `[data-skill-id="${firstAvailableSkillId}"]`
    );
    if (node) {
      node.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [firstAvailableSkillId]);

  return (
    <div className="w-full flex flex-col items-center py-6 px-3 sm:px-6">
      {units.map((unit) => (
        <UnitSection
          key={unit.id}
          unit={unit}
          sectionNumber={Math.max(1, Math.ceil(unit.order_index / 4))}
          firstAvailableSkillId={firstAvailableSkillId}
          onSkillClick={(skill) => setSelectedSkill(skill)}
        />
      ))}

      <SkillPopover
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      {showJump && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 md:bottom-6 right-4 lg:right-[340px] z-40 w-12 h-12 rounded-full bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white flex items-center justify-center shadow-lg"
          aria-label="Jump to top of learning path"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
