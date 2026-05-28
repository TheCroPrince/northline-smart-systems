import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/**
 * The small uppercase section label per DESIGN_MOTION §13.
 *
 * Example: `<Eyebrow>01 / SERVICES</Eyebrow>`.
 *
 * Mono, 12px, wide tracking, low-contrast. Intentionally quiet. Each section
 * opens with one; the Trust strip and Hero are exceptions.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-[0.2em] text-text-low",
        className,
      )}
    >
      {children}
    </p>
  );
}
