import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortalShowcase } from "./portal-preview/PortalShowcase";

/**
 * Portal preview — connects the public site to the real client portal. A tabbed
 * showcase swaps between actual captures of the four portal areas (Overview,
 * Projects, Devices, Support), framed as an app window, so the section conveys
 * the portal's full breadth. Day-two ownership beat between Capabilities and
 * Testimonials.
 */
export function PortalPreview() {
  return (
    <section
      id="portal-preview"
      aria-labelledby="portal-preview-heading"
      className="relative overflow-hidden bg-bg-1 py-24 sm:py-28 lg:py-32"
    >
      {/* Ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/3 h-[460px] w-[460px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 65%)",
        }}
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Client portal"
          title={
            <span id="portal-preview-heading">
              Your property,
              <span className="italic text-accent-bright"> on the record.</span>
            </span>
          }
          subhead="One place to see your systems, service history, support requests, and active projects. Every Northline install includes it, for owners, family, and property managers alike."
          className="max-w-2xl"
        />

        <Reveal variant="settle" delay={120} className="mt-12 lg:mt-14">
          <PortalShowcase />
        </Reveal>
      </Container>
    </section>
  );
}
