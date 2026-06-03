"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

type PathId = "delivery" | "unknown";

interface PathScene {
  id: PathId;
  label: string;
  /** Classification chip — the system's read of who triggered the camera. */
  classification: string;
  confidence: string;
  /** Action card line 1 (system action) + line 2 (one-line reasoning). */
  action: string;
  reasoning: string;
  /** Drives the resolved-state colour. ok = quiet/logged, warm = escalated. */
  tone: "ok" | "warm";
}

const paths: readonly PathScene[] = [
  {
    id: "delivery",
    label: "Delivery",
    classification: "Delivery driver",
    confidence: "94%",
    action: "Logged. No alert sent.",
    reasoning: "Matches scheduled FedEx window 2–4pm.",
    tone: "ok",
  },
  {
    id: "unknown",
    label: "Unknown person",
    classification: "Unknown person",
    confidence: "87%",
    action: "Owner notified. Dispatch armed.",
    reasoning: "No scheduled access. After-hours.",
    tone: "warm",
  },
] as const;

// Phase timings (ms from run start). Mirrors PRD §7a: motion → classifying →
// classification → decision, the full story inside ~3 seconds.
const PHASE_AT = [60, 1100, 2300, 3000] as const;
// phase index: 0 motion · 1 classifying · 2 classified · 3 decided

const FEED_TIMESTAMP = "02:14:07";
const FEED_DATE = "MAY 28";

/**
 * Operational Intelligence console. A treated camera still plays as a live side-
 * yard feed; the control panel runs the decision timeline beside it. Auto-plays
 * once on scroll-in, with a Replay control and a Delivery / Unknown path toggle.
 *
 * Copy domain is governed by COPY_VOICE §9: the system speaks in fragments, the
 * word "AI" appears nowhere (including aria-labels), confidence is always a mono
 * percentage, and the Unknown path stays calm — colour shifts, pitch does not.
 *
 * Reduced motion → the final decided state renders immediately, no timers, no
 * shimmer (DESIGN_MOTION reduced-motion contract).
 */
