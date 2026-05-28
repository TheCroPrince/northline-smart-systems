import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /** Color tone. Defaults to accent (teal). Use "ink" on dark backgrounds. */
  tone?: "accent" | "ink" | "mute";
}

/**
 * Section label. Replaces the prior mono-uppercase pattern with a refined
 * editorial label: short hairline + sans-semibold accent text, sentence-cased.
 *
 *   ─── Services
 *
 * Keeps the section navigation cue without the SaaS "01 / SERVICES" energy.
 */
export function Eyebrow({ children, className, tone = "accent" }: EyebrowProps) {
  const colors = {
    accent: { line: "bg-accent", text: "text-accent" },
    ink: { line: "bg-text-on-ink", text: "text-text-on-ink" },
    mute: { line: "bg-text-mid/60", text: "text-text-mid" },
  }[tone];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className={cn("h-px w-7", colors.line)} aria-hidden />
      <span className={cn("text-sm font-medium tracking-tight", colors.text)}>
        {children}
      </span>
    </div>
  );
}
