import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroOverlays } from "@/components/marketing/hero/HeroOverlays";

/**
 * Hero. Source: PRD §"Hero spec", DESIGN_MOTION §18, COPY_VOICE §"Hero".
 *
 * Composition:
 *  - Layered background: two soft radial washes (upper-left primary, lower-right
 *    secondary, per DESIGN_MOTION §5) plus a low-opacity grain overlay to
 *    kill banding (DESIGN_MOTION §3).
 *  - Centered text block: locked tagline as H1, two-paragraph subhead, two CTAs.
 *  - Animated overlays positioned around the text (see HeroOverlays).
 *
 * Choreography note: the text content renders statically. The entrance motion
 * is carried by HeroOverlays, which assembles the surrounding motifs over
 * ~1.5s. The text "is there on arrival" — restrained, weighty, composed.
 *
 * CTA wiring (Phase 2.2 placeholders):
 *  - Primary "Book a consultation": no-op button. A consultation modal is
 *    listed as P0 in PRD §7 and will be wired in a later commit.
 *  - Secondary "Explore systems": targets `#services`, which is a future
 *    anchor. Clicking has no effect until the Services section lands.
 */

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Layered background: radial washes (lower z) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 18% 8%, rgba(125, 211, 252, 0.06), transparent 60%),
            radial-gradient(ellipse 70% 50% at 82% 92%, rgba(59, 130, 246, 0.05), transparent 60%),
            var(--bg-0)
          `,
        }}
      />

      {/* Grain overlay (kills gradient banding) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.035]"
        style={{ backgroundImage: GRAIN_BG }}
      />

      {/* Animated overlays */}
      <HeroOverlays />

      {/* Foreground content */}
      <Container className="relative z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1
            id="hero-headline"
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.03em] text-text-hi"
          >
            Smart systems.
            <span className="block">Designed to disappear.</span>
          </h1>

          <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-text-mid sm:text-lg">
            <p>
              Northline designs, installs, and monitors the technology behind
              modern homes and commercial properties across North America.
            </p>
            <p>
              Security, automation, networking, EV. One company. One project
              lead. One system.
            </p>
          </div>

          <div className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Button variant="primary" aria-label="Book a consultation">
              Book a consultation
            </Button>
            <Button variant="secondary" href="#services">
              Explore systems
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
