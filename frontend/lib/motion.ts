export const springSnappy = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.7,
};

export const springSoft = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
  mass: 0.85,
};

export const popoverTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 26,
  mass: 0.65,
};

export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
