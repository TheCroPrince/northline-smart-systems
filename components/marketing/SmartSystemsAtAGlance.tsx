import { AppleCardsCarousel } from "@/components/marketing/smart-systems/AppleCardsCarousel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Flagship "at a glance" section. A dark contrast moment in an otherwise light
 * page — large full-bleed image cards (Apple Cards Carousel) that expand into
 * detail. The carousel manages its own horizontal padding so cards run
 * edge-to-edge.
 */
export function SmartSystemsAtAGlance() {
  return (
    <section
      id="systems"
      aria-labelledby="systems-heading"
      className="relative overflow-hidden bg-ink-0 py-24 text-text-on-ink sm:py-32 lg:py-40"
    >
      {/* Ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-15%] top-[-10%] h-[640px] w-[640px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 26%, transparent), transparent 65%)",
        }}
      />

      <Container className="relative">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <SectionHeading
            tone="ink"
            eyebrow="At a glance"
            title={
              <span id="systems-heading">
                Six disciplines,
                <span className="italic text-accent-soft"> one system.</span>
              </span>
            }
            subhead="When the network, the security, the automation, and the climate layer are designed by the same team, they behave like one product. The camera knows what the calendar knows. The thermostat knows when the alarm armed."
            className="max-w-2xl"
          />

          <Reveal variant="fade" delay={320} className="lg:pb-2">
            <p className="max-w-md text-base leading-relaxed text-text-on-ink-mid lg:text-right">
              Each layer is engineered separately and commissioned as one. Open a
              card to look inside — drag, or use the arrows.
            </p>
          </Reveal>
        </div>
      </Container>

      {/* Full-bleed carousel */}
      <Reveal variant="fade" delay={120} className="mt-14 sm:mt-18 lg:mt-24">
        <AppleCardsCarousel />
      </Reveal>
    </section>
  );
}
