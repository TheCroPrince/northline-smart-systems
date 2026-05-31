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
 *  - The glow layers are anchored to the filament line and grow **downward**
 *    only. They live inside a clipped, top-masked cone wrapper, so no light can
 *    pool above the bar (the bug where the glow appeared to float upward came
 *    from centering the layers in the band — their bright point, `at 50% 0%`,
 *    landed *above* the filament). Now the brightest wash sits just below the
 *    bar and fades down onto the headline.
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
        initial: { opacity: 0, scaleY: 0.55 },
        animate: { opacity: 1, scaleY: 1, transition },
      };
  // The filament bar widens from the center.
  const bar: Variants | undefined = reduce
    ? undefined
    : {
        initial: { opacity: 0.4, scaleX: 0.3 },
        animate: { opacity: 1, scaleX: 1, transition },
      };

  // Brightest at the top (the filament), fading down — a downward cast.
  const radial = (shape: string, stops: string): CSSProperties => ({
    backgroundImage: `radial-gradient(${shape} at 50% 0%, ${stops})`,
  });

  return (
    <div
      className={cn(
        "relative isolate z-0 w-full overflow-hidden bg-ink-0",
        className,
      )}
    >
      {/* Lamp light — top-anchored band. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[26rem] overflow-hidden sm:h-[30rem] lg:h-[34rem]">
        {/* Downward cone: clipped at the filament line and soft-masked across the
            top, so the glow ramps in just *below* the bar — never above it. */}
        <div className="absolute inset-x-0 bottom-0 top-[6rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_16%)] sm:top-[7.5rem] lg:top-[9rem]">
          {/* Broad ambient pool */}
          <motion.div
            variants={glow}
            initial={glow ? "initial" : false}
            animate={glow ? "animate" : false}
            style={radial(
              "ellipse 72% 82%",
              "color-mix(in srgb, var(--accent) 32%, transparent), transparent 72%",
            )}
            className="absolute left-1/2 top-0 h-72 w-[24rem] max-w-[94vw] origin-top -translate-x-1/2 blur-2xl [will-change:transform,opacity] sm:h-[24rem] sm:w-[44rem]"
          />

          {/* Bright defined core */}
          <motion.div
            variants={glow}
            initial={glow ? "initial" : false}
            animate={glow ? "animate" : false}
            style={radial(
              "ellipse 56% 80%",
              "color-mix(in srgb, var(--accent-bright) 58%, transparent), color-mix(in srgb, var(--accent) 22%, transparent) 44%, transparent 76%",
            )}
            className="absolute left-1/2 top-0 h-56 w-[18rem] max-w-[80vw] origin-top -translate-x-1/2 blur-[34px] [will-change:transform,opacity] sm:h-72 sm:w-[28rem]"
          />

          {/* Hotspot right under the filament */}
          <motion.div
            variants={glow}
            initial={glow ? "initial" : false}
            animate={glow ? "animate" : false}
            style={radial(
              "ellipse 60% 66%",
              "color-mix(in srgb, var(--accent-bright) 80%, transparent), transparent 66%",
            )}
            className="absolute left-1/2 top-0 h-24 w-44 origin-top -translate-x-1/2 blur-xl [will-change:transform,opacity] sm:h-28 sm:w-60"
          />
        </div>

        {/* Bright filament bar — crisp, sitting on the cone's top edge. */}
        <motion.div
          variants={bar}
          initial={bar ? "initial" : false}
          animate={bar ? "animate" : false}
          className="absolute left-1/2 top-[6rem] h-0.5 w-[20rem] max-w-[86vw] origin-center -translate-x-1/2 rounded-full bg-accent-bright [will-change:transform,opacity] sm:top-[7.5rem] sm:w-[30rem] lg:top-[9rem]"
        />
      </div>

      {/* Content — normal flow beneath the light. */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-20 pt-[13.5rem] text-center sm:pb-24 sm:pt-[16.5rem] lg:pb-28 lg:pt-[20rem]">
        {children}
      </div>
    </div>
  );
}
