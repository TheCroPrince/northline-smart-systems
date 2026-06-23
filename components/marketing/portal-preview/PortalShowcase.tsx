"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  HardDrive,
  History,
  ListChecks,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

interface PortalDetail {
  icon: LucideIcon;
  label: string;
  text: string;
}

interface PortalView {
  id: string;
  label: string;
  kicker: string;
  /** Window-chrome path shown in the app frame. */
  path: string;
  /** Route the "Open" CTA deep-links to. */
  href: string;
  /** One-line description of what this area shows. */
  blurb: string;
  /** Premium summary for the active "what's inside" panel. */
  outcome: string;
  details: readonly PortalDetail[];
  image: string;
  alt: string;
}

/**
 * The four real portal areas, each backed by an actual screenshot. Order mirrors
 * the portal's own nav: Overview · Projects · Devices · Support.
 */
const views: readonly PortalView[] = [
  {
    id: "overview",
    label: "Overview",
    kicker: "Owner brief",
    path: "northline.app / portal",
    href: "/portal",
    blurb: "System health, the latest events, and your next scheduled visit, at a glance.",
    outcome: "A calm morning brief for every property under care.",
    details: [
      {
        icon: ShieldCheck,
        label: "Health summary",
        text: "Security, network, lighting, and access status resolve into one owner-safe view.",
      },
      {
        icon: Activity,
        label: "Recent activity",
        text: "Routine events stay logged with clear timestamps instead of scattered notifications.",
      },
      {
        icon: CalendarClock,
        label: "Next visit",
        text: "Upcoming service windows stay visible before anyone has to ask for an update.",
      },
    ],
    image: "/images/portal/portal-preview.png",
    alt: "The portal Overview, showing system health, recent events, and the next scheduled visit",
  },
  {
    id: "projects",
    label: "Projects",
    kicker: "Install record",
    path: "northline.app / portal / projects",
    href: "/portal/projects",
    blurb: "Active installs and upgrades, with milestones, photos, and completion dates.",
    outcome: "A project record that makes high-touch work feel transparent.",
    details: [
      {
        icon: ListChecks,
        label: "Milestones",
        text: "Active scopes, completed steps, and next steps are grouped by property.",
      },
      {
        icon: Clock3,
        label: "Schedule truth",
        text: "Dates and progress stay visible without turning the owner into a project manager.",
      },
      {
        icon: History,
        label: "Site history",
        text: "Photos and completion notes become part of the long-term property record.",
      },
    ],
    image: "/images/portal/projects-preview.png",
    alt: "The portal Projects area, showing active installs with milestones and photos",
  },
  {
    id: "devices",
    label: "Devices",
    kicker: "System inventory",
    path: "northline.app / portal / devices",
    href: "/portal/devices",
    blurb: "Every device, its firmware, and when it was last seen on your network.",
    outcome: "A live inventory of the equipment Northline is responsible for.",
    details: [
      {
        icon: HardDrive,
        label: "Named equipment",
        text: "Controllers, cameras, access points, and chargers are listed in plain property terms.",
      },
      {
        icon: Activity,
        label: "Last seen",
        text: "Connectivity and status signals make silent failures easier to catch early.",
      },
      {
        icon: Wrench,
        label: "Service context",
        text: "Firmware and location details help technicians arrive with the right plan.",
      },
    ],
    image: "/images/portal/devices-preview.png",
    alt: "The portal Devices area, listing every device with firmware and last-seen status",
  },
  {
    id: "support",
    label: "Support",
    kicker: "Service thread",
    path: "northline.app / portal / support",
    href: "/portal/support",
    blurb: "A direct thread with your lead technician, with the full service history.",
    outcome: "A support channel that remembers the whole service relationship.",
    details: [
      {
        icon: MessageCircle,
        label: "Lead technician",
        text: "Owners write into one clear thread instead of chasing people across channels.",
      },
      {
        icon: History,
        label: "Complete history",
        text: "Past visits, requests, and responses remain attached to the property.",
      },
      {
        icon: CheckCircle2,
        label: "Resolution trail",
        text: "Open and completed work is easy to scan before the next service window.",
      },
    ],
    image: "/images/portal/support-preview.png",
    alt: "The portal Support area, showing a message thread with the lead technician",
  },
] as const;

/**
 * Interactive portal showcase. A vertical tab list swaps the framed screenshot
 * so the section conveys the portal's full breadth without image-spam. Only the
 * screenshots a visitor actually opens are mounted (truly lazy); the active
 * frame crossfades on switch. Reduced-motion → instant swap, no crossfade.
 */
