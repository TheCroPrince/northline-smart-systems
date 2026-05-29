"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Lock,
  Plus,
  Radar,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

interface Capability {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Public path (capital "Images" for deploy case-safety). null → gradient. */
  image: string | null;
  points: string[];
  Visual: () => ReactNode;
}

const capabilities: Capability[] = [
  {
    id: "monitoring",
    eyebrow: "Monitoring",
    title: "Eyes on every system.",
    description:
      "Around-the-clock health monitoring with classification, alerts, and dispatch handled by the team that installed it. Every device reports in, and anything out of range resolves to a clear next action.",
    image: "/Images/carousel/monitor-carousel.jpg",
    points: [
      "Live health across every connected device",
      "Events classified before they reach you",
      "On-call response with a defined window",
    ],
    Visual: MonitoringVisual,
  },
  {
    id: "network",
    eyebrow: "Network",
    title: "The backbone, sized right.",
    description:
      "Enterprise-grade Wi-Fi, switching, and segmentation tuned to the property and the systems running on it. The network is designed first, because everything else depends on it.",
    image: "/Images/carousel/network-carousel.jpg",
    points: [
      "Coverage mapped to the building, not guessed",
      "Isolated segments for cameras, control, and guests",
      "Redundant uplinks with automatic failover",
    ],
    Visual: NetworkVisual,
  },
  {
    id: "access",
    eyebrow: "Access",
    title: "Quiet, accountable entry.",
    description:
      "Cameras, intrusion, and reader systems designed around how the property is actually used. Entry is logged, attributed, and reviewable, without turning the place into a checkpoint.",
    image: "/Images/carousel/access-carousel.jpg",
    points: [
      "Readers and cameras placed around real routines",
      "Every entry attributed and time-stamped",
      "Arming that follows the household schedule",
    ],
    Visual: AccessVisual,
  },
  {
    id: "ev",
    eyebrow: "EV",
    title: "Charging, load-aware.",
    description:
      "Level 2 and Level 3 chargers installed alongside panel coordination, so the rest of the property keeps its capacity while a vehicle charges. Sized once, correctly.",
    image: "/Images/carousel/EV-Component.png",
    points: [
      "Panel and service load assessed before install",
      "Charging that yields to household demand",
      "Ready for a second charger when you are",
    ],
    Visual: EvVisual,
  },
  {
    id: "lighting",
    eyebrow: "Lighting",
    title: "Scenes for the way you live.",
    description:
      "Lighting and shade control commissioned with a real walkthrough, not a smartphone preset. Scenes are tuned room by room until the space feels right at every hour.",
    image: "/Images/smart-home-integration.jpg",
    points: [
      "Fixtures and keypads planned with the architecture",
      "Scenes tuned on site, not from a catalog",
      "Daylight-aware shades that track the sun",
    ],
    Visual: LightingVisual,
  },
  {
    id: "automation",
    eyebrow: "Automation",
    title: "Routines worth keeping.",
    description:
      "Scheduled, event-driven, and occupancy-aware routines configured around the household or operation. The system does the noticing, so the day takes fewer decisions.",
    image: "/Images/tablet-tech-image.jpg",
    points: [
      "Triggers from time, occupancy, and events",
      "Routines you can read and adjust",
      "Tuned against how the space is actually used",
    ],
    Visual: AutomationVisual,
  },
];

export function AppleCardsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
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

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop nav */}
      <div className="mb-6 hidden items-center justify-end gap-3 px-6 sm:px-8 lg:flex lg:px-12">
        <NavButton dir="left" onClick={() => scrollByCard(-1)} disabled={atStart} />
        <NavButton dir="right" onClick={() => scrollByCard(1)} disabled={atEnd} />
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 sm:px-8 lg:px-12"
      >
        {capabilities.map((cap, i) => (
          <Card key={cap.id} cap={cap} onOpen={() => setActive(i)} />
        ))}
        <div aria-hidden className="shrink-0 lg:w-6" />
      </div>

      <Modal
        cap={active !== null ? capabilities[active] : null}
        onClose={() => setActive(null)}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Collapsed card                                                              */
