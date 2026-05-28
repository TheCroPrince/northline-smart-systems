import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Trust strip. Source: PRD §"Trust strip", COPY_VOICE §"Trust strip".
 *
 * A quiet band that sits immediately after the Hero. Communicates coverage
 * and a small set of credibility markers without "trusted by" logo soup or
 * a carousel. Partner labels render as monochrome wordmarks, not logos.
 *
 * The Trust strip is not a numbered section, so it carries no Eyebrow.
 */

const partners = [
  "Crestron Authorized",
  "Lutron Certified",
  "Ubiquiti Enterprise Partner",
  "Licensed low-voltage teams",
] as const;

export function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-strip-statement"
      className="py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal variant="fade">
            <p
              id="trust-strip-statement"
              className="text-base leading-relaxed text-text-mid sm:text-lg"
            >
              Serving residential and commercial properties across Canada and
              the United States.
            </p>
          </Reveal>
        </div>

        <Reveal variant="fade" delay={160} className="mt-12 sm:mt-14">
          <ul
            aria-label="Certifications and partner programs"
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
          >
            {partners.map((label) => (
              <li
                key={label}
                className="font-mono text-xs uppercase tracking-[0.18em] text-text-low"
              >
                {label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
