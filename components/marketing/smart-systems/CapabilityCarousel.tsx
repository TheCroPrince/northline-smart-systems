"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Lightbulb,
  Lock,
  Radar,
  Sparkles,
  Wifi,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CapabilityCardData {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  Visual: () => ReactNode;
  surface: "ink" | "paper" | "accent" | "warm";
}

const capabilities: CapabilityCardData[] = [
  {
    id: "monitoring",
    eyebrow: "Monitoring",
    title: "Eyes on every system.",
    description:
      "Around-the-clock health monitoring with classification, alerts, and dispatch handled by the team that installed it.",
    surface: "accent",
    Visual: MonitoringVisual,
  },
  {
    id: "network",
    eyebrow: "Network",
    title: "The backbone, sized right.",
    description:
      "Enterprise-grade Wi-Fi, switching, and segmentation tuned to the property and the systems running on it.",
    surface: "ink",
    Visual: NetworkVisual,
  },
  {
    id: "access",
    eyebrow: "Access",
    title: "Quiet, accountable entry.",
    description:
      "Cameras, intrusion, and reader systems designed around how the property is actually used.",
    surface: "paper",
    Visual: AccessVisual,
  },
  {
    id: "ev",
    eyebrow: "EV",
    title: "Charging, load-aware.",
    description:
      "Level 2 and 3 chargers installed alongside panel coordination so the rest of the house keeps its capacity.",
    surface: "accent",
    Visual: EvVisual,
  },
  {
    id: "lighting",
    eyebrow: "Lighting",
    title: "Scenes for the way you live.",
    description:
      "Lutron-class lighting and shade control commissioned with a real walkthrough, not a smartphone preset.",
    surface: "warm",
    Visual: LightingVisual,
  },
  {
    id: "automation",
    eyebrow: "Automation",
    title: "Routines worth keeping.",
    description:
      "Scheduled, event-driven, and occupancy-aware routines configured around the household or operation.",
    surface: "paper",
    Visual: AutomationVisual,
  },
];

export function CapabilityCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateNav = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateNav();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [updateNav]);

  const scrollBy = (direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLLIElement>("[data-carousel-card]");
    const width = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * width, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Desktop nav */}
      <div className="absolute -top-20 right-0 hidden items-center gap-3 lg:flex">
        <ArrowButton
          direction="left"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
        />
        <ArrowButton
          direction="right"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
        />
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-6 overflow-x-auto px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
      >
        <ul className="flex snap-x snap-mandatory gap-5 pb-4">
          {capabilities.map((cap, index) => (
            <CapabilityCard key={cap.id} data={cap} index={index} />
          ))}
          {/* Right-side padding for nicer scroll-end */}
          <li aria-hidden className="shrink-0 lg:w-12" />
        </ul>
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous capability" : "Next capability"}
      className="grid size-12 place-items-center rounded-full border border-border bg-surface text-text-hi shadow-[var(--shadow-card)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
    </button>
  );
}

function CapabilityCard({
  data,
  index,
}: {
  data: CapabilityCardData;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { eyebrow, title, description, Visual, surface } = data;

  const surfaceStyles = {
    ink: "bg-ink-0 text-text-on-ink border-ink-1",
    paper: "bg-surface text-text-hi border-border-soft",
    accent: "bg-accent-tint text-text-hi border-accent/20",
    warm: "bg-[#f5ecdb] text-text-hi border-[#e7d6b8]",
  }[surface];

  const eyebrowColor = surface === "ink" ? "text-accent-soft" : "text-accent";
  const descriptionColor = surface === "ink" ? "text-text-on-ink-mid" : "text-text-mid";

  return (
    <motion.li
      data-carousel-card
      initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "relative flex w-[80vw] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] border shadow-[var(--shadow-card)] sm:w-[420px] lg:w-[460px]",
        surfaceStyles,
      )}
    >
      {/* Visual area */}
      <div className="relative h-[260px] overflow-hidden border-b border-current/10 sm:h-[300px]">
        <Visual />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center gap-3">
          <span className={cn("h-px w-6", surface === "ink" ? "bg-accent-soft" : "bg-accent")} />
          <span className={cn("text-sm font-medium tracking-tight", eyebrowColor)}>
            {eyebrow}
          </span>
        </div>

        <h3 className="mt-5 font-display text-[1.9rem] leading-[1.1] tracking-tight">
          {title}
        </h3>
        <p className={cn("mt-4 text-sm leading-relaxed", descriptionColor)}>
          {description}
        </p>
      </div>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/* Card visuals                                                                */
/* -------------------------------------------------------------------------- */

function MonitoringVisual() {
  const rows = [
    { label: "Side yard camera", status: "Healthy", ok: true },
    { label: "Main switch", status: "Healthy", ok: true },
    { label: "Front reader", status: "Updating", ok: true },
    { label: "Garage motion", status: "Healthy", ok: true },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_55%)] p-6">
      <div className="w-full max-w-[280px] rounded-2xl border border-border-soft bg-surface p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar size={14} strokeWidth={1.75} className="text-accent" />
            <p className="text-xs font-medium text-text-hi">Health · live</p>
          </div>
          <span className="rounded-full bg-signal-ok/10 px-2 py-0.5 text-[10px] font-medium text-signal-ok">
            All ok
          </span>
        </div>
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between text-xs">
              <span className="text-text-mid">{r.label}</span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-signal-ok" />
                <span className="font-medium text-text-hi">{r.status}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NetworkVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <svg viewBox="0 0 320 220" className="size-full max-w-[300px]">
        <defs>
          <radialGradient id="net-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-bright)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-bright)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="110" r="80" fill="url(#net-glow)" />

        {/* Connection lines */}
        <g stroke="var(--accent-soft)" strokeOpacity="0.5" strokeWidth="1" fill="none">
          <path d="M 50 60 Q 110 80 160 110" />
          <path d="M 270 50 Q 220 80 160 110" />
          <path d="M 40 170 Q 100 140 160 110" />
          <path d="M 280 170 Q 220 140 160 110" />
          <path d="M 160 30 Q 160 70 160 110" />
          <path d="M 160 190 Q 160 150 160 110" />
        </g>

        {/* Node dots */}
        {[
          [50, 60],
          [270, 50],
          [40, 170],
          [280, 170],
          [160, 30],
          [160, 190],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="var(--ink-1)" />
            <circle cx={cx} cy={cy} r="3" fill="var(--accent-bright)" />
          </g>
        ))}

        {/* Center hub */}
        <circle cx="160" cy="110" r="16" fill="var(--accent)" />
        <circle cx="160" cy="110" r="22" fill="none" stroke="var(--accent-bright)" strokeOpacity="0.5" strokeWidth="1" />
        <Wifi x="148" y="98" width="24" height="24" color="white" strokeWidth={2} />
      </svg>
    </div>
  );
}

function AccessVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,color-mix(in_srgb,var(--gold)_18%,transparent),transparent_55%)] p-6">
      <div className="relative w-full max-w-[240px] rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-low">Front entrance</span>
          <Lock size={14} strokeWidth={1.75} className="text-accent" aria-hidden />
        </div>
        <div className="mt-6 flex justify-center">
          <div className="relative grid size-24 place-items-center rounded-full border-2 border-accent/40 bg-accent-tint">
            <div className="grid size-16 place-items-center rounded-full bg-accent text-text-on-ink">
              <Lock size={26} strokeWidth={1.5} aria-hidden />
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-mid">Last entry</span>
            <span className="font-medium text-text-hi">M. Roth · 7:42 AM</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-mid">State</span>
            <span className="flex items-center gap-1.5 font-medium text-signal-ok">
              <span className="size-1.5 rounded-full bg-signal-ok" />
              Armed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_70%_30%,color-mix(in_srgb,var(--accent-bright)_22%,transparent),transparent_55%)] p-6">
      <div className="w-full max-w-[260px] rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryCharging size={14} strokeWidth={1.75} className="text-accent" aria-hidden />
            <span className="text-xs font-medium text-text-hi">EV Charger · L2</span>
          </div>
          <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-medium text-accent">
            Charging
          </span>
        </div>
        <div className="mt-5">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-5xl leading-none tracking-tight text-text-hi">
              82
            </span>
            <span className="text-sm font-medium text-text-mid">%</span>
          </div>
          <p className="mt-1 text-xs text-text-mid">9.6 kW · 38 min to 100%</p>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg-1">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: "82%" }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-text-mid">Panel load</span>
          <span className="font-medium text-text-hi">68 / 200 A</span>
        </div>
      </div>
    </div>
  );
}

function LightingVisual() {
  const scenes = ["Morning", "Day", "Evening", "Night"];
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,color-mix(in_srgb,var(--gold)_28%,transparent),transparent_60%)] p-6">
      <div className="w-full max-w-[280px] rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={14} strokeWidth={1.75} className="text-accent" aria-hidden />
            <span className="text-xs font-medium text-text-hi">Living room</span>
          </div>
          <span className="text-xs text-text-mid">62%</span>
        </div>
        {/* Brightness gradient */}
        <div className="mt-5 h-20 overflow-hidden rounded-xl bg-gradient-to-r from-[#f5ecdb] via-[#f0c98a] to-[#d9941d] relative">
          <div className="absolute inset-y-0 left-0 w-[62%] border-r-2 border-text-hi/40">
            <div className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-text-hi/60 bg-surface" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {scenes.map((scene, i) => (
            <span
              key={scene}
              className={
                i === 2
                  ? "rounded-lg bg-ink-0 px-2 py-1.5 text-center text-[10px] font-medium text-text-on-ink"
                  : "rounded-lg border border-border-soft bg-surface-2 px-2 py-1.5 text-center text-[10px] font-medium text-text-mid"
              }
            >
              {scene}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AutomationVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 26%, transparent) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="relative w-full max-w-[280px] rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <Sparkles size={14} strokeWidth={1.75} className="text-accent" aria-hidden />
          <span className="text-xs font-medium text-text-hi">Evening routine</span>
        </div>
        <ol className="mt-4 space-y-3">
          {[
            { time: "6:30 PM", action: "Lighting · Evening scene" },
            { time: "7:00 PM", action: "Shades · Lower main floor" },
            { time: "10:00 PM", action: "Access · Arm perimeter" },
            { time: "10:15 PM", action: "Climate · Drop to 68°" },
          ].map((step, i) => (
            <li key={step.time} className="flex items-start gap-3">
              <div className="mt-0.5 flex flex-col items-center">
                <span className="grid size-5 place-items-center rounded-full bg-accent text-[9px] font-medium text-text-on-ink">
                  {i + 1}
                </span>
                {i < 3 && <span className="mt-1 h-3 w-px bg-border" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-text-low">
                  {step.time}
                </p>
                <p className="mt-0.5 text-xs font-medium text-text-hi">{step.action}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