export function OpsConsole() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });

  const [pathId, setPathId] = useState<PathId>("delivery");
  const [phase, setPhase] = useState(-1);
  const [runId, setRunId] = useState(0);
  const startedRef = useRef(false);

  const path = paths.find((p) => p.id === pathId) ?? paths[0];
  const isWarm = path.tone === "warm";
  // In reduced motion we hold the final state; otherwise gate on phase.
  const reached = (p: number) => prefersReducedMotion || phase >= p;

  // Kick off once the section scrolls into view.
  useEffect(() => {
    if (inView && !startedRef.current) {
      startedRef.current = true;
      setRunId((n) => n + 1);
    }
  }, [inView]);

  // Run (or re-run) the timeline whenever runId / path changes.
  useEffect(() => {
    if (runId === 0) return; // not started yet
    if (prefersReducedMotion) {
      setPhase(3);
      return;
    }
    setPhase(-1);
    const timers = PHASE_AT.map((at, i) =>
      window.setTimeout(() => setPhase(i), at),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [runId, pathId, prefersReducedMotion]);

  const replay = () => setRunId((n) => n + 1);
  const selectPath = (id: PathId) => {
    if (id === pathId) {
      replay();
      return;
    }
    setPathId(id);
    setRunId((n) => n + 1);
  };

  const toneText = isWarm ? "text-signal-warm" : "text-signal-ok";
  const toneBorder = isWarm ? "border-signal-warm/50" : "border-signal-ok/45";
  const toneBg = isWarm ? "bg-signal-warm/10" : "bg-signal-ok/10";

  return (
    <div ref={sectionRef} className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-7">
      {/* Camera feed */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-ink-1 shadow-[var(--shadow-2)]">
        {/* Feed chrome */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 font-mono text-[11px] tracking-wide text-text-hi/90">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2 items-center justify-center">
              <span
                className={cn(
                  "absolute inline-flex size-2 rounded-full bg-[#e2685f]",
                  !prefersReducedMotion && "motion-safe:animate-ping",
                )}
              />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#e2685f]" />
            </span>
            REC
          </span>
          <span className="text-text-hi/70">CAM 02 · SIDE YARD</span>
        </div>

        <div className="relative aspect-[16/11] w-full">
          <Image
            src="/Images/carousel/access.jpg"
            alt="Side yard camera feed"
            fill
            sizes="(max-width: 1024px) 100vw, 680px"
            className="object-cover"
            style={{ filter: "brightness(0.82) contrast(1.05) saturate(0.92)" }}
          />
          {/* Surveillance treatment: cool vignette + scanlines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(8,9,12,0.55) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Motion marker over the side-yard walkway */}
          <AnimatePresence>
            {reached(0) && (
              <motion.div
                aria-hidden
                className="absolute"
                style={{ left: "62%", top: "55%", width: "24%", height: "30%" }}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.fast / 1000, ease: ease.out }}
              >
                <div
                  className={cn(
                    "size-full rounded-sm border-2 transition-colors duration-500",
                    reached(2)
                      ? isWarm
                        ? "border-signal-warm/80"
                        : "border-signal-ok/80"
                      : "border-accent-bright/80",
                  )}
                />
                <span
                  className={cn(
                    "absolute -top-5 left-0 font-mono text-[10px] tracking-wide transition-colors duration-500",
                    reached(2) ? toneText : "text-accent-bright",
                  )}
                >
                  {reached(2) ? path.classification.toUpperCase() : "TRACKING"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timestamp */}
          <div className="absolute bottom-3 left-4 z-20 font-mono text-[11px] text-text-hi/80">
            {FEED_DATE} · {FEED_TIMESTAMP}
          </div>
        </div>
      </div>

      {/* Control panel */}
      <div className="flex flex-col rounded-2xl border border-border bg-surface/60 p-5 shadow-[var(--shadow-2)] sm:p-6">
        <div className="flex items-center justify-between border-b border-border-soft pb-3">
          <span className="font-mono text-[11px] tracking-wide text-text-low">
            EVENT · BIRCH HOUSE
          </span>
          <span className="font-mono text-[11px] text-text-low">{FEED_TIMESTAMP}</span>
        </div>

        <div className="flex-1 space-y-4 py-5" aria-live="polite">
          {/* Trigger */}
          <Row visible={reached(0)} prefersReducedMotion={prefersReducedMotion}>
            <p className="text-sm text-text-hi">Motion detected · side yard camera</p>
          </Row>

          {/* Classifying → classification */}
          <Row visible={reached(1)} prefersReducedMotion={prefersReducedMotion}>
            {reached(2) ? (
              <div
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
                  toneBorder,
                  toneBg,
                )}
              >
                <span className={cn("text-sm font-medium", toneText)}>
                  {path.classification}
                </span>
                <span className="font-mono text-[13px] text-text-mid">
                  · {path.confidence} confidence
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-bg-1/60 px-3 py-1.5 text-sm text-text-mid">
                <span
                  className={cn(
                    "size-1.5 rounded-full bg-accent-bright",
                    !prefersReducedMotion && "motion-safe:animate-pulse",
                  )}
                  aria-hidden
                />
                Classifying…
              </span>
            )}
          </Row>

          {/* Decision */}
          <Row visible={reached(3)} prefersReducedMotion={prefersReducedMotion}>
            <div
              className={cn(
                "rounded-xl border p-4",
                toneBorder,
                toneBg,
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full",
                    isWarm ? "bg-signal-warm/20 text-signal-warm" : "bg-signal-ok/20 text-signal-ok",
                  )}
                >
                  <Check size={12} strokeWidth={2.5} aria-hidden />
                </span>
                <p className={cn("font-mono text-sm", toneText)}>{path.action}</p>
              </div>
              <p className="mt-2 pl-7 text-sm text-text-mid">{path.reasoning}</p>
            </div>
          </Row>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 border-t border-border-soft pt-4">
          <div
            role="group"
            aria-label="Event path"
            className="inline-flex rounded-full border border-border-soft bg-bg-1/60 p-0.5"
          >
            {paths.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === pathId}
                onClick={() => selectPath(p.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                  p.id === pathId
                    ? "bg-accent/15 text-text-hi"
                    : "text-text-low hover:text-text-mid",
                )}
              >
                <span className="sr-only">Show path: </span>
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={replay}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-text-mid transition-colors",
              "hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
            )}
          >
            <RotateCcw size={14} strokeWidth={2} aria-hidden />
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * A single timeline row. Animates in when `visible`; in reduced motion it simply
 * renders (or not) with no transition.
 */
function Row({
  visible,
  prefersReducedMotion,
  children,
}: {
  visible: boolean;
  prefersReducedMotion: boolean | null;
  children: React.ReactNode;
}) {
  if (prefersReducedMotion) {
    return visible ? <div>{children}</div> : null;
  }
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.normal / 1000, ease: ease.out }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
