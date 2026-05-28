import {
  Cable,
  Home,
  Network,
  Plug,
  Radar,
  Server,
  Shield,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

interface Service {
  title: string;
  description: string;
  Icon: LucideIcon;
  spotlight?: boolean;
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
    spotlight: true,
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
      className="relative bg-bg-0 py-24 sm:py-32 lg:py-40"
    >
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.85fr]">
          <SectionHeading
            eyebrow="Services"
            title={
              <span id="services-heading">
                What we build,
                <span className="italic text-accent"> end to end.</span>
              </span>
            }
            subhead="Each category is staffed by people who do it as their full-time work. We design, install, commission, and monitor — without subcontracting the parts that matter."
            className="max-w-2xl"
          />
        </div>

        <ul
          className="mt-16 grid grid-cols-1 gap-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Service categories"
        >
          {services.map((service, index) => (
            <Reveal
              key={service.title}
              variant="rise"
              delay={index * 70}
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
  const { Icon, title, description, spotlight } = service;

  return (
    <GlassCard
      as="li"
      className={cn(
        "flex h-full flex-col p-7",
        spotlight && "border-accent/30 shadow-[var(--shadow-card-hover)]",
      )}
    >
      {/* Spotlight glow for featured card */}
      {spotlight ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 20% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%)",
          }}
        />
      ) : null}

      {/* Dotted texture under spotlight card */}
      {spotlight ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 24%, transparent) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
      ) : null}

      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl",
            spotlight
              ? "bg-accent text-text-on-ink"
              : "bg-accent-tint text-accent",
          )}
        >
          <Icon size={26} strokeWidth={1.5} aria-hidden />
        </div>
        {spotlight ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-3 py-1 text-xs font-medium text-accent">
            <Sparkles size={12} strokeWidth={2} aria-hidden />
            Signature
          </span>
        ) : null}
      </div>

      <h3 className="mt-10 font-display text-[1.75rem] leading-[1.1] tracking-tight text-text-hi">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-text-mid">{description}</p>
    </GlassCard>
  );
}
