"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { fadeIn, rise, settle } from "@/lib/motion";

export type RevealVariant = "rise" | "fade" | "settle";

interface RevealProps {
  children: ReactNode;
  /** Which motion primitive to use. Defaults to "rise" for primary content. */
  variant?: RevealVariant;
  /** Optional delay in milliseconds, added to the variant's visible transition. */
  delay?: number;
  className?: string;
}

const variantsByName: Record<RevealVariant, Variants> = {
  rise,
  fade: fadeIn,
  settle,
};

/**
 * Shared scroll reveal wrapper. Source of truth: DESIGN_MOTION §10, §11, §12, §16.
 *
 * - Triggers when the element is 25% into the viewport.
 * - Plays once per page (no re-trigger on scroll-back).
 * - Uses only the locked motion primitives from `lib/motion.ts`.
 * - Honors `prefers-reduced-motion`: renders children in final state with no motion.
 *
 * Component renders a `motion.div`. To compose semantic markup (lists, headings,
 * etc.), put the semantic element inside the Reveal.
 */
export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  className,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseVariants = variantsByName[variant];

  // Reduced-motion: render children directly in their final state. No initial
  // hidden style, no animation, no useInView subscription.
  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  const variants: Variants = delay
    ? withDelay(baseVariants, delay)
    : baseVariants;

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Compose a `delay` into the visible-state transition without dropping the
 * variant's locked duration / ease.
 */
function withDelay(base: Variants, delayMs: number): Variants {
  const visible = base.visible as { transition?: Record<string, unknown> } & Record<string, unknown>;
  const baseTransition = (visible.transition ?? {}) as Record<string, unknown>;
  return {
    hidden: base.hidden,
    visible: {
      ...visible,
      transition: {
        ...baseTransition,
        delay: delayMs / 1000,
      },
    },
  };
}
