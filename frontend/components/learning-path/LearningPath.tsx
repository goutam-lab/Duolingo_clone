"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CoursePathResponse,
  SkillPathResponse,
  UnitPathResponse,
} from "@/types/api";
import { UnitSection } from "./UnitSection";
import { UnitHeader } from "./UnitHeader";
import { SkillPopover } from "./SkillPopover";

interface LearningPathProps {
  coursePath: CoursePathResponse;
}

export const LearningPath: React.FC<LearningPathProps> = ({ coursePath }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillPathResponse | null>(
    null
  );
  const [showJump, setShowJump] = useState(false);
  const [activeUnit, setActiveUnit] = useState<UnitPathResponse | null>(null);
  const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
  const shouldReduceMotion = useReducedMotion();

  const units = coursePath.units || [];

  const getSectionNumber = (orderIndex: number) =>
    Math.max(1, Math.ceil(orderIndex / 4));

  // Initialize active unit to first unit
  useEffect(() => {
    if (units.length > 0 && !activeUnit) {
      setActiveUnit(units[0]);
    }
  }, [units, activeUnit]);

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

  const setSectionRef = useCallback(
    (unitId: number) => (el: HTMLElement | null) => {
      if (el) {
        sectionRefs.current.set(unitId, el);
      } else {
        sectionRefs.current.delete(unitId);
      }
    },
    []
  );

  // Deterministic scroll detection for active unit
  useEffect(() => {
    if (units.length === 0) return;

    let ticking = false;

    const updateActiveUnit = () => {
      // The sticky header sits at top: 0 (or 49px on mobile) and is ~110px tall.
      // A threshold of 150px detects which unit is actively under or passing the header.
      const thresholdY = 150;

      let currentActive: UnitPathResponse | null = null;

      for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        const el = sectionRefs.current.get(unit.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= thresholdY && rect.bottom > thresholdY) {
          currentActive = unit;
          break;
        }
      }

      if (!currentActive) {
        const firstEl = sectionRefs.current.get(units[0].id);
        if (firstEl && firstEl.getBoundingClientRect().top > thresholdY) {
          currentActive = units[0];
        } else {
          currentActive = units[units.length - 1];
        }
      }

      if (currentActive) {
        setActiveUnit((prev) => (prev?.id === currentActive!.id ? prev : currentActive));
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveUnit);
        ticking = true;
      }
    };

    updateActiveUnit();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [units]);

  // Scroll listener for jump button
  useEffect(() => {
    const onScroll = () => {
      setShowJump(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to current unit on mount
  useEffect(() => {
    const currentUnit = document.querySelector('[data-current-unit="true"]');
    if (!currentUnit) return;
    const rect = currentUnit.getBoundingClientRect();
    if (rect.top > 80 && rect.top < window.innerHeight * 0.45) return;
    window.setTimeout(() => {
      const headerOffset = 200;
      const elementRect = currentUnit.getBoundingClientRect();
      const offsetTop = elementRect.top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }, 250);
  }, [firstAvailableSkillId]);

  const headerVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
  };

  const headerTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: "easeOut" as const };

  return (
    <div className="w-full flex flex-col items-center pt-1 pb-10 px-2 sm:px-3">
      {/* Single Contextual Header — Sticky with top padding and backdrop shield */}
      <div className="w-full max-w-[598px] mx-auto sticky top-[49px] lg:top-0 z-30 pt-2.5 sm:pt-3 pb-2.5 px-1 bg-[var(--background)]/90 backdrop-blur-md transition-colors">
        <AnimatePresence mode="wait">
          {activeUnit && (
            <motion.div
              key={activeUnit.id}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={headerVariants}
              transition={headerTransition}
            >
              <UnitHeader
                unit={activeUnit}
                sectionNumber={getSectionNumber(activeUnit.order_index)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continuous Learning Path - Units without individual headers */}
      <div className="w-full flex flex-col items-center">
        {units.map((unit) => (
          <UnitSection
            key={unit.id}
            ref={setSectionRef(unit.id)}
            unit={unit}
            sectionNumber={getSectionNumber(unit.order_index)}
            firstAvailableSkillId={firstAvailableSkillId}
            onSkillClick={(skill) => setSelectedSkill(skill)}
            showHeader={false}
          />
        ))}
      </div>

      <SkillPopover
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      {showJump && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 md:bottom-5 right-3 lg:right-[388px] z-40 w-11 h-11 rounded-full bg-[#1cb0f6] border-b-4 border-[#1899d6] text-white flex items-center justify-center"
          aria-label="Jump to top of learning path"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
