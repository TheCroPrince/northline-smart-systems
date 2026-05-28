"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Glow color (any CSS color). Defaults to the teal accent. */
  glow?: string;
  /** Render a dotted texture layer that brightens toward the cursor. */
  dotted?: boolean;
  as?: "div" | "li" | "article";
}

/**
 * A card surface with a cursor-following radial spotlight and optional dotted
 * texture. The glow is an ambient richness effect, not a click affordance, so
 * it suits non-interactive feature cards.
 *
 * The spotlight is driven by CSS custom properties updated on pointer move,
 * which keeps it cheap (no React re-render per frame). It fades in on hover and
 * is inert under pointer-coarse / reduced-motion (no hover, so it never shows).
 */
export function SpotlightCard({
  children,
  className,
  glow = "color-mix(in srgb, var(--accent) 22%, transparent)",
  dotted = false,
  as = "div",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const Component = as;

  function handleMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      onPointerMove={handleMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={cn("group relative overflow-hidden", className)}
    >
      {/* Spotlight glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(360px circle at var(--mx) var(--my), ${glow}, transparent 60%)`,
        }}
      />

      {/* Dotted texture that brightens toward the cursor */}
      {dotted ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 transition-opacity duration-300"
          style={{
            opacity: active ? 0.5 : 0.18,
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--accent) 32%, transparent) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), black, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), black, transparent 70%)",
          }}
        />
      ) : null}

      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </Component>
  );
}
