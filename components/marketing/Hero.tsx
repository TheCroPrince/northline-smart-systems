"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CanvasText } from "@/components/ui/canvas-text";
import { Container } from "@/components/ui/Container";
import { LampContainer } from "@/components/ui/lamp";
import { cn } from "@/lib/cn";

/**
 * Hero — lamp section header with the headline rising into the light.
 *
 * "Smart systems." renders as clean serif; "Designed to disappear." is the
 * signature Canvas Text moment (animated lines clipped through the glyphs).
 *
 * The "Now serving…" badge lives in the nav on desktop (≥lg) and drops beneath
 * the CTAs on smaller screens.
 *
 * The previous smart-home device card lives in
 * `components/marketing/hero/SmartHomeCard.tsx` (preserved, unmounted).
 */
export function Hero() {
  const reduce = useReducedMotion();

  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 90 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-ink-0"
    >
      {/* Floating nav */}
      <header className="absolute inset-x-0 top-0 z-50">
        <Container>
          <div className="flex items-center justify-between py-7">
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg tracking-tight text-text-hi sm:text-xl">
                  Northline
                </span>
                <span className="font-display text-lg italic text-accent-bright sm:text-xl">
                  smart systems
                </span>
              </div>
              <span className="hidden h-5 w-px bg-border lg:block" aria-hidden />
              <ServingBadge className="hidden lg:inline-flex" />
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-text-mid sm:flex">
              <a href="#services" className="transition-colors hover:text-text-hi">
                Services
              </a>
              <a href="#systems" className="transition-colors hover:text-text-hi">
                Systems
              </a>
              <a href="#operations" className="transition-colors hover:text-text-hi">
                Operations
              </a>
              <a href="/portal" className="transition-colors hover:text-text-hi">
                Portal
              </a>
              <Button variant="secondary" className="h-10 px-5 text-xs" href="#contact">
                Book a consultation
              </Button>
            </nav>
          </div>
        </Container>
      </header>

      {/* Lamp + headline */}
      <LampContainer>
        <motion.div {...rise} className="flex flex-col items-center text-center">
          <h1
            id="hero-headline"
            className="flex flex-col items-center font-display leading-[1.04] tracking-tight"
          >
            <span className="text-[clamp(2.25rem,10vw,5.75rem)] text-text-hi">
              Smart systems.
            </span>
            <CanvasText
              text="Designed to disappear."
              align="center"
              className="font-display italic leading-[1.2] text-[clamp(2.25rem,10vw,5.75rem)]"
            />
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-text-mid sm:mt-7 sm:max-w-xl sm:text-lg">
            Northline designs, installs, and monitors the technology behind
            modern homes and commercial properties. One company, one project
            lead, one system you can trust to recede into the architecture.
          </p>

          <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
            <Button variant="primary">
              Book a consultation
              <ArrowRight size={16} strokeWidth={2} aria-hidden />
            </Button>
            <Button variant="secondary" href="#services">
              Explore systems
            </Button>
          </div>

          {/* Badge drops below the CTAs on mobile/tablet */}
          <ServingBadge className="mt-8 inline-flex max-w-full lg:hidden" />
        </motion.div>
      </LampContainer>
    </section>
  );
}

function ServingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "items-center gap-2.5 rounded-full border border-border bg-surface/50 px-4 py-1.5 backdrop-blur-sm",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-accent-bright" />
      <span className="text-xs font-medium tracking-tight text-text-mid">
        Now serving Canada and the United States
      </span>
    </span>
  );
}
