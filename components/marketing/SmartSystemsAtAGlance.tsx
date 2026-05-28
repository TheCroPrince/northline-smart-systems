import { CapabilityCarousel } from "@/components/marketing/smart-systems/CapabilityCarousel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SmartSystemsAtAGlance() {
  return (
    <section
      id="systems"
      aria-labelledby="systems-heading"
      className="relative overflow-hidden bg-bg-1 py-24 sm:py-32 lg:py-40"
    >
      {/* Subtle radial accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-20%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_60%)]"
      />

      <Container className="relative">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <SectionHeading
            eyebrow="At a glance"
            title={
              <span id="systems-heading">
                Six disciplines,
                <span className="italic text-accent"> one system.</span>
              </span>
            }
            subhead="When the network, the security, the automation, and the climate layer are designed by the same team, they behave like one product. The camera knows what the calendar knows. The thermostat knows when the alarm armed."
            className="max-w-2xl"
          />

          <Reveal variant="fade" delay={320} className="lg:pb-2">
            <p className="max-w-md text-base leading-relaxed text-text-mid lg:text-right">
              Browse the layers. Each is engineered separately and commissioned
              as one. Drag or use the arrows.
            </p>
          </Reveal>
        </div>
      </Container>

      <div className="mt-16 sm:mt-20 lg:mt-24">
        <Container className="relative">
          <CapabilityCarousel />
        </Container>
      </div>
    </section>
  );
}
