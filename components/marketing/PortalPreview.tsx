import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const features = [
  "System health and the latest events",
  "Every device, its firmware, and last-seen",
  "A support thread with your lead technician",
  "Active projects and their milestones",
] as const;

/**
 * Portal preview — connects the public site to the real client portal. The
 * image is an actual capture of the Northline portal Overview, framed as an
 * app window. Day-two ownership beat between Capabilities and Testimonials.
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
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Client portal"
              title={
                <span id="portal-preview-heading">
                  Your property,
                  <span className="italic text-accent-bright"> on the record.</span>
                </span>
              }
              subhead="One place to see your systems, service history, support requests, and active projects. Every Northline install includes it, for owners, family, and property managers alike."
              className="max-w-xl"
            />

            <Reveal variant="fade" delay={240}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-text-mid">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-bright">
                      <Check size={12} strokeWidth={2.5} aria-hidden />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="fade" delay={340}>
              <div className="mt-9">
                <Button variant="secondary" href="/portal">
                  Open the portal
                  <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* App-window framed screenshot */}
          <Reveal variant="settle" delay={120}>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 30%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%)",
                }}
              />
              <div className="overflow-hidden rounded-2xl border border-border bg-ink-1 shadow-[var(--shadow-2)]">
                <div className="flex items-center gap-2 border-b border-border-soft bg-ink-0/60 px-4 py-3">
                  <span className="size-2.5 rounded-full bg-border-strong" aria-hidden />
                  <span className="size-2.5 rounded-full bg-border-strong" aria-hidden />
                  <span className="size-2.5 rounded-full bg-border-strong" aria-hidden />
                  <span className="ml-2 font-mono text-[11px] text-text-low">
                    northline.app / portal
                  </span>
                </div>
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/Images/portal/portal-preview.png"
                    alt="The Northline client portal Overview, showing system health, devices, events, and the next scheduled visit"
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
