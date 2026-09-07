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
  showHeader?: boolean;
}

const NODE_Y_OFFSETS = [0, 0, 0, 0, 0, 0, 0, 0];

export const UnitSection = React.forwardRef<HTMLElement, UnitSectionProps>(
  function UnitSection(
    {
      unit,
      onSkillClick,
      firstAvailableSkillId,
      sectionNumber = 1,
      showHeader = true,
    },
    ref
  ) {
    const skills = unit.skills || [];
    const isCurrentUnit = skills.some(
      (skill) => skill.id === firstAvailableSkillId
    );

    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        data-unit-id={unit.id}
        data-current-unit={isCurrentUnit ? "true" : "false"}
        className="w-full max-w-[598px] mx-auto flex flex-col items-center relative"
        aria-label={`Unit ${unit.order_index}: ${unit.title}`}
      >
        {showHeader && <UnitHeader unit={unit} sectionNumber={sectionNumber} />}

        <div
          className={`w-full flex flex-col items-center relative overflow-x-hidden ${
            showHeader ? "pt-10 pb-6" : "pt-6 pb-14"
          }`}
        >
          {!showHeader && unit.order_index > 1 && (
            <div
              className="w-full flex items-center gap-3 mb-10 opacity-70"
              aria-hidden="true"
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#37464f] to-[#37464f]" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6b7c86] px-2">
                Section {sectionNumber} · Unit {unit.order_index}
              </span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#37464f] to-[#37464f]" />
            </div>
          )}

          {skills.map((skill, index) => {
            const currentX = 0;
            const hasNext = index < skills.length - 1;
            const nextX = 0;
            const isFirstAvailable = skill.id === firstAvailableSkillId;
            const mascotOnRight = (index % 2 === 0);

            return (
              <React.Fragment key={skill.id}>
                <div className="relative flex justify-center w-full z-10">
                  <div className="flex flex-col items-center">
                    <SkillNode
                      skill={skill}
                      onClick={onSkillClick}
                      isFirstAvailable={isFirstAvailable}
                      showLabel
                    />
                  </div>

                  {isFirstAvailable && (
                    <div
                      className={`absolute hidden sm:block pointer-events-none ${
                        mascotOnRight
                          ? "left-[calc(50%+76px)]"
                          : "right-[calc(50%+76px)]"
                      }`}
                      style={{ top: "32px" }}
                    >
                      <Mascot />
                    </div>
                  )}
                </div>

                {hasNext && (
                  <div className="relative w-full flex justify-center z-0">
                    <PathConnector
                      startX={currentX}
                      endX={nextX}
                      height={52}
                      isCompleted={skill.status === "completed"}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>
    );
  }
);
