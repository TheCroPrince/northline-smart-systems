import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Opts into Lift + Brighten hover language. */
  interactive?: boolean;
  href?: string;
  as?: ElementType;
}

/**
 * Canonical card surface in the Northline v2 system.
 *
 * Renamed in intent (was a frosted-glass treatment in v1; now a clean white
 * product card with warm shadow). Component name preserved to keep imports
 * stable across the codebase.
 *
 * Static: bright surface, hairline border, warm soft shadow.
 * Interactive: lifts 4px, shadow deepens, border picks up an accent tint.
 *              Lift suppressed under prefers-reduced-motion.
 */
const baseStyles = cn(
  "relative overflow-hidden rounded-[1.75rem]",
  "border border-border-soft bg-surface",
  "shadow-[var(--shadow-card)]",
);

const interactiveStyles = cn(
  "group cursor-pointer",
  "transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  "hover:border-accent/40 hover:shadow-[var(--shadow-card-hover)]",
  "hover:-translate-y-1 motion-reduce:hover:translate-y-0",
);

export function GlassCard({
  children,
  className,
  interactive = false,
  href,
  as,
}: GlassCardProps) {
  const isInteractive = interactive || href !== undefined;
  const classes = cn(baseStyles, isInteractive && interactiveStyles, className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const Component = as ?? "div";
  return <Component className={classes}>{children}</Component>;
}
