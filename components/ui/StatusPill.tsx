import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "healthy" | "notice" | "warning" | "muted";

interface StatusPillProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  healthy: "border-accent/30 bg-accent-tint text-accent-soft",
  notice: "border-gold/30 bg-gold/10 text-gold",
  warning: "border-signal-warm/35 bg-signal-warm/10 text-signal-warm",
  muted: "border-border bg-surface-2 text-text-mid",
};

export function StatusPill({
  children,
  tone = "muted",
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium tracking-tight",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

