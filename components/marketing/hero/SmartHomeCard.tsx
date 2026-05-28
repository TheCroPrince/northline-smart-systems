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

/**
 * Dark "device surface" smart-home card. Sits on the light hero as a premium
 * product moment — like a dark-screen device shown on a bright page. Cream text,
 * teal accents, layered depth, a few restrained live animations.
 */
export function SmartHomeCard() {
  const prefersReducedMotion = useReducedMotion();
  const float = prefersReducedMotion
    ? undefined
    : { y: [0, -8, 0] };

  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      {/* Ambient glow behind device */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-16 -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 65%)",
        }}
      />

      {/* Offset back-plate for depth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 translate-x-4 translate-y-5 rotate-[4deg] rounded-[2.25rem] border border-border-soft bg-surface-2/70 shadow-[var(--shadow-card)]"
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 36, rotate: -1.5 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          animate={float}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-[2.25rem] border border-ink-1 bg-ink-0 p-6 text-text-on-ink shadow-[0_40px_90px_rgba(20,24,26,0.45),0_8px_24px_rgba(20,24,26,0.3)] sm:p-7"
        >
          {/* Top sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(120% 80% at 80% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%)",
            }}
          />

          {/* Header */}
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-text-on-ink-mid">Property</p>
              <p className="mt-1 font-display text-2xl leading-none tracking-tight text-text-on-ink">
                Birch House
              </p>
              <p className="mt-1.5 text-xs text-text-on-ink-mid">
                Toronto · 11,000 sq ft
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-signal-ok/30 bg-signal-ok/10 px-3 py-1.5">
              <motion.span
                className="size-1.5 rounded-full bg-signal-ok"
                animate={prefersReducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs font-medium text-signal-ok">Healthy</span>
            </div>
          </div>

          {/* Climate hero tile */}
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-ink-1 bg-[color-mix(in_srgb,var(--ink-1)_80%,black)] p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(100% 100% at 100% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%)",
              }}
            />
            <div className="relative flex items-end justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent-soft">
                  Climate
                </p>
                <p className="mt-2 font-display text-6xl leading-none tracking-tight text-text-on-ink">
                  68°
                </p>
                <p className="mt-2 text-sm text-text-on-ink-mid">
                  Comfort · cooling to 67°
                </p>
              </div>
              <svg viewBox="0 0 80 80" className="size-16">
                <circle cx="40" cy="40" r="32" fill="none" stroke="color-mix(in srgb, white 12%, transparent)" strokeWidth="4" />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="var(--accent-bright)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="201"
                  initial={prefersReducedMotion ? undefined : { strokeDashoffset: 201 }}
                  animate={{ strokeDashoffset: 64 }}
                  transition={{ duration: 1.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  transform="rotate(-90 40 40)"
                />
              </svg>
            </div>
          </div>

          {/* Scenes */}
          <div className="relative mt-5">
            <p className="text-xs font-medium text-text-on-ink-mid">Scenes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {scenes.map((scene) => (
                <span
                  key={scene.label}
                  className={
                    scene.active
                      ? "rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-ink-0"
                      : "rounded-full border border-ink-1 bg-[color-mix(in_srgb,var(--ink-1)_60%,black)] px-3.5 py-1.5 text-xs font-medium text-text-on-ink-mid"
                  }
                >
                  {scene.label}
                </span>
              ))}
            </div>
          </div>

          {/* Device grid */}
          <div className="relative mt-5 grid grid-cols-2 gap-2">
            {devices.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-ink-1 bg-[color-mix(in_srgb,var(--ink-1)_55%,black)] px-3 py-2.5"
              >
                <div className="grid size-8 place-items-center rounded-lg bg-accent/15 text-accent-soft">
                  <Icon size={16} strokeWidth={1.75} aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-text-on-ink-mid">{label}</p>
                  <p className="truncate text-xs font-medium text-text-on-ink">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="relative mt-5 flex items-center justify-between border-t border-ink-1 pt-4">
            <div className="flex items-center gap-2 text-xs text-text-on-ink-mid">
              <Bell size={12} strokeWidth={1.75} aria-hidden />
              <span>No alerts · last checked 14:23</span>
            </div>
            <span className="font-display text-sm italic text-accent-soft">
              Quietly running
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
