import { ArrowRight } from "lucide-react";
import { SmartHomeCard } from "@/components/marketing/hero/SmartHomeCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TextHoverEffect } from "@/components/ui/TextHoverEffect";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-bg-0"
    >
      {/* Atmospheric background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background: `
            radial-gradient(ellipse 60% 55% at 88% 12%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%),
            radial-gradient(ellipse 55% 45% at 6% 92%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 60%),
            var(--bg-0)
          `,
        }}
      />
      {/* faint dotted texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--border-strong) 40%, transparent) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)",
        }}
      />

      <Container className="relative">
        {/* Minimal top nav */}
        <header className="flex items-center justify-between py-7">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-tight text-text-hi">
              Northline
            </span>
            <span className="font-display text-xl italic text-accent">
              smart systems
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-text-mid sm:flex">
            <a href="#services" className="transition-colors hover:text-text-hi">
              Services
            </a>
            <a href="#systems" className="transition-colors hover:text-text-hi">
              Systems
            </a>
            <a href="/portal" className="transition-colors hover:text-text-hi">
              Portal
            </a>
            <Button variant="secondary" className="h-10 px-5 text-xs" href="#contact">
              Book a consultation
            </Button>
          </nav>
        </header>

        {/* Hero body — split layout */}
        <div className="grid items-center gap-10 pb-20 pt-10 sm:pt-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 lg:pb-32 lg:pt-16">
          {/* Left: text */}
          <div className="max-w-2xl">
            <Reveal variant="fade">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 px-4 py-1.5 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-accent" />
                <span className="text-xs font-medium tracking-tight text-text-mid">
                  Now serving Canada and the United States
                </span>
              </div>
            </Reveal>

            {/* Real heading for a11y / SEO */}
            <h1 id="hero-headline" className="sr-only">
              Smart systems. Designed to disappear.
            </h1>

            {/* Canvas / clipped-gradient headline */}
            <div className="mt-6 select-none" aria-hidden>
              <div className="w-[64%]">
                <TextHoverEffect text="Smart systems." />
              </div>
              <div className="-mt-2 w-full sm:-mt-3">
                <TextHoverEffect text="Designed to disappear." italic duration={1.5} />
              </div>
            </div>

            <Reveal variant="fade" delay={500}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-text-mid">
                Northline designs, installs, and monitors the technology behind
                modern homes and commercial properties. One company, one project
                lead, one system you can trust to recede into the architecture.
              </p>
            </Reveal>

            <Reveal variant="fade" delay={650}>
              <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button variant="primary">
                  Book a consultation
                  <ArrowRight size={16} strokeWidth={2} aria-hidden />
                </Button>
                <Button variant="secondary" href="#systems">
                  See how it works
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Right: dark device card */}
          <Reveal variant="fade" delay={400}>
            <SmartHomeCard />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
