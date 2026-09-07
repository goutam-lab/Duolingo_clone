"use client";

import React from "react";
import { UnitPathResponse, SkillPathResponse } from "@/types/api";
import { UnitHeader } from "./UnitHeader";
import { SkillNode } from "./SkillNode";
import { PathConnector } from "./PathConnector";
import { Mascot } from "./Mascot";

interface UnitSectionProps {
  unit: UnitPathResponse;
  onSkillClick: (skill: SkillPathResponse) => void;
  firstAvailableSkillId?: number | null;
  sectionNumber?: number;
}

// Gentle serpentine horizontal offsets (px) relative to center
const HORIZONTAL_OFFSETS = [0, -44, -64, -44, 0, 44, 64, 44];

export const UnitSection: React.FC<UnitSectionProps> = ({
  unit,
  onSkillClick,
  firstAvailableSkillId,
  sectionNumber = 1,
}) => {
  const skills = unit.skills || [];

  return (
    <section
      className="w-full max-w-xl mx-auto mb-16 flex flex-col items-center relative"
      aria-label={`Unit ${unit.order_index}: ${unit.title}`}
    >
      {/* Unit Header Banner */}
      <UnitHeader unit={unit} sectionNumber={sectionNumber} />

      {/* Vertical Sequence of Skill Nodes and Connectors */}
      <div className="w-full flex flex-col items-center relative py-4">
        {skills.map((skill, index) => {
          const currentX = HORIZONTAL_OFFSETS[index % HORIZONTAL_OFFSETS.length];
          const hasNext = index < skills.length - 1;
          const nextX = hasNext
            ? HORIZONTAL_OFFSETS[(index + 1) % HORIZONTAL_OFFSETS.length]
            : 0;

          const isFirstAvailable = skill.id === firstAvailableSkillId;

          // Render friendly mascot alongside node 1 or node 2
          const showMascot = index === 1;

          return (
            <React.Fragment key={skill.id}>
              {/* Row Container with relative horizontal positioning */}
              <div
                className="relative flex items-center justify-center w-full my-2.5"
                style={{ transform: `translateX(${currentX}px)` }}
              >
                <SkillNode
                  skill={skill}
                  onClick={onSkillClick}
                  isFirstAvailable={isFirstAvailable}
                />

                {/* Accompaniment Mascot on the side of the path */}
                {showMascot && (
                  <div
                    className="absolute left-1/2 ml-20 -top-2 hidden sm:block pointer-events-none"
                    style={{ transform: `translateX(${Math.abs(currentX) + 15}px)` }}
                  >
                    <Mascot />
                  </div>
                )}
              </div>

              {/* SVG Curved Path Connector to next node */}
              {hasNext && (
                <PathConnector
                  startX={currentX}
                  endX={nextX}
                  isCompleted={skill.status === "completed"}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
