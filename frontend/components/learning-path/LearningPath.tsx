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

  // IntersectionObserver for active unit detection
  useEffect(() => {
    if (units.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-18% 0px -48% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75],
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => {
          const aTop = a.boundingClientRect.top;
          const bTop = b.boundingClientRect.top;
          if (a.intersectionRatio !== b.intersectionRatio) {
            return b.intersectionRatio - a.intersectionRatio;
          }
          return aTop - bTop;
        });

      if (visibleEntries.length > 0) {
        const unitId = Number(
          (visibleEntries[0].target as HTMLElement).dataset.unitId
        );
        const found = units.find((u) => u.id === unitId);
        if (found) {
          setActiveUnit((prev) => (prev?.id === found.id ? prev : found));
        }
      }
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // Observe all section refs
    const timer = window.setTimeout(() => {
      sectionRefs.current.forEach((el) => {
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
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
    hidden: { opacity: 0, y: -8, scale: 0.985 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.985 },
  };

  const headerTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="w-full flex flex-col items-center pt-3 pb-10 px-2 sm:px-3">
      {/* Single Contextual Header — Sticky, changes based on active unit */}
      <div className="w-full max-w-[598px] mx-auto sticky top-[49px] lg:top-0 z-30 pb-5">
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
