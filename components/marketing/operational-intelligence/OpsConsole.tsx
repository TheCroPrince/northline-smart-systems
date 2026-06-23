"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Check, Radio, RotateCcw } from "lucide-react";
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
    reasoning: "Matches scheduled FedEx window 2-4pm.",
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

// Phase timings (ms from run start). Mirrors PRD §7a: motion -> classifying ->
// classification -> decision, the full story inside ~3 seconds.
const PHASE_AT = [60, 1100, 2300, 3000] as const;
// phase index: 0 motion, 1 classifying, 2 classified, 3 decided

const FEED_TIMESTAMP = "02:14:07";
const FEED_DATE = "MAY 28";

/**
 * Operational Intelligence console. A purpose-built side-yard event visualization
 * plays beside the decision timeline. Auto-plays once on scroll-in, with a Replay
 * control and a Delivery / Unknown path toggle.
 *
 * Copy domain is governed by COPY_VOICE §9: the system speaks in fragments, the
 * word "AI" appears nowhere (including aria-labels), confidence is always a mono
 * percentage, and the Unknown path stays calm — colour shifts, pitch does not.
 *
 * Reduced motion -> the final decided state renders immediately, no timers, no
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
      {/* Event feed */}
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

        <div
          className="relative aspect-[16/11] w-full overflow-hidden bg-ink-0"
          role="img"
          aria-label={`Side yard event visualization showing ${path.classification.toLowerCase()} detection`}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(95,214,187,0.14), transparent 38%), linear-gradient(180deg, rgba(243,238,222,0.06), transparent 52%), #090a07",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgba(95,214,187,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(95,214,187,0.08) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.11] mix-blend-screen"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
            }}
          />

          <div
            aria-hidden
            className="absolute left-[7%] top-[20%] h-[34%] w-[36%] rounded-xl border border-text-hi/10 bg-text-hi/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-wide text-text-low">
              Residence
            </span>
            <span className="absolute bottom-3 right-3 rounded-full border border-border-soft px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-text-low">
              Locked
            </span>
          </div>

          <div
            aria-hidden
            className="absolute left-[9%] top-[64%] h-14 w-[86%] -rotate-6 rounded-full border border-accent/20 bg-accent/5"
          />
          <div
            aria-hidden
            className="absolute left-[53%] top-[27%] h-[46%] w-[34%] rounded-[1.5rem] border border-text-hi/10 bg-ink-0/35"
          >
            <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-wide text-text-low">
              Service lane
            </span>
          </div>

          <SceneNode className="left-[15%] top-[28%]" label="Door" />
          <SceneNode className="left-[42%] top-[58%]" label="Gate" active={reached(0)} />
          <SceneNode className="left-[70%] top-[43%]" label="Camera" active={reached(1)} />
          <SceneNode
            className="left-[64%] top-[70%]"
            label={path.id === "delivery" ? "Window matched" : "No window"}
            active={reached(2)}
            warm={isWarm}
            hideOnMobile
          />

          {/* Motion marker over the side-yard walkway */}
          <AnimatePresence>
            {reached(0) && (
              <motion.div
                aria-hidden
                className="absolute"
                style={{ left: "56%", top: "43%", width: "26%", height: "30%" }}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.fast / 1000, ease: ease.out }}
              >
                <div
                  className={cn(
                    "size-full rounded-md border-2 bg-ink-0/20 transition-colors duration-500",
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
                  {reached(2) ? path.classification.toUpperCase() : "SIGNAL LOCK"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <SignalRail
            active={reached(1)}
            isWarm={isWarm}
            prefersReducedMotion={prefersReducedMotion}
          />

          <div
            aria-hidden
            className={cn(
              "absolute bottom-3 right-4 z-20 rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide",
              reached(2)
                ? isWarm
                  ? "border-signal-warm/35 bg-signal-warm/10 text-signal-warm"
                  : "border-signal-ok/35 bg-signal-ok/10 text-signal-ok"
                : "border-border-soft bg-ink-0/55 text-text-low",
            )}
          >
            {reached(2) ? path.confidence : "Analyzing"}
          </div>

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

function SceneNode({
  className,
  label,
  active = false,
  warm = false,
  hideOnMobile = false,
}: {
  className: string;
  label: string;
  active?: boolean | null;
  warm?: boolean;
  hideOnMobile?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors duration-500",
        hideOnMobile ? "hidden sm:inline-flex" : "inline-flex",
        active
          ? warm
            ? "border-signal-warm/45 bg-signal-warm/10 text-signal-warm"
            : "border-accent/45 bg-accent/10 text-accent-bright"
          : "border-border-soft bg-ink-0/45 text-text-low",
        className,
      )}
    >
      <Radio size={11} strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}

function SignalRail({
  active,
  isWarm,
  prefersReducedMotion,
}: {
  active: boolean | null;
  isWarm: boolean;
  prefersReducedMotion: boolean | null;
}) {
  const signals = ["Camera", "Access", "Schedule", "Portal"] as const;

  return (
    <div
      aria-hidden
      className="absolute inset-x-4 bottom-10 grid grid-cols-4 gap-2 sm:bottom-11"
    >
      {signals.map((signal, index) => {
        const isLit = active && index < 3;
        const isDecision = active && index === 3;
        return (
          <div key={signal} className="min-w-0">
            <div
              className={cn(
                "h-1.5 rounded-full transition-colors duration-500",
                isLit || isDecision
                  ? isWarm && isDecision
                    ? "bg-signal-warm"
                    : "bg-accent-bright"
                  : "bg-border-soft",
                isDecision && !prefersReducedMotion && "motion-safe:animate-pulse",
              )}
            />
            <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-wide text-text-low">
              {signal}
            </span>
          </div>
        );
      })}
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
