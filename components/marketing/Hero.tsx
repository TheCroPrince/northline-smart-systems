import { ArrowRight } from "lucide-react";
import { SmartHomeCard } from "@/components/marketing/hero/SmartHomeCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { WordReveal } from "@/components/ui/WordReveal";

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
            radial-gradient(ellipse 60% 50% at 85% 15%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 90%, color-mix(in srgb, var(--gold) 12%, transparent), transparent 60%),
            var(--bg-0)
          `,
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
        <div className="grid items-center gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-32 lg:pt-20">
          {/* Left: text */}
          <div className="max-w-xl">
            <Reveal variant="fade">
              <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface/70 px-4 py-1.5 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-accent" />
                <span className="text-xs font-medium tracking-tight text-text-mid">
                  Now serving Canada and the United States
                </span>
              </div>
            </Reveal>

            <h1
              id="hero-headline"
              className="mt-7 font-display text-[3.5rem] leading-[0.96] tracking-[-0.025em] text-text-hi sm:text-[5rem] lg:text-[6.5rem]"
            >
              <WordReveal>Smart systems.</WordReveal>
              <span className="block italic text-accent">
                <WordReveal delay={400}>Designed to disappear.</WordReveal>
              </span>
            </h1>

            <Reveal variant="fade" delay={1100}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-text-mid">
                Northline designs, installs, and monitors the technology behind
                modern homes and commercial properties. One company, one
                project lead, one system you can trust to recede into the
                architecture.
              </p>
            </Reveal>

            <Reveal variant="fade" delay={1250}>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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

          {/* Right: smart-home product card */}
          <div className="relative">
            <Reveal variant="fade" delay={600}>
              <SmartHomeCard />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
