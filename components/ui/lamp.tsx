"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * LampContainer (Aceternity-style), adapted for Northline.
 *
 * Implementation notes:
 *  - The lamp lives above the fold, so its beams animate on MOUNT (not on view).
 *  - Growth is driven by `scaleX` / `scale` transforms (reliably animatable,
 *    unit-agnostic) rather than animating `width` in rem.
 *  - The light is a **top-anchored band** of fixed height, and the content sits
 *    beneath it in normal flow with responsive padding. This is height-
 *    independent: the light no longer drifts off-screen on short viewports, the
 *    headline never collides with the nav, and there is no forced 100svh of
 *    empty space below the content.
 *
 * Reduced motion: everything renders at its final transform with no animation.
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

  const grow = (fromScaleX: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { scaleX: fromScaleX, opacity: 0.5 },
          animate: { scaleX: 1, opacity: 1 },
          transition,
        };

  const growUniform = (fromScale: number, toOpacity: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { scale: fromScale, opacity: toOpacity * 0.6 },
          animate: { scale: 1, opacity: toOpacity },
          transition,
        };

  return (
    <div
      className={cn(
        "relative isolate z-0 w-full overflow-hidden bg-ink-0",
        className,
      )}
    >
      {/* Lamp light — a top-anchored band so the glow sits at a consistent place. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 flex h-[26rem] scale-y-110 items-center justify-center overflow-hidden sm:h-[30rem] sm:scale-y-125 lg:h-[34rem]">
        {/* Left beam — grows from its apex (top-right, at screen center) */}
        <motion.div
          {...grow(0.35)}
          style={{
            backgroundImage:
              "conic-gradient(from 70deg at center top, var(--accent), transparent, transparent)",
          }}
          className="absolute inset-auto right-[calc(50%-3px)] h-56 w-[30rem] origin-top-right overflow-visible text-white [will-change:transform]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-ink-0 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-ink-0 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right beam — grows from its apex (top-left, at screen center) */}
        <motion.div
          {...grow(0.35)}
          style={{
            backgroundImage:
              "conic-gradient(from 290deg at center top, transparent, transparent, var(--accent))",
          }}
          className="absolute inset-auto left-[calc(50%-3px)] h-56 w-[30rem] origin-top-left text-white [will-change:transform]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-ink-0 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-ink-0 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Haze + base masks */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-ink-0 blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Core glow — kept tight and dim near the filament on small screens so
            it supports the headline rather than pooling over it; full pool on
            larger screens where there is vertical room. */}
        <div className="absolute inset-auto z-50 h-24 w-72 max-w-[78vw] -translate-y-[7.5rem] rounded-full bg-accent opacity-[0.22] blur-2xl sm:h-36 sm:w-[28rem] sm:max-w-[90vw] sm:-translate-y-1/2 sm:opacity-40 sm:blur-3xl" />

        {/* Filament glow */}
        <motion.div
          {...growUniform(0.5, 0.6)}
          className="absolute inset-auto z-30 h-28 w-56 max-w-[70vw] -translate-y-[6rem] rounded-full bg-accent-bright blur-2xl sm:h-36 sm:w-64 sm:max-w-[80vw]"
        />

        {/* Bright filament line */}
        <motion.div
          {...grow(0.4)}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] max-w-[86vw] origin-top -translate-y-[7rem] bg-accent-bright"
        />

        {/* Top cap hiding the beams' origin */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-ink-0" />
      </div>

      {/* Content — normal flow beneath the light. Padding positions it under the
          glow and gives intentional bottom breathing room (no 100svh void). */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-20 pt-[13.5rem] text-center sm:pb-24 sm:pt-[16.5rem] lg:pb-28 lg:pt-[20rem]">
        {children}
      </div>
    </div>
  );
}
