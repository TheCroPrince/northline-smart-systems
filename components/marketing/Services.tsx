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
import { GlowingStarsCard } from "@/components/ui/glowing-stars";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
      <Container className="relative">
        <SectionHeading
          eyebrow="Services"
          title={
            <span id="services-heading">
              What we build,
              <span className="italic text-accent-bright"> end to end.</span>
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
                <FeaturedCard service={service} />
              ) : (
                <StandardCard service={service} />
              )}
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function StandardCard({ service }: { service: Service }) {
  const { Icon, title, description } = service;
  return (
    <GlowingStarsCard as="li" className="min-h-[19rem]">
      <IconModule Icon={Icon} />
      <h3 className="mt-9 font-display text-[1.7rem] leading-[1.08] tracking-tight text-text-hi">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-text-mid">{description}</p>
    </GlowingStarsCard>
  );
}

function FeaturedCard({ service }: { service: Service }) {
  const { Icon, title, description } = service;
  return (
    <GlowingStarsCard
      as="li"
      className="min-h-[19rem] border-accent/25 bg-gradient-to-br from-surface to-ink-1"
    >
      <div className="flex h-full flex-col sm:flex-row sm:items-center sm:gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <IconModule Icon={Icon} featured />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-tint px-3 py-1 text-xs font-medium text-accent-bright">
              <Sparkles size={12} strokeWidth={2} aria-hidden />
              Signature capability
            </span>
          </div>
          <h3 className="mt-7 max-w-md font-display text-[2.1rem] leading-[1.05] tracking-tight text-text-hi">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-mid">
            {description} Routines are commissioned with a real walkthrough, then
            tuned against how the space is actually lived in.
          </p>
        </div>
        <div className="mt-7 w-full shrink-0 sm:mt-0 sm:w-56">
          <AutomationPreview />
        </div>
      </div>
    </GlowingStarsCard>
  );
}

function AutomationPreview() {
  const steps = [
    ["6:30 PM", "Evening lighting scene"],
    ["10:00 PM", "Arm perimeter"],
    ["10:15 PM", "Climate to 68°"],
  ] as const;
  return (
    <div className="rounded-2xl border border-border-soft bg-ink-0/60 p-4 backdrop-blur-sm">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-low">
        Evening routine
      </p>
      <ol className="mt-3 space-y-3">
        {steps.map(([time, action], i) => (
          <li key={time} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span className="grid size-5 place-items-center rounded-full bg-accent text-[9px] font-semibold text-ink-0">
                {i + 1}
              </span>
              {i < steps.length - 1 && <span className="mt-1 h-3 w-px bg-border" />}
            </div>
            <div className="-mt-0.5">
              <p className="text-[10px] font-medium text-text-low">{time}</p>
              <p className="text-xs font-medium text-text-hi">{action}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Layered icon module — abstract ring + glow behind a lucide glyph            */
/* -------------------------------------------------------------------------- */

function IconModule({ Icon, featured = false }: { Icon: LucideIcon; featured?: boolean }) {
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-2xl border",
        featured
          ? "size-16 border-accent/40 bg-gradient-to-b from-accent to-[color-mix(in_srgb,var(--accent)_60%,black)]"
          : "size-16 border-border bg-gradient-to-b from-surface-2 to-ink-1",
      )}
    >
      {/* inner top highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-1 h-4 rounded-full bg-white/10 blur-[6px]"
      />
      {/* abstract glow ring, intensifies on card hover */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500",
          featured ? "opacity-90" : "opacity-40 group-hover:opacity-90",
        )}
        style={{
          boxShadow:
            "inset 0 0 18px color-mix(in srgb, var(--accent) 30%, transparent)",
        }}
      />
      <Icon
        size={28}
        strokeWidth={1.5}
        className={cn("relative", featured ? "text-ink-0" : "text-accent-bright")}
        aria-hidden
      />
    </div>
  );
}
