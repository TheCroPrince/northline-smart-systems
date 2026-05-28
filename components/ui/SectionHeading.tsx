import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  /** Optional eyebrow label, e.g. "01 / SERVICES". */
  eyebrow?: ReactNode;
  /** Main H2 headline. Per COPY_VOICE §5: sentence case, 3-6 words, period-terminated. */
  title: ReactNode;
  /** Optional supporting line below the headline. */
  subhead?: ReactNode;
  /** Horizontal alignment. Defaults to left (more architectural per DESIGN_MOTION §9). */
  align?: "left" | "center";
  className?: string;
}

/**
 * Composed section heading: eyebrow → headline → subhead, revealed in order.
 *
 * Reveal sequence (DESIGN_MOTION §11):
 *  - eyebrow:   fade in immediately on viewport entry
 *  - headline:  rise, offset ~120ms behind eyebrow
 *  - subhead:   fade, offset ~280ms behind eyebrow
 *
 * Typography per DESIGN_MOTION §9. The H2 spans clamped sizes from 44px to 56px.
 */
export function SectionHeading({
  eyebrow,
  title,
  subhead,
  align = "left",
  className,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start";

  return (
    <div className={cn("flex flex-col", alignment, className)}>
      {eyebrow ? (
        <Reveal variant="fade" className="mb-5">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <Reveal variant="rise" delay={eyebrow ? 120 : 0}>
        <h2 className="font-sans text-[2.5rem] leading-[1.05] font-medium tracking-[-0.02em] text-text-hi sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h2>
      </Reveal>

      {subhead ? (
        <Reveal
          variant="fade"
          delay={eyebrow ? 280 : 160}
          className={cn("mt-5 max-w-2xl", align === "center" && "mx-auto")}
        >
          <p className="text-base leading-relaxed text-text-mid sm:text-lg">
            {subhead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
