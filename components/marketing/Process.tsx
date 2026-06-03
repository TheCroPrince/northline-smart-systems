import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

interface Step {
  n: string;
  title: string;
  /** The clean handoff to the next stage (PRD §6: each step ends with one). */
  handoff: string;
  description: string;
}

// Canonical step copy is locked in COPY_VOICE §7 — do not paraphrase the
// descriptions. The `handoff` line is the stage's outcome that carries into the
// next step (the "operations document" texture, factual, no adjectives).
const steps: readonly Step[] = [
  {
    n: "01",
    title: "Consult",
    handoff: "Scope agreed",
    description:
      "A site visit and a conversation about how you actually use your space. We listen first; we don't pitch.",
  },
  {
    n: "02",
    title: "Design",
    handoff: "Plan approved",
    description:
      "Drawings, device list, network plan. Reviewed with you before anything is ordered.",
  },
  {
    n: "03",
    title: "Install",
    handoff: "Systems in place",
    description:
      "One project lead. Trades coordinated under one schedule. Daily updates while we're on site.",
  },
  {
    n: "04",
    title: "Commission",
    handoff: "Signed off",
    description:
      "Configuration, testing, walkthrough. Nothing handed off until it works as specified.",
  },
  {
    n: "05",
    title: "Monitor",
    handoff: "On the record",
    description:
      "Ongoing health checks, firmware management, on-call response. Your system on the record.",
  },
] as const;

/**
 * Process — how a project runs, written like an operations document. Five
 * numbered stages on a connected spine, each ending in a clean handoff to the
 * next (PRD §6 / COPY_VOICE §7). Restrained by design: typography and numerals
 * do the work, no decorative icons. Sits between Operational Intelligence and
 * the Portal preview — the final stage ("On the record") leads into it.
 */
export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-bg-0 py-24 sm:py-28 lg:py-32"
    >
      <Container className="relative">
        <SectionHeading
          eyebrow="Process"
          title={
            <span id="process-heading">
              From consultation to
              <span className="italic text-accent-bright"> year ten.</span>
            </span>
          }
          subhead="One project lead, from the first walkthrough to ongoing care. Each stage has a deliverable you review, and a clean handoff to the next."
          className="max-w-2xl"
        />

        <ol className="relative mt-14 max-w-3xl lg:mt-16">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <li key={step.n}>
                <Reveal variant="rise" delay={i * 80}>
                  <div className="grid grid-cols-[3rem_1fr] gap-x-5 sm:grid-cols-[3.5rem_1fr] sm:gap-x-7">
                    {/* Number node + connecting spine */}
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-surface sm:size-14",
                          "font-mono text-base text-accent-bright sm:text-lg",
                        )}
                      >
                        {step.n}
                      </span>
                      {!isLast && (
                        <span
                          aria-hidden
                          className="my-2 w-px flex-1 bg-gradient-to-b from-border-strong to-border-soft/20"
                        />
                      )}
                    </div>

                    {/* Stage content */}
                    <div className={cn(!isLast && "pb-10 sm:pb-12")}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-2xl text-text-hi sm:text-[1.75rem]">
                          {step.title}
                        </h3>
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-low">
                          → {step.handoff}
                        </span>
                      </div>
                      <p className="mt-2 max-w-xl text-base leading-relaxed text-text-mid">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
