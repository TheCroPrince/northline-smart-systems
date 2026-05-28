import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /**
   * Opts into the Lift + Brighten + Reveal hover language per DESIGN_MOTION §14.
   * Static cards (with no destination) should leave this false — per
   * DESIGN_MOTION §4, a card that lifts on hover implies clickability.
   */
  interactive?: boolean;
  /**
   * Optional href. Renders the card as a Next.js Link. Implies `interactive`.
   */
  href?: string;
  /**
   * Override the element type for non-link, non-button cards.
   * Defaults to `div`. Use `article`, `li`, etc. for semantic correctness.
   */
  as?: ElementType;
}

/**
 * Canonical glass surface. Source: DESIGN_MOTION §7.
 *
 * Recipe (locked):
 *  - background: --surface @ 55%
 *  - backdrop-filter: blur(24px) saturate(140%)
 *  - border: 1px solid rgba(255,255,255,0.06)
 *  - shadow: --shadow-1
 *
 * Interactive variant (Lift + Brighten + Reveal):
 *  - background brightens toward --surface-elev @ 65%
 *  - border opacity rises from 6% → 10%
 *  - shadow swaps to --shadow-2
 *  - element lifts 2px (suppressed under prefers-reduced-motion per §16)
 *  - children may use `group-hover:*` to add their own reveal element
 */
const baseStyles = cn(
  "relative isolate overflow-hidden rounded-2xl",
  "border border-white/6",
  "bg-surface/55 backdrop-blur-xl backdrop-saturate-[1.4]",
  "shadow-[var(--shadow-1)]",
);

const interactiveStyles = cn(
  "group cursor-pointer",
  "transition duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
  "hover:border-white/10 hover:bg-surface-elev/65 hover:shadow-[var(--shadow-2)]",
  "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
);

export function GlassCard({
  children,
  className,
  interactive = false,
  href,
  as,
}: GlassCardProps) {
  const isInteractive = interactive || href !== undefined;
  const classes = cn(
    baseStyles,
    isInteractive && interactiveStyles,
    className,
  );

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