/* -------------------------------------------------------------------------- */

function Card({ cap, onOpen }: { cap: Capability; onOpen: () => void }) {
  return (
    <motion.button
      data-card
      layoutId={`card-${cap.id}`}
      onClick={onOpen}
      aria-label={`${cap.eyebrow}: ${cap.title} — open details`}
      className="group relative h-[26rem] w-[80vw] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-ink-1 bg-ink-1 text-left sm:h-[32rem] sm:w-[21rem] lg:h-[34rem] lg:w-[23rem]"
    >
      <CardBackground image={cap.image} />

      {/* legibility gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/40"
      />

      <div className="relative z-10 flex h-full flex-col p-7">
        <div className="flex items-center gap-2.5">
          <span className="h-px w-6 bg-white/70" />
          <span className="text-sm font-medium text-white/85">{cap.eyebrow}</span>
        </div>
        <h3 className="mt-auto max-w-[16ch] font-display text-[2rem] leading-[1.05] tracking-tight text-white">
          {cap.title}
        </h3>
        <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors group-hover:bg-white/25">
          <Plus size={13} strokeWidth={2.2} aria-hidden />
          Explore
        </span>
      </div>
    </motion.button>
  );
}

function CardBackground({ image }: { image: string | null }) {
  if (!image) {
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, var(--accent) 0%, var(--ink-0) 70%)",
        }}
      />
    );
  }
  return (
    <Image
      src={image}
      alt=""
      fill
      sizes="(max-width: 640px) 80vw, 23rem"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Expanded modal                                                              */
/* -------------------------------------------------------------------------- */

function Modal({ cap, onClose }: { cap: Capability | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cap) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [cap, onClose]);

  return (
    <AnimatePresence>
      {cap ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-0/70 backdrop-blur-md"
          />

          <div className="relative z-10 flex min-h-full items-start justify-center p-4 sm:p-8">
            <motion.div
              layoutId={`card-${cap.id}`}
              role="dialog"
              aria-modal="true"
              aria-label={cap.title}
              className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border-soft bg-surface shadow-[var(--shadow-2)]"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full bg-ink-0/80 text-white backdrop-blur-sm transition-colors hover:bg-ink-0"
              >
                <X size={18} strokeWidth={2} aria-hidden />
              </button>

              {/* Image header (image + eyebrow + title repeated from the card) */}
              <div className="relative h-64 w-full overflow-hidden sm:h-72">
                <CardBackground image={cap.image} />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30"
                />
                <div className="absolute bottom-0 left-0 p-7 sm:p-8">
                  <div className="flex items-center gap-2.5">
                    <span className="h-px w-6 bg-white/70" />
                    <span className="text-sm font-medium text-white/85">
                      {cap.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-4xl leading-[1.04] tracking-tight text-white">
                    {cap.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div>
                  <p className="text-base leading-relaxed text-text-mid">
                    {cap.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {cap.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-text-hi">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bespoke product visual */}
                <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-border-soft bg-bg-1">
                  <cap.Visual />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Nav button                                                                  */
/* -------------------------------------------------------------------------- */

function NavButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = dir === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className="grid size-12 place-items-center rounded-full border border-ink-1 bg-ink-1 text-text-on-ink transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/50 hover:text-accent-soft disabled:cursor-not-allowed disabled:opacity-30"
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Bespoke product visuals (rendered inside the expanded modal)                */
/* -------------------------------------------------------------------------- */

function MonitoringVisual() {
  const rows = [
    { label: "Side yard camera", status: "Healthy" },
    { label: "Main switch", status: "Healthy" },
    { label: "Front reader", status: "Updating" },
    { label: "Garage motion", status: "Healthy" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center p-5">
      <div className="w-full max-w-[280px] rounded-2xl border border-border-soft bg-surface p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar size={14} strokeWidth={1.75} className="text-accent" aria-hidden />
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
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <svg viewBox="0 0 320 220" className="size-full max-w-[300px]">
        <defs>
          <radialGradient id="modal-net-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-bright)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent-bright)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="110" r="80" fill="url(#modal-net-glow)" />
        <g stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="1" fill="none">
          <path d="M 50 60 Q 110 80 160 110" />
          <path d="M 270 50 Q 220 80 160 110" />
          <path d="M 40 170 Q 100 140 160 110" />
          <path d="M 280 170 Q 220 140 160 110" />
          <path d="M 160 30 Q 160 70 160 110" />
          <path d="M 160 190 Q 160 150 160 110" />
        </g>
        {[
          [50, 60],
          [270, 50],
          [40, 170],
          [280, 170],
          [160, 30],
          [160, 190],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="7" fill="var(--surface)" stroke="var(--border)" />
            <circle cx={cx} cy={cy} r="3" fill="var(--accent)" />
          </g>
        ))}
        <circle cx="160" cy="110" r="16" fill="var(--accent)" />
      </svg>
    </div>
  );
}

function AccessVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-5">
      <div className="w-full max-w-[240px] rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-low">Front entrance</span>
          <Lock size={14} strokeWidth={1.75} className="text-accent" aria-hidden />
        </div>
        <div className="mt-5 flex justify-center">
          <div className="grid size-20 place-items-center rounded-full border-2 border-accent/40 bg-accent-tint">
            <div className="grid size-12 place-items-center rounded-full bg-accent text-white">
              <Lock size={22} strokeWidth={1.5} aria-hidden />
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-mid">Last entry</span>
            <span className="font-medium text-text-hi">M. Roth · 7:42 AM</span>
          </div>
          <div className="flex items-center justify-between">
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
    <div className="absolute inset-0">
      <Image
        src="/Images/carousel/EV-inside-component.png"
        alt="EV charging detail"
        fill
        sizes="(max-width: 1024px) 90vw, 30rem"
        className="object-cover"
      />
    </div>
  );
}

function LightingVisual() {
  const scenes = ["Morning", "Day", "Evening", "Night"];
  return (
    <div className="absolute inset-0 flex items-center justify-center p-5">
      <div className="w-full max-w-[280px] rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb size={14} strokeWidth={1.75} className="text-accent" aria-hidden />
            <span className="text-xs font-medium text-text-hi">Living room</span>
          </div>
          <span className="text-xs text-text-mid">62%</span>
        </div>
        <div className="relative mt-5 h-16 overflow-hidden rounded-xl bg-gradient-to-r from-[#f5ecdb] via-[#f0c98a] to-[#d9941d]">
          <div className="absolute inset-y-0 left-[62%] w-px bg-text-hi/40">
            <div className="absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-text-hi/50 bg-surface" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {scenes.map((scene, i) => (
            <span
              key={scene}
              className={
                i === 2
                  ? "rounded-lg bg-ink-0 px-2 py-1.5 text-center text-[10px] font-medium text-white"
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
  const steps = [
    { time: "6:30 PM", action: "Lighting · Evening scene" },
    { time: "7:00 PM", action: "Shades · Lower main floor" },
    { time: "10:00 PM", action: "Access · Arm perimeter" },
    { time: "10:15 PM", action: "Climate · Drop to 68°" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center p-5">
      <div className="w-full max-w-[280px] rounded-2xl border border-border-soft bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <Sparkles size={14} strokeWidth={1.75} className="text-accent" aria-hidden />
          <span className="text-xs font-medium text-text-hi">Evening routine</span>
        </div>
        <ol className="mt-4 space-y-3">
          {steps.map((step, i) => (
            <li key={step.time} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span className="grid size-5 place-items-center rounded-full bg-accent text-[9px] font-semibold text-white">
                  {i + 1}
                </span>
                {i < steps.length - 1 && <span className="mt-1 h-3 w-px bg-border" />}
              </div>
              <div className="-mt-0.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-text-low">
                  {step.time}
                </p>
                <p className="text-xs font-medium text-text-hi">{step.action}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
