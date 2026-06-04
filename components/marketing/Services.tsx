import {
  Cable,
  Home,
  Network,
  Plug,
  Radar,
  Server,
  Shield,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

type Category = "Living" | "Security" | "Infrastructure" | "Care";

interface Capability {
  title: string;
  description: string;
  category: Category;
  Icon: LucideIcon;
  featured?: boolean;
}

/**
 * Capabilities — a compact, scannable supporting section that sits below the
 * flagship carousel. Each item is a single low-profile row (icon + title + one
 * short line + category), not a full-height card. The dotted texture appears on
 * exactly one card (Intelligent Automation), never across the whole grid.
 */
const capabilities: Capability[] = [
  {
    title: "Smart Home Integration",
    description: "Lighting, climate, audio, shades.",
    category: "Living",
    Icon: Home,
  },
  {
    title: "Surveillance & Security",
    description: "Cameras, intrusion, and access.",
    category: "Security",
    Icon: Shield,
  },
  {
    title: "EV Charging",
    description: "Level 2 and 3 with load balancing.",
    category: "Infrastructure",
    Icon: Plug,
  },
  {
    title: "Intelligent Automation",
    description: "Event and occupancy-aware routines.",
    category: "Living",
    Icon: Workflow,
    featured: true,
  },
  {
    title: "Commercial Networking",
    description: "Enterprise Wi-Fi and switching.",
    category: "Infrastructure",
    Icon: Network,
  },
  {
    title: "Remote Monitoring",
    description: "24/7 monitoring and dispatch.",
    category: "Care",
    Icon: Radar,
  },
  {
    title: "Structured Cabling",
    description: "Planned, labeled, warrantied.",
    category: "Infrastructure",
    Icon: Cable,
  },
  {
    title: "Managed Systems",
    description: "Firmware and support after install.",
    category: "Care",
    Icon: Server,
  },
];

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative bg-bg-0 py-20 sm:py-24 lg:py-28"
    >
      <Container className="relative">
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <span id="services-heading">
              Capabilities,
              <span className="italic text-accent-bright"> without handoffs.</span>
            </span>
          }
          subhead="Northline designs, installs, commissions, and monitors the full system. One company across every trade, accountable from day one to year ten."
          className="max-w-2xl"
        />

        <ul
          className="mt-12 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
          aria-label="Service categories"
        >
          {capabilities.map((cap, index) => (
            <li key={cap.title} className="h-full">
              <Reveal variant="rise" delay={index * 45} className="h-full">
                <CapabilityRow cap={cap} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function CapabilityRow({ cap }: { cap: Capability }) {
  const { Icon, title, description, category, featured } = cap;
  return (
    <article
      className={cn(
        "group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl border p-4 transition-colors duration-300 sm:p-5",
        featured
          ? "border-accent/30 bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] to-surface"
          : "border-border-soft bg-surface/50 hover:border-accent/30 hover:bg-surface",
      )}
    >
      {/* Dotted accent — featured card only */}
      {featured ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--accent) 32%, transparent) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            maskImage:
              "radial-gradient(70% 90% at 85% 15%, black, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(70% 90% at 85% 15%, black, transparent 70%)",
          }}
        />
      ) : null}

      <Capsule Icon={Icon} featured={featured} />

      <div className="relative min-w-0 flex-1">
        <p
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.12em]",
            featured ? "text-accent-bright" : "text-text-low",
          )}
        >
          {featured ? "Signature" : category}
        </p>
        <h3 className="mt-1 text-[0.95rem] font-medium tracking-tight text-text-hi">
          {title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-text-mid">{description}</p>
      </div>
    </article>
  );
}

function Capsule({ Icon, featured = false }: { Icon: LucideIcon; featured?: boolean }) {
  return (
    <div
      className={cn(
        "relative grid size-11 shrink-0 place-items-center rounded-xl border",
        featured
          ? "border-accent/40 bg-gradient-to-b from-accent to-[color-mix(in_srgb,var(--accent)_55%,black)]"
          : "border-border bg-gradient-to-b from-surface-2 to-ink-1",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-1.5 top-0.5 h-2.5 rounded-full bg-white/10 blur-[5px]"
      />
      <Icon
        size={20}
        strokeWidth={1.6}
        className={cn("relative", featured ? "text-ink-0" : "text-accent-bright")}
        aria-hidden
      />
    </div>
  );
}
