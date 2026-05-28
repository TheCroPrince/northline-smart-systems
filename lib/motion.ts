/**
 * Motion token reference. Source of truth: DESIGN_MOTION §21.
 *
 * Anything that needs a duration, easing, or distance pulls from here.
 * New values require an update to DESIGN_MOTION §21 before being added.
 */

import type { Variants } from "framer-motion";

// Easings. `out` is the canonical curve used everywhere except pulses/sweeps.
export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  linear: "linear" as const,
};

// Durations in milliseconds.
export const duration = {
  micro: 200, // chip resolve, focus ring
  fast: 250, // hover lift, button press
  normal: 400, // fades, transitions
  slow: 600, // settle, count-up, drawer
  cinematic: 800, // headline rise, section reveal
  scene: 1200, // path-draw, scene assembly
  pulse: 1800, // ambient live indicators
} as const;

// Distances in pixels (or unitless ratios for parallax).
export const distance = {
  riseY: 12, // headline rise
  liftY: 2, // card hover lift (1 on mobile)
  drawerX: 24, // content shift on drawer open
  parallaxMax: 0.08, // 8% max parallax offset
} as const;

// Stagger intervals in milliseconds.
export const stagger = {
  tight: 50, // mobile reveals
  default: 80, // desktop reveals
  scene: 200, // hero overlay choreography
} as const;

// Framer Motion variants (the entire reveal vocabulary).

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal / 1000, ease: ease.out },
  },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: distance.riseY },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.cinematic / 1000, ease: ease.out },
  },
};

export const settle: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow / 1000, ease: ease.out },
  },
};
