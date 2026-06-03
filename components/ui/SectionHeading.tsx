import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subhead?: ReactNode;
  align?: "left" | "center";
  /** Color register. `light` is the default (paper surfaces). `ink` for dark sections. */
  tone?: "light" | "ink";
  className?: string;
}

/**
 * Composed section heading: eyebrow → serif H2 → optional subhead.
 *
 * H2 uses Instrument Serif (var(--font-display)) for editorial weight.
 * The reveal sequence stays: fade-in eyebrow, rise H2, fade subhead.
 */
export function SectionHeading({
  eyebrow,
  title,
  subhead,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start";
  const titleColor = tone === "ink" ? "text-text-on-ink" : "text-text-hi";
  const subheadColor = tone === "ink" ? "text-text-on-ink-mid" : "text-text-mid";

  return (
    <div className={cn("flex flex-col", alignment, className)}>
      {eyebrow ? (
        <Reveal variant="fade" className="mb-6">
          <Eyebrow tone={tone === "ink" ? "ink" : "accent"}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <Reveal variant="rise" delay={eyebrow ? 120 : 0}>
        <h2
          className={cn(
            "text-balance font-display text-[2.5rem] leading-[1.04] tracking-[-0.015em] sm:text-5xl lg:text-[3.5rem]",
            titleColor,
          )}
        >
          {title}
        </h2>
      </Reveal>

      {subhead ? (
        <Reveal
          variant="fade"
          delay={eyebrow ? 280 : 160}
          className={cn("mt-6 max-w-2xl", align === "center" && "mx-auto")}
        >
          <p className={cn("text-pretty text-base leading-relaxed sm:text-lg", subheadColor)}>
            {subhead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
