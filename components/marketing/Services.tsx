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
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

/**
 * Services. Source: PRD §"Services", COPY_VOICE §"Services".
 *
 * Eight service domains in a 1 / 2 / 4 responsive grid. Cards are static
 * (no destination yet — deep service routes are P2 per PRD §7) so they
 * use the non-interactive GlassCard variant.
 *
 * Per-card stagger: each card is wrapped in its own Reveal with an
 * 80ms delay step, matching DESIGN_MOTION §10 `stagger.default`.
 *
 * Icon treatment: monochrome `text-text-mid` across the board, with the
 * single exception of Intelligent Automation in `text-accent-soft`. This
 * is the "subtly distinct" differentiation the brief asks for, without
 * loading the rest of the grid with decorative accent.
 */

interface Service {
  title: string;
  description: string;
  Icon: LucideIcon;
  /** True if this card should receive the accent-soft icon tint. */
  highlightIcon?: boolean;
}

const services: Service[] = [
  {
    title: "Smart Home Integration",
    description:
      "Unified control of lighting, climate, audio, shades, and security from a single interface.",
    Icon: Home,
  },
  {
    title: "Surveillance & Security",
    description:
      "Camera, intrusion, and access systems designed around how a property is actually used.",
    Icon: Shield,
  },
  {
    title: "EV Charging",
    description:
      "Level 2 and Level 3 charger installation, load management, and panel coordination.",
    Icon: Plug,
  },
  {
    title: "Intelligent Automation",
    description:
      "Scheduled, event-driven, and occupancy-aware routines configured around the household or operation.",
    Icon: Workflow,
    highlightIcon: true,
  },
  {
    title: "Commercial Networking",
    description:
      "Enterprise-grade Wi-Fi, switching, and segmentation sized for the property and what runs on it.",
    Icon: Network,
  },
  {
    title: "Remote Monitoring",
    description:
      "24/7 health monitoring of every connected system, with classification, alerts, and dispatch.",
    Icon: Radar,
  },
  {
    title: "Structured Cabling",
    description:
      "Low-voltage and data cabling: planned, labeled, documented, and warrantied.",
    Icon: Cable,
  },
  {
    title: "Managed Systems",
    description:
      "Ongoing administration, firmware, configuration, and support after install.",
    Icon: Server,
  },
];

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="py-24 sm:py-32 lg:py-40"
    >
      <Container>
        <SectionHeading
          eyebrow="01 / SERVICES"
          title={<span id="services-heading">What we build.</span>}
          subhead="Each category is staffed by people who do it as their full-time work, not as a side service."
        />

        <ul
          className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6"
          aria-label="Service categories"
        >
          {services.map((service, index) => (
            <Reveal
              key={service.title}
              variant="rise"
              delay={index * 80}
              className="h-full"
            >
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const { Icon, title, description, highlightIcon } = service;
  return (
    <GlassCard
      as="li"
      className="flex h-full flex-col p-6 lg:p-7"
    >
      <Icon
        aria-hidden
        size={28}
        strokeWidth={1.5}
        className={cn(
          highlightIcon ? "text-accent-soft" : "text-text-mid",
        )}
      />
      <h3 className="mt-8 text-lg font-medium tracking-[-0.01em] text-text-hi">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-text-mid">
        {description}
      </p>
    </GlassCard>
  );
}
