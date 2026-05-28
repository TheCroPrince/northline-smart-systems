"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * Hero overlay choreography. Source: DESIGN_MOTION §18.
 *
 * Five staged motifs that assemble around the centered text block over ~1.5s
 * after mount:
 *  1. Camera FOV cone     (top-left)       — soft scale + fade
 *  2. Status pill         (top-right)      — fade
 *  3. Network mesh path   (mid, diagonal)  — SVG path-draw
 *  4. Occupancy node      (lower-left)     — pop + ambient pulse
 *  5. Signal arc          (lower-right)    — concentric arcs draw
 *
 * Reuses only the locked easing curve from `lib/motion.ts`. Local variant
 * shapes are composed per DESIGN_MOTION §18 (signature interaction moment)
 * which permits bespoke choreography for the four named moments.
 *
 * Reduced-motion: returns the static, final-state composition with no
 * animation, no pulse, no draw. The ambient occupancy pulse is suppressed.
 */

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.22,
    },
  },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: ease.out } },
};

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: ease.out },
  },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: ease.out },
  },
};

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: ease.out },
  },
};

export function HeroOverlays() {
  const prefersReducedMotion = useReducedMotion();

  // Reduced-motion: render once in the final visible state. No animation,
  // no ambient pulse on the occupancy node.
  if (prefersReducedMotion) {
    return <StaticOverlays />;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Camera FOV cone — top left */}
      <motion.svg
        viewBox="0 0 140 100"
        className="absolute left-6 top-20 w-28 text-text-low/60 sm:left-12 sm:top-24 sm:w-32 lg:left-20 lg:top-28 lg:w-36"
        variants={fadeScale}
      >
        <motion.path
          d="M 130 50 L 12 12 L 12 88 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          variants={draw}
        />
        <circle cx="130" cy="50" r="2.5" fill="currentColor" />
      </motion.svg>

      {/* 2. Status pill — top right */}
      <motion.div
        className="absolute right-6 top-20 flex items-center gap-2 rounded-full border border-border/40 bg-surface/40 px-3 py-1.5 backdrop-blur-sm sm:right-12 sm:top-24 lg:right-20 lg:top-28"
        variants={fade}
      >
        <motion.span
          className="size-1.5 rounded-full bg-signal-ok"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mid">
          Operations · Healthy
        </span>
      </motion.div>

      {/* 3. Network mesh path — mid, diagonal */}
      <motion.svg
        viewBox="0 0 800 80"
        preserveAspectRatio="none"
        className="absolute left-1/2 top-[58%] hidden h-16 w-[80%] -translate-x-1/2 text-text-low/40 sm:block lg:w-[60%]"
        variants={fade}
      >
        <motion.path
          d="M 0 60 L 180 30 L 380 50 L 580 22 L 800 48"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
          variants={draw}
        />
        {[
          [0, 60],
          [180, 30],
          [380, 50],
          [580, 22],
          [800, 48],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2"
            fill="currentColor"
            opacity="0.7"
          />
        ))}
      </motion.svg>

      {/* 4. Occupancy node — lower left with ambient pulse aura */}
      <motion.div
        className="absolute bottom-24 left-8 sm:bottom-32 sm:left-16 lg:bottom-40 lg:left-24"
        variants={pop}
      >
        <span className="relative block size-2 rounded-full bg-accent-soft">
          <motion.span
            className="absolute inset-0 rounded-full bg-accent-soft"
            animate={{ scale: [1, 2.6], opacity: [0.45, 0] }}
            transition={{
              duration: 1.8,
              ease: "easeOut",
              repeat: Infinity,
            }}
          />
        </span>
      </motion.div>

      {/* 5. Signal arc — lower right, concentric arcs */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute bottom-20 right-8 w-20 text-text-low/55 sm:bottom-28 sm:right-16 sm:w-24 lg:bottom-36 lg:right-24 lg:w-28"
        variants={fade}
      >
        <motion.path
          d="M 15 92 A 25 25 0 0 1 92 15"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          variants={draw}
        />
        <motion.path
          d="M 15 92 A 45 45 0 0 1 92 -5"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          variants={draw}
          opacity="0.7"
        />
        <motion.path
          d="M 15 92 A 65 65 0 0 1 92 -25"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          variants={draw}
          opacity="0.45"
        />
        <circle cx="15" cy="92" r="2.5" fill="currentColor" />
      </motion.svg>
    </motion.div>
  );
}

/**
 * Reduced-motion fallback. Identical visual composition, no animation,
 * no infinite pulse on the occupancy node or status dot.
 */
function StaticOverlays() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 140 100"
        className="absolute left-6 top-20 w-28 text-text-low/60 sm:left-12 sm:top-24 sm:w-32 lg:left-20 lg:top-28 lg:w-36"
      >
        <path d="M 130 50 L 12 12 L 12 88 Z" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="130" cy="50" r="2.5" fill="currentColor" />
      </svg>

      <div className="absolute right-6 top-20 flex items-center gap-2 rounded-full border border-border/40 bg-surface/40 px-3 py-1.5 backdrop-blur-sm sm:right-12 sm:top-24 lg:right-20 lg:top-28">
        <span className="size-1.5 rounded-full bg-signal-ok" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mid">
          Operations · Healthy
        </span>
      </div>

      <svg
        viewBox="0 0 800 80"
        preserveAspectRatio="none"
        className="absolute left-1/2 top-[58%] hidden h-16 w-[80%] -translate-x-1/2 text-text-low/40 sm:block lg:w-[60%]"
      >
        <path
          d="M 0 60 L 180 30 L 380 50 L 580 22 L 800 48"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        {[
          [0, 60],
          [180, 30],
          [380, 50],
          [580, 22],
          [800, 48],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2"
            fill="currentColor"
            opacity="0.7"
          />
        ))}
      </svg>

      <div className="absolute bottom-24 left-8 sm:bottom-32 sm:left-16 lg:bottom-40 lg:left-24">
        <span className="block size-2 rounded-full bg-accent-soft" />
      </div>

      <svg
        viewBox="0 0 100 100"
        className="absolute bottom-20 right-8 w-20 text-text-low/55 sm:bottom-28 sm:right-16 sm:w-24 lg:bottom-36 lg:right-24 lg:w-28"
      >
        <path d="M 15 92 A 25 25 0 0 1 92 15" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 15 92 A 45 45 0 0 1 92 -5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
        <path d="M 15 92 A 65 65 0 0 1 92 -25" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
        <circle cx="15" cy="92" r="2.5" fill="currentColor" />
      </svg>
    </div>
  );
}
