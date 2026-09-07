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

const X_OFFSETS = [90, -90, 70, -70, 100, -80, 60, -100, 80, -60];

function getOffset(index: number): number {
  return X_OFFSETS[index % X_OFFSETS.length];
}

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
            const currentX = getOffset(index);
            const hasNext = index < skills.length - 1;
            const nextX = hasNext ? getOffset(index + 1) : 0;
            const isFirstAvailable = skill.id === firstAvailableSkillId;
            const mascotOnRight = currentX >= 0;

            return (
              <React.Fragment key={skill.id}>
                <div className="relative w-full z-10" style={{ minHeight: "108px" }}>
                  <div
                    className="absolute left-1/2 flex flex-col items-center"
                    style={{ transform: `translateX(calc(-50% + ${currentX}px))` }}
                  >
                    <SkillNode
                      skill={skill}
                      onClick={onSkillClick}
                      isFirstAvailable={isFirstAvailable}
                      showLabel
                    />
                  </div>

                  {isFirstAvailable && (
                    <div
                      className={`absolute hidden sm:block pointer-events-none z-20`}
                      style={{
                        left: mascotOnRight
                          ? `calc(50% + ${currentX + 60}px)`
                          : `calc(50% + ${currentX - 60}px)`,
                        transform: mascotOnRight ? "none" : "translateX(-100%)",
                        top: "24px",
                      }}
                    >
                      <Mascot />
                    </div>
                  )}
                </div>

                {hasNext && (
                  <div className="relative w-full z-0" style={{ height: "56px", marginTop: "-4px" }}>
                    <PathConnector
                      startX={currentX}
                      endX={nextX}
                      height={56}
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
