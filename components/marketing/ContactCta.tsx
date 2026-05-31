import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TrustStrip } from "@/components/marketing/TrustStrip";

const stats = [
  { value: "24/7", label: "Monitored from our operations center" },
  { value: "90s", label: "Typical on-call response window" },
  { value: "2 yr", label: "Workmanship warranty on every install" },
] as const;

/**
 * Closing section — a premium consultation CTA that gives the page a real
 * landing-page ending, with the TrustStrip folded in beneath it as a quiet
 * credibility close. A soft teal glow echoes the hero lamp so the page reads as
 * one piece (bookends), not a stack of blocks.
 *
 * `id="contact"` wires the existing "Book a consultation" nav link.
 */
export function ContactCta() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-bg-0 pt-24 sm:pt-32"
    >
      {/* Soft teal glow — an echo of the hero lamp, tying the ends together */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[840px] max-w-[130vw] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at center top, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)",
        }}
      />

      <Container className="relative">
        <Reveal variant="settle">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.25rem] border border-border-soft bg-gradient-to-b from-surface to-bg-1 px-6 py-12 text-center shadow-[var(--shadow-2)] sm:px-14 sm:py-16">
            {/* Filament echo */}
            <div
              aria-hidden
              className="mx-auto mb-8 h-px w-32 bg-gradient-to-r from-transparent via-accent-bright/70 to-transparent"
            />

            <p className="text-sm font-medium tracking-tight text-accent-bright">
              Start a project
            </p>

            <h2
              id="contact-heading"
              className="mx-auto mt-4 max-w-2xl font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] tracking-tight text-text-hi"
            >
              Start with a
              <span className="italic text-accent-bright"> walkthrough.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-mid sm:text-lg">
              Book a consultation. We map the property, scope the system, and
              send a written proposal, usually within a week. One project lead,
              start to finish.
            </p>

            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button variant="primary">
                Book a consultation
                <ArrowRight size={16} strokeWidth={2} aria-hidden />
              </Button>
              <Button variant="secondary" href="/portal">
                Open the portal
              </Button>
            </div>

            {/* Status / proof strip */}
            <dl className="mt-12 grid grid-cols-1 gap-6 border-t border-border-soft pt-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.value} className="text-center">
                  <dt className="font-display text-3xl tracking-tight text-text-hi">
                    {stat.value}
                  </dt>
                  <dd className="mx-auto mt-1.5 max-w-[22ch] text-xs leading-relaxed text-text-mid">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>

      {/* Quiet credibility close, folded into the same section */}
      <TrustStrip />
    </section>
  );
}
