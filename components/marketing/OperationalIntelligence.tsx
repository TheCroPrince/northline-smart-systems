import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OpsConsole } from "./operational-intelligence/OpsConsole";

/**
 * Operational Intelligence — the differentiator section. A purpose-built event
 * console shows the monitoring layer classifying a property signal and deciding
 * whether to log or escalate. Sits between Capabilities and the Portal preview:
 * the system decides, then you see it on the record.
 *
 * Copy is a separate domain (COPY_VOICE §9): no "AI"/"machine learning"
 * anywhere; the system speaks in fragments while the prose stays restrained.
 */
export function OperationalIntelligence() {
  return (
    <section
      id="operations"
      aria-labelledby="operations-heading"
      className="relative overflow-hidden bg-ink-0 py-24 sm:py-28 lg:py-32"
    >
      {/* Ambient stage glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)",
        }}
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Operational intelligence"
          title={
            <span id="operations-heading">
              Notice. Classify.
              <span className="italic text-accent-bright"> Decide.</span>
            </span>
          }
          subhead="Every Northline install includes an operations layer that connects cameras, access, schedules, and service context. Routine events stay quiet; exceptions surface with enough detail to act."
          className="max-w-2xl"
        />

        <Reveal variant="settle" delay={120} className="mt-12 lg:mt-14">
          <OpsConsole />
        </Reveal>
      </Container>
    </section>
  );
}
