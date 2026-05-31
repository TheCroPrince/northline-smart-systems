import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const partners = [
  "Crestron Authorized",
  "Lutron Certified",
  "Ubiquiti Enterprise",
  "Licensed low-voltage",
] as const;

export function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-strip-statement"
      className="relative bg-transparent pb-24 pt-16 sm:pt-20"
    >
      <Container>
        <Reveal variant="fade">
          <p
            id="trust-strip-statement"
            className="mx-auto max-w-3xl text-center font-display text-2xl leading-snug text-text-hi sm:text-3xl"
          >
            Designing and installing across
            <span className="italic text-accent"> Canada</span> and the
            <span className="italic text-accent"> United States</span>.
          </p>
        </Reveal>

        <Reveal variant="fade" delay={160} className="mt-10">
          <ul
            aria-label="Certifications and partner programs"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-2"
          >
            {partners.map((label, i) => (
              <li
                key={label}
                className="flex items-center text-sm font-medium text-text-mid"
              >
                {i > 0 && (
                  <span
                    aria-hidden
                    className="mr-3 size-1 rounded-full bg-border-strong sm:mr-2"
                  />
                )}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
