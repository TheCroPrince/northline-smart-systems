"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * LampContainer (Aceternity-inspired), rebuilt for Northline.
 *
 * Why this shape:
 *  - The earlier version split the light into two mirrored conic-gradient beams
 *    meeting at 50%. Any pixel offset there showed a seam; overlapping them just
 *    turned the seam into a brighter doubled line. So the whole light is now
 *    produced by **centered, symmetric radial layers** — there is no left/right
 *    boundary, therefore no center seam is possible.
 *  - Top-anchored band keeps the light at a consistent place across viewport
 *    heights; content flows beneath it (no forced 100svh void).
 *  - Animates on MOUNT via transforms (scaleY/scaleX) — no width/rem animation.
 *
 * Reduced motion: everything renders at its final state with no animation.
 */
export function LampContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const transition = { delay: 0.3, duration: 1.1, ease: "easeInOut" as const };

  // Glows grow downward from the filament (origin top) and fade in.
  const glow: Variants | undefined = reduce
    ? undefined
    : {
        initial: { opacity: 0, scaleY: 0.6 },
        animate: { opacity: 1, scaleY: 1, transition },
      };
  // The filament bar widens from the center.
  const bar: Variants | undefined = reduce
    ? undefined
    : {
        initial: { opacity: 0.4, scaleX: 0.3 },
        animate: { opacity: 1, scaleX: 1, transition },
      };

  const radial = (stops: string): CSSProperties => ({
    backgroundImage: `radial-gradient(ellipse 62% 82% at 50% 0%, ${stops})`,
  });

  return (
    <div
      className={cn(
        "relative isolate z-0 w-full overflow-hidden bg-ink-0",
        className,
      )}
    >
      {/* Lamp light — top-anchored band, all layers centered and symmetric. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 flex h-[26rem] items-center justify-center overflow-hidden sm:h-[30rem] lg:h-[34rem]">
        {/* Broad ambient pool */}
        <motion.div
          variants={glow}
          initial={glow ? "initial" : false}
          animate={glow ? "animate" : false}
          style={radial(
            "color-mix(in srgb, var(--accent) 34%, transparent), transparent 72%",
          )}
          className="absolute inset-auto h-64 w-[24rem] max-w-[94vw] origin-top -translate-y-[5rem] blur-2xl [will-change:transform,opacity] sm:h-80 sm:w-[42rem]"
        />

        {/* Bright defined core */}
        <motion.div
          variants={glow}
          initial={glow ? "initial" : false}
          animate={glow ? "animate" : false}
          style={radial(
            "color-mix(in srgb, var(--accent-bright) 60%, transparent), color-mix(in srgb, var(--accent) 22%, transparent) 42%, transparent 76%",
          )}
          className="absolute inset-auto h-52 w-[18rem] max-w-[80vw] origin-top -translate-y-[5.5rem] blur-[34px] [will-change:transform,opacity] sm:h-64 sm:w-[27rem]"
        />

        {/* Hotspot directly under the filament */}
        <motion.div
          variants={glow}
          initial={glow ? "initial" : false}
          animate={glow ? "animate" : false}
          style={radial(
            "color-mix(in srgb, var(--accent-bright) 78%, transparent), transparent 70%",
          )}
          className="absolute inset-auto h-16 w-44 origin-top -translate-y-[6.6rem] blur-xl [will-change:transform,opacity] sm:h-20 sm:w-60"
        />

        {/* Bright filament bar */}
        <motion.div
          variants={bar}
          initial={bar ? "initial" : false}
          animate={bar ? "animate" : false}
          className="absolute inset-auto h-0.5 w-[20rem] max-w-[86vw] origin-center -translate-y-[7rem] rounded-full bg-accent-bright [will-change:transform,opacity] sm:w-[30rem]"
        />
      </div>

      {/* Content — normal flow beneath the light. */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-20 pt-[13.5rem] text-center sm:pb-24 sm:pt-[16.5rem] lg:pb-28 lg:pt-[20rem]">
        {children}
      </div>
    </div>
  );
}
