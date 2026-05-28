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
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/cn";

interface Service {
  title: string;
  description: string;
  Icon: LucideIcon;
  featured?: boolean;
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
    featured: true,
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
      {/* Soft section atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[1100px] -translate-x-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)",
        }}
      />

      <Container className="relative">
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

        <ul
          className="mt-16 grid grid-cols-1 gap-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Service categories"
        >
          {services.map((service, index) => (
            <Reveal
              key={service.title}
              variant="rise"
              delay={index * 60}
              className={cn("h-full", service.featured && "sm:col-span-2")}
            >
              {service.featured ? (
                <FeaturedServiceCard service={service} />
              ) : (
                <ServiceCard service={service} />
              )}
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Standard card — light surface, dimensional capsule, cursor spotlight        */
/* -------------------------------------------------------------------------- */

function ServiceCard({ service }: { service: Service }) {
  const { Icon, title, description } = service;
  return (
    <SpotlightCard
      as="li"
      dotted
      className="h-full rounded-[1.75rem] border border-border-soft bg-surface p-7 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
    >
      <IconCapsule Icon={Icon} />
      <h3 className="mt-9 font-display text-[1.7rem] leading-[1.08] tracking-tight text-text-hi">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-text-mid">{description}</p>
    </SpotlightCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Featured card — dark ink surface, spans two columns, stronger glow          */
/* -------------------------------------------------------------------------- */

function FeaturedServiceCard({ service }: { service: Service }) {
  const { Icon, title, description } = service;
  return (
    <SpotlightCard
      as="li"
      dotted
      glow="color-mix(in srgb, var(--accent-bright) 30%, transparent)"
      className="h-full rounded-[1.75rem] border border-ink-1 bg-ink-0 p-8 shadow-[var(--shadow-2)]"
    >
      {/* Ambient corner gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%)",
        }}
      />

      <div className="flex h-full flex-col sm:flex-row sm:items-center sm:gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <IconCapsule Icon={Icon} dark />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-soft">
              <Sparkles size={12} strokeWidth={2} aria-hidden />
              Signature capability
            </span>
          </div>
          <h3 className="mt-7 max-w-md font-display text-[2.1rem] leading-[1.05] tracking-tight text-text-on-ink">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-on-ink-mid">
            {description} Routines are commissioned with a real walkthrough, then
            tuned against how the space is actually lived in.
          </p>
        </div>

        {/* Mini automation preview */}
        <div className="mt-7 w-full shrink-0 sm:mt-0 sm:w-56">
          <AutomationPreview />
        </div>
      </div>
    </SpotlightCard>
  );
}

function AutomationPreview() {
  const steps = [
    ["6:30 PM", "Evening lighting scene"],
    ["10:00 PM", "Arm perimeter"],
    ["10:15 PM", "Climate to 68°"],
  ] as const;
  return (
    <div className="rounded-2xl border border-ink-1 bg-[color-mix(in_srgb,var(--ink-1)_70%,black)] p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-on-ink-mid">
        Evening routine
      </p>
      <ol className="mt-3 space-y-3">
        {steps.map(([time, action], i) => (
          <li key={time} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span className="grid size-5 place-items-center rounded-full bg-accent text-[9px] font-semibold text-ink-0">
                {i + 1}
              </span>
              {i < steps.length - 1 && <span className="mt-1 h-3 w-px bg-ink-1" />}
            </div>
            <div className="-mt-0.5">
              <p className="text-[10px] font-medium text-text-on-ink-mid">{time}</p>
              <p className="text-xs font-medium text-text-on-ink">{action}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dimensional icon capsule                                                    */
/* -------------------------------------------------------------------------- */

function IconCapsule({ Icon, dark = false }: { Icon: LucideIcon; dark?: boolean }) {
  if (dark) {
    return (
      <div className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-b from-accent-bright to-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_color-mix(in_srgb,var(--accent)_45%,transparent)]">
        <Icon size={26} strokeWidth={1.6} className="text-white" aria-hidden />
      </div>
    );
  }
  return (
    <div className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-b from-white to-accent-tint shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_22px_color-mix(in_srgb,var(--accent)_14%,transparent)] ring-1 ring-accent/10">
      {/* top sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-1 h-4 rounded-full bg-white/70 blur-[6px]"
      />
      <Icon size={28} strokeWidth={1.5} className="relative text-accent" aria-hidden />
    </div>
  );
}
