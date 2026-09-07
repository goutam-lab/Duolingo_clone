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

const HORIZONTAL_OFFSETS = [0, -48, -72, -48, 0, 48, 72, 48];

export const UnitSection: React.FC<UnitSectionProps> = ({
  unit,
  onSkillClick,
  firstAvailableSkillId,
  sectionNumber = 1,
}) => {
  const skills = unit.skills || [];

  return (
    <section
      className="w-full max-w-xl mx-auto mb-20 flex flex-col items-center relative"
      aria-label={`Unit ${unit.order_index}: ${unit.title}`}
    >
      <UnitHeader unit={unit} sectionNumber={sectionNumber} />

      <div className="w-full flex flex-col items-center relative pt-6 pb-2 overflow-x-hidden">
        {skills.map((skill, index) => {
          const currentX = HORIZONTAL_OFFSETS[index % HORIZONTAL_OFFSETS.length];
          const hasNext = index < skills.length - 1;
          const nextX = hasNext
            ? HORIZONTAL_OFFSETS[(index + 1) % HORIZONTAL_OFFSETS.length]
            : 0;
          const isFirstAvailable = skill.id === firstAvailableSkillId;
          const showMascot = index === 1;
          const mascotOnRight = currentX <= 0;

          return (
            <React.Fragment key={skill.id}>
              <div className="relative flex justify-center w-full">
                <div style={{ transform: `translateX(${currentX}px)` }}>
                  <SkillNode
                    skill={skill}
                    onClick={onSkillClick}
                    isFirstAvailable={isFirstAvailable}
                  />
                </div>

                {showMascot && (
                  <div
                    className={`absolute top-12 hidden sm:block pointer-events-none ${
                      mascotOnRight ? "left-[calc(50%+86px)]" : "right-[calc(50%+86px)]"
                    }`}
                  >
                    <Mascot />
                  </div>
                )}
              </div>

              {hasNext && (
                <PathConnector
                  startX={currentX}
                  endX={nextX}
                  height={76}
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
