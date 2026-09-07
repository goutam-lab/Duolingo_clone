"use client";

import React, { useState } from "react";
import { CoursePathResponse, SkillPathResponse } from "@/types/api";
import { UnitSection } from "./UnitSection";
import { SkillPopover } from "./SkillPopover";

interface LearningPathProps {
  coursePath: CoursePathResponse;
}

export const LearningPath: React.FC<LearningPathProps> = ({ coursePath }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillPathResponse | null>(null);

  const units = coursePath.units || [];

  // Find the first available / in_progress skill across the entire course
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

  return (
    <div className="w-full flex flex-col items-center py-6 px-3 sm:px-6">
      {/* Units Stack */}
      {units.map((unit, index) => (
        <UnitSection
          key={unit.id}
          unit={unit}
          sectionNumber={1}
          firstAvailableSkillId={firstAvailableSkillId}
          onSkillClick={(skill) => setSelectedSkill(skill)}
        />
      ))}

      {/* Popover / Modal when a playable skill node is clicked */}
      <SkillPopover
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </div>
  );
};