export function PortalShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(views[0].id);
  // Track which views have been opened so we never load a screenshot a visitor
  // hasn't asked for. Overview is always present.
  const [visited, setVisited] = useState<Set<string>>(() => new Set([views[0].id]));

  const active = views.find((view) => view.id === activeId) ?? views[0];

  const select = (id: string) => {
    setActiveId(id);
    setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      {/* Portal controls and value detail */}
      <div className="flex min-w-0 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: duration.normal / 1000, ease: ease.out }}
            className="order-2 mt-4 rounded-2xl border border-border bg-ink-0/45 p-5 shadow-[var(--shadow-card)]"
          >
            <p className="font-mono text-[11px] uppercase tracking-wide text-accent-bright">
              Inside the portal
            </p>
            <h3 className="mt-2 text-pretty font-display text-2xl leading-tight text-text-hi sm:text-[1.75rem]">
              {active.outcome}
            </h3>
            <ul className="mt-5 space-y-4">
              {active.details.map(({ icon: Icon, label, text }) => (
                <li
                  key={label}
                  className="flex gap-3 border-t border-border-soft pt-4 first:border-t-0 first:pt-0"
                >
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-accent/25 bg-accent/10 text-accent-bright">
                    <Icon size={16} strokeWidth={2} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-text-hi">{label}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-text-mid">
                      {text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div
          role="tablist"
          aria-label="Portal areas"
          aria-orientation="vertical"
          className="order-1 grid grid-cols-2 gap-2"
        >
          {views.map((view) => {
            const isActive = view.id === active.id;
            return (
              <button
                key={view.id}
                type="button"
                role="tab"
                id={`portal-tab-${view.id}`}
                aria-selected={isActive}
                aria-controls="portal-tabpanel"
                onClick={() => select(view.id)}
                className={cn(
                  "group min-h-[86px] rounded-xl border px-3 py-3 text-left transition-colors duration-200 sm:min-h-[104px] sm:px-4 sm:py-3.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                  isActive
                    ? "border-accent/45 bg-accent/10 shadow-[var(--shadow-card)]"
                    : "border-border-soft bg-surface/40 hover:border-border hover:bg-surface",
                )}
              >
                <span className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <span
                    className={cn(
                      "block text-sm font-medium transition-colors",
                      isActive ? "text-text-hi" : "text-text-mid group-hover:text-text-hi",
                    )}
                  >
                    {view.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide transition-colors",
                      isActive
                        ? "border-accent/35 text-accent-bright"
                        : "border-border-soft text-text-low",
                    )}
                  >
                    {view.kicker}
                  </span>
                </span>
                <span className="mt-1 hidden text-[13px] leading-snug text-text-low sm:block">
                  {view.blurb}
                </span>
              </button>
            );
          })}
        </div>

        <div className="order-3 mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-sm leading-relaxed text-text-low">
            Read-only demo, shaped like the owner record a premium install should leave behind.
          </p>
          <Button variant="secondary" href={active.href} className="w-full shrink-0 sm:w-auto">
            Open {active.label === "Overview" ? "the portal" : active.label.toLowerCase()}
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
          </Button>
        </div>
      </div>

      {/* App-window framed screenshot */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 60% 30%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%)",
          }}
        />
        <div
          id="portal-tabpanel"
          role="tabpanel"
          aria-labelledby={`portal-tab-${active.id}`}
          className="overflow-hidden rounded-2xl border border-border bg-ink-1 shadow-[var(--shadow-2)]"
        >
          <div className="flex items-center gap-2 border-b border-border-soft bg-ink-0/60 px-4 py-3">
            <span className="size-2.5 rounded-full bg-border-strong" aria-hidden />
            <span className="size-2.5 rounded-full bg-border-strong" aria-hidden />
            <span className="size-2.5 rounded-full bg-border-strong" aria-hidden />
            <span className="ml-2 min-w-0 truncate font-mono text-[11px] text-text-low">
              {active.path}
            </span>
          </div>
          <div className="relative aspect-[329/125] w-full bg-ink-1">
            {prefersReducedMotion ? (
              <Image
                key={active.id}
                src={active.image}
                alt={active.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 680px"
                quality={92}
                className="object-cover object-top"
                priority={active.id === views[0].id}
              />
            ) : (
              <AnimatePresence mode="sync">
                {views
                  .filter((view) => visited.has(view.id))
                  .map((view) => {
                    const isActive = view.id === active.id;
                    return (
                      <motion.div
                        key={view.id}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{
                          duration: duration.normal / 1000,
                          ease: ease.out,
                        }}
                        style={{ pointerEvents: isActive ? "auto" : "none" }}
                        aria-hidden={!isActive}
                      >
                        <Image
                          src={view.image}
                          alt={view.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 680px"
                          quality={92}
                          className="object-cover object-top"
                          priority={view.id === views[0].id}
                        />
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border-soft bg-ink-0/45 px-4 py-3 text-[12px]">
            <span className="font-mono uppercase tracking-wide text-text-low">
              Live portal capture
            </span>
            <span className="truncate text-text-mid">{active.kicker}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
