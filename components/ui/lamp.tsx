"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * LampContainer (Aceternity-style), adapted for Northline: teal beams on a warm
 * ink background. On view, the conic beams and the bright filament widen and
 * brighten — the lamp "comes forward." Children sit just beneath the light;
 * wrap them in a rising motion in the consumer to lift them toward the glow.
 *
 * Reduced motion: beams render at full width with no animation (the className
 * widths stand; no motion props are applied).
 */
export function LampContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const transition = { delay: 0.3, duration: 1, ease: "easeInOut" as const };

  const beam = reduce
    ? {}
    : {
        initial: { width: "15rem", opacity: 0.5 },
        whileInView: { width: "30rem", opacity: 1 },
        viewport: { once: true },
        transition,
      };
  const filamentGlow = reduce
    ? {}
    : {
        initial: { width: "8rem" },
        whileInView: { width: "16rem" },
        viewport: { once: true },
        transition,
      };
  const filamentLine = reduce
    ? {}
    : {
        initial: { width: "15rem" },
        whileInView: { width: "30rem" },
        viewport: { once: true },
        transition,
      };

  return (
    <div
      className={cn(
        "relative isolate z-0 flex w-full flex-col items-center justify-center overflow-hidden bg-ink-0",
        className,
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left beam */}
        <motion.div
          {...beam}
          style={{
            backgroundImage:
              "conic-gradient(from 70deg at center top, var(--accent), transparent, transparent)",
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible text-white"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-ink-0 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-ink-0 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right beam */}
        <motion.div
          {...beam}
          style={{
            backgroundImage:
              "conic-gradient(from 290deg at center top, transparent, transparent, var(--accent))",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] text-white"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-ink-0 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-ink-0 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Haze + base masks */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-ink-0 blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Core glow */}
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-accent opacity-40 blur-3xl" />

        {/* Filament glow */}
        <motion.div
          {...filamentGlow}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-accent-bright opacity-60 blur-2xl"
        />

        {/* Bright filament line */}
        <motion.div
          {...filamentLine}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-accent-bright"
        />

        {/* Top cap hiding the beams' origin */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-ink-0" />
      </div>

      <div className="relative z-50 flex -translate-y-[10rem] flex-col items-center px-5 sm:-translate-y-[12rem]">
        {children}
      </div>
    </div>
  );
}
