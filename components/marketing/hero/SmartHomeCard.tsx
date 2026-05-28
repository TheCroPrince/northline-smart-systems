"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bell, Lightbulb, Lock, Music, Wifi } from "lucide-react";

const scenes = [
  { label: "Morning", active: false },
  { label: "Away", active: true },
  { label: "Evening", active: false },
  { label: "Movie", active: false },
] as const;

const devices = [
  { label: "Network", value: "Healthy", Icon: Wifi },
  { label: "Lighting", value: "12 scenes", Icon: Lightbulb },
  { label: "Access", value: "Armed", Icon: Lock },
  { label: "Audio", value: "3 zones", Icon: Music },
] as const;

export function SmartHomeCard() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* Soft glow blob behind card (paper-toned, very low opacity) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 -z-10 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_60%)] blur-2xl"
      />

      {/* Stacked card behind for depth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rotate-[3deg] rounded-[2rem] border border-border-soft bg-surface-2/80 shadow-[var(--shadow-card)]"
        style={{ transformOrigin: "center" }}
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 32, rotate: -2 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-border-soft bg-surface p-6 shadow-[var(--shadow-card-hover)] sm:p-7"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-text-low">Property</p>
            <p className="mt-1 font-display text-2xl leading-none tracking-tight text-text-hi">
              Birch House
            </p>
            <p className="mt-1 text-xs text-text-mid">Toronto · 11,000 sq ft</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-signal-ok/30 bg-signal-ok/8 px-3 py-1">
            <motion.span
              className="size-1.5 rounded-full bg-signal-ok"
              animate={prefersReducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-xs font-medium text-signal-ok">Healthy</span>
          </div>
        </div>

        {/* Climate hero tile */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-accent-tint to-surface-2 p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                Climate
              </p>
              <p className="mt-2 font-display text-6xl leading-none tracking-tight text-text-hi">
                68°
              </p>
              <p className="mt-2 text-sm text-text-mid">
                Comfort · cooling to 67°
              </p>
            </div>
            <div className="relative">
              <svg viewBox="0 0 80 80" className="size-16">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="var(--border-soft)"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="201"
                  initial={prefersReducedMotion ? undefined : { strokeDashoffset: 201 }}
                  animate={{ strokeDashoffset: 60 }}
                  transition={{
                    duration: 1.6,
                    delay: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  transform="rotate(-90 40 40)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scene chips */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-text-low">Scenes</p>
            <p className="text-xs text-text-low">Bell</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {scenes.map((scene) => (
              <span
                key={scene.label}
                className={
                  scene.active
                    ? "rounded-full bg-ink-0 px-3.5 py-1.5 text-xs font-medium text-text-on-ink"
                    : "rounded-full border border-border bg-surface-2 px-3.5 py-1.5 text-xs font-medium text-text-mid"
                }
              >
                {scene.label}
              </span>
            ))}
          </div>
        </div>

        {/* Device row */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {devices.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface-2 px-3 py-2.5"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-accent-tint text-accent">
                <Icon size={16} strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-text-mid">{label}</p>
                <p className="truncate text-xs font-medium text-text-hi">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4">
          <div className="flex items-center gap-2 text-xs text-text-mid">
            <Bell size={12} strokeWidth={1.75} aria-hidden />
            <span>No alerts · last checked 14:23</span>
          </div>
          <span className="font-display text-xs italic text-accent">Quietly running</span>
        </div>
      </motion.div>
    </div>
  );
}
