"use client";

import { useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const COLUMNS = 14;
const ROWS = 9;
const TOTAL = COLUMNS * ROWS;

/**
 * Dotted-glow background card (Aceternity "glowing stars" family).
 *
 * A deterministic grid of dots sits behind the content. A fixed pseudo-random
 * subset twinkles; on hover the whole field brightens and a teal glow swells
 * from the top. Deterministic selection (no Math.random) keeps SSR and client
 * markup identical — no hydration mismatch.
 */
export function GlowingStarsCard({
  children,
  className,
  as,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const [hovered, setHovered] = useState(false);
  const Component = as ?? "div";

  return (
    <Component
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative h-full overflow-hidden rounded-[1.75rem] border border-border-soft bg-surface p-7 transition-colors duration-300 hover:border-accent/40",
        className,
      )}
    >
      {/* Top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0.5,
          background:
            "radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />

      {/* Dot field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid p-5"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => {
          // Deterministic "twinkle" subset.
          const isStar = (i * 7 + 3) % 11 === 0 || (i * 13 + 5) % 17 === 0;
          const delay = (i % 9) * 0.35;
          return (
            <div key={i} className="flex items-center justify-center">
              <span
                className={cn(
                  "size-[2px] rounded-full transition-all duration-500",
                  isStar
                    ? "bg-accent-bright"
                    : "bg-border-strong",
                )}
                style={{
                  opacity: isStar ? (hovered ? 0.9 : 0.5) : hovered ? 0.4 : 0.22,
                  boxShadow:
                    isStar && hovered
                      ? "0 0 8px 1px color-mix(in srgb, var(--accent) 60%, transparent)"
                      : "none",
                  animation: isStar
                    ? `nl-twinkle 3.2s ease-in-out ${delay}s infinite`
                    : undefined,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </Component>
  );
}
