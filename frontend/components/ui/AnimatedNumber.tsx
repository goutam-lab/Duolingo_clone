"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const currentRef = useRef(value);

  useEffect(() => {
    const from = currentRef.current;

    if (shouldReduceMotion || from === value) {
      currentRef.current = value;
      setDisplay(value);
      return;
    }

    const controls = animate(from, value, {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        const next = Math.round(latest);
        currentRef.current = next;
        setDisplay(next);
      },
    });

    return () => controls.stop();
  }, [value, shouldReduceMotion]);

  return <span className={className}>{display}</span>;
};
