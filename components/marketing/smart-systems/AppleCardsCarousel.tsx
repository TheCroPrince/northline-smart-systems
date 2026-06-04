"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Capability {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  /** Card scene image (public path, capital "Images" for deploy case-safety). */
  image: string;
  /** Image shown in the expanded modal's detail panel. */
  insideImage: string;
  /** object-position for the card crop (landscape source in a tall card). */
  objectPosition: string;
}

const capabilities: Capability[] = [
  {
    id: "monitoring",
    eyebrow: "Monitoring",
    title: "Eyes on every system.",
    description:
      "Around-the-clock health monitoring with classification, alerts, and dispatch handled by the team that installed it. Every device reports in, and anything out of range resolves to a clear next action.",
    points: [
      "Live health across every connected device",
      "Events classified before they reach you",
      "On-call response with a defined window",
    ],
    image: "/images/carousel/monitoring.jpg",
    insideImage: "/images/carousel/monitoring-inside.jpg",
    objectPosition: "50% 45%",
  },
  {
    id: "network",
    eyebrow: "Network",
    title: "The backbone, sized right.",
    description:
      "Enterprise-grade Wi-Fi, switching, and segmentation tuned to the property and the systems running on it. The network is designed first, because everything else depends on it.",
    points: [
      "Coverage mapped to the building, not guessed",
      "Isolated segments for cameras, control, and guests",
      "Redundant uplinks with automatic failover",
    ],
    image: "/images/carousel/network.jpg",
    insideImage: "/images/carousel/network-inside.jpg",
    objectPosition: "50% 50%",
  },
  {
    id: "access",
    eyebrow: "Access",
    title: "Quiet, accountable entry.",
    description:
      "Cameras, intrusion, and reader systems designed around how the property is actually used. Entry is logged, attributed, and reviewable, without turning the place into a checkpoint.",
    points: [
      "Readers and cameras placed around real routines",
      "Every entry attributed and time-stamped",
      "Arming that follows the household schedule",
    ],
    image: "/images/carousel/access.jpg",
    insideImage: "/images/carousel/access-inside.jpg",
    objectPosition: "50% 55%",
  },
  {
    id: "ev",
    eyebrow: "EV",
    title: "Charging, load-aware.",
    description:
      "Level 2 and Level 3 chargers installed alongside panel coordination, so the rest of the property keeps its capacity while a vehicle charges. Sized once, correctly.",
    points: [
      "Panel and service load assessed before install",
      "Charging that yields to household demand",
      "Ready for a second charger when you are",
    ],
    image: "/images/carousel/ev.jpg",
    insideImage: "/images/carousel/ev-inside.jpg",
    objectPosition: "58% 50%",
  },
  {
    id: "lighting",
    eyebrow: "Lighting",
    title: "Scenes for the way you live.",
    description:
      "Lighting and shade control commissioned with a real walkthrough, not a smartphone preset. Scenes are tuned room by room until the space feels right at every hour.",
    points: [
      "Fixtures and keypads planned with the architecture",
      "Scenes tuned on site, not from a catalog",
      "Daylight-aware shades that track the sun",
    ],
    image: "/images/carousel/lighting.jpg",
    insideImage: "/images/carousel/lighting-inside.jpg",
    objectPosition: "42% 45%",
  },
  {
    id: "automation",
    eyebrow: "Automation",
    title: "Routines worth keeping.",
    description:
      "Scheduled, event-driven, and occupancy-aware routines configured around the household or operation. The system does the noticing, so the day takes fewer decisions.",
    points: [
      "Triggers from time, occupancy, and events",
      "Routines you can read and adjust",
      "Tuned against how the space is actually used",
    ],
    image: "/images/carousel/automation.jpg",
    insideImage: "/images/carousel/automation-inside.jpg",
    objectPosition: "40% 45%",
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
      {/* Desktop nav — centered above the track */}
      <div className="mb-8 hidden items-center justify-center gap-4 lg:flex">
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
      <Image
        src={cap.image}
        alt=""
        fill
        sizes="(max-width: 640px) 80vw, 23rem"
        style={{ objectPosition: cap.objectPosition }}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      {/* Legibility gradient — strongest at the bottom where the title sits,
          light through the middle so the photo stays visible. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/45"
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

              {/* Image header (scene image + eyebrow + title) */}
              <div className="relative h-64 w-full overflow-hidden sm:h-72">
                <Image
                  src={cap.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 48rem"
                  style={{ objectPosition: cap.objectPosition }}
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35"
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

                {/* Detail photo */}
                <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-border-soft bg-bg-1 lg:min-h-full">
                  <Image
                    src={cap.insideImage}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 90vw, 22rem"
                    style={{ objectPosition: cap.objectPosition }}
                    className="object-cover"
                  />
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
