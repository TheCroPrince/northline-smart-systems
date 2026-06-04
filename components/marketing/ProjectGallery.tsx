import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Project {
  image: string;
  alt: string;
  title: string;
  blurb: string;
  /** Property/context label, ties to the portal's two properties where it fits. */
  location: string;
  /** Two or three short system tags. */
  tags: readonly string[];
}

/**
 * Visual proof of Northline-style work. Each card is a real install/operations
 * photo with a grounded, practical caption — access control, surveillance,
 * networking, automation, EV, monitoring. Copy stays in the operational
 * register (installed, commissioned, monitored), no hype, no "AI".
 *
 * Locations reuse the fictional portal properties (Birch House / Linden
 * Commercial) so the gallery reads as one continuous world.
 */
const projects: readonly Project[] = [
  {
    image: "/images/projects/access-reader.jpg",
    alt: "A hand presenting an access card to a wall-mounted reader with keypad and fingerprint sensor",
    title: "Garage access modernization",
    blurb:
      "Reader, controller, and door hardware brought into one managed entry workflow, with every access event written to the log.",
    location: "Linden Commercial · Vancouver",
    tags: ["Access", "Controller", "Audit log"],
  },
  {
    image: "/images/services/surveillance-security.jpg",
    alt: "A technician mounting an exterior surveillance camera to a building wall",
    title: "Surveillance coverage upgrade",
    blurb:
      "Exterior cameras repositioned and added for full perimeter coverage, then commissioned and checked against blind spots.",
    location: "Birch House · Toronto",
    tags: ["Cameras", "Coverage", "Monitored"],
  },
  {
    image: "/images/projects/Wiring-rack.jpg",
    alt: "A network cabinet with a managed switch and patch panel, copper and fiber neatly dressed",
    title: "Network cabinet cleanup",
    blurb:
      "Switch and patch panel re-terminated and labeled, copper and fiber dressed so the next service call starts from a clean rack.",
    location: "Linden Commercial · Vancouver",
    tags: ["Switching", "Structured cabling", "Fiber"],
  },
  {
    image: "/images/projects/home-panel-technician.jpg",
    alt: "A gloved technician configuring a wall-mounted smart control and climate panel",
    title: "Smart home integration",
    blurb:
      "Lighting, climate, and control hardware wired into a single panel, then commissioned and signed off before handoff.",
    location: "Birch House · Toronto",
    tags: ["Automation", "Control panel", "Commissioned"],
  },
  {
    image: "/images/projects/ev-technician.jpg",
    alt: "A technician installing a wall-mounted EV charger beside an open electrical sub-panel",
    title: "EV charger readiness",
    blurb:
      "Level 2 charger installed on a dedicated circuit with load-aware setup, sized so the panel keeps headroom for the home.",
    location: "Birch House · Toronto",
    tags: ["EV", "Level 2", "Load-aware"],
  },
  {
    image: "/images/projects/security-team.jpg",
    alt: "An operations team reviewing system-health dashboards across multiple monitors",
    title: "Remote monitoring setup",
    blurb:
      "Site health, cameras, and access events routed to the operations desk, so faults are caught and dispatched before the owner calls.",
    location: "Operations center",
    tags: ["Monitoring", "Dispatch", "24/7"],
  },
] as const;

/**
 * Project Gallery — smart-property systems proof. Sits between Process (the
 * method) and the Portal preview (ongoing visibility): how a project runs →
 * what gets delivered → how you keep an eye on it. Dark `ink-0` stage so the
 * install photography reads premium.
 */
export function ProjectGallery() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative overflow-hidden bg-ink-0 py-24 sm:py-28 lg:py-32"
    >
      {/* Ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-8%] top-[12%] h-[420px] w-[420px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 18%, transparent), transparent 65%)",
        }}
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <span id="work-heading">
              Real systems,
              <span className="italic text-accent-bright"> on real properties.</span>
            </span>
          }
          subhead="A sample of the access control, surveillance, networking, and automation work Northline designs, installs, and keeps under service across homes and commercial sites."
          className="max-w-2xl"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {projects.map((project, i) => (
            <li key={project.title} className="h-full">
              <Reveal variant="rise" delay={(i % 3) * 90} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-[var(--shadow-card)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-card-hover)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-ink-0/55 via-transparent to-transparent"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border-soft bg-bg-1/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-text-low"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="mt-3.5 font-display text-xl text-text-hi sm:text-2xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-mid">
                      {project.blurb}
                    </p>

                    <p className="mt-4 flex items-center gap-2 pt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text-low">
                      <span className="size-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden />
                      {project.location}
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
