"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

interface PortalView {
  id: string;
  label: string;
  /** Window-chrome path shown in the app frame. */
  path: string;
  /** Route the "Open" CTA deep-links to. */
  href: string;
  /** One-line description of what this area shows. */
  blurb: string;
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
    path: "northline.app / portal",
    href: "/portal",
    blurb: "System health, the latest events, and your next scheduled visit, at a glance.",
    image: "/Images/portal/portal-preview.png",
    alt: "The portal Overview, showing system health, recent events, and the next scheduled visit",
  },
  {
    id: "projects",
    label: "Projects",
    path: "northline.app / portal / projects",
    href: "/portal/projects",
    blurb: "Active installs and upgrades, with milestones, photos, and completion dates.",
    image: "/Images/portal/projects-preview.png",
    alt: "The portal Projects area, showing active installs with milestones and photos",
  },
  {
    id: "devices",
    label: "Devices",
    path: "northline.app / portal / devices",
    href: "/portal/devices",
    blurb: "Every device, its firmware, and when it was last seen on your network.",
    image: "/Images/portal/devices-preview.png",
    alt: "The portal Devices area, listing every device with firmware and last-seen status",
  },
  {
    id: "support",
    label: "Support",
    path: "northline.app / portal / support",
    href: "/portal/support",
    blurb: "A direct thread with your lead technician, with the full service history.",
    image: "/Images/portal/support-preview.png",
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
    <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Portal areas"
        aria-orientation="vertical"
        className="flex flex-col gap-2"
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
                "group rounded-xl border px-4 py-3.5 text-left transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                isActive
                  ? "border-accent/40 bg-accent/10"
                  : "border-border-soft bg-surface/40 hover:border-border hover:bg-surface",
              )}
            >
              <span
                className={cn(
                  "block text-sm font-medium transition-colors",
                  isActive ? "text-text-hi" : "text-text-mid group-hover:text-text-hi",
                )}
              >
                {view.label}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-text-low">
                {view.blurb}
              </span>
            </button>
          );
        })}

        <div className="mt-5">
          <Button variant="secondary" href={active.href}>
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
            <span className="ml-2 font-mono text-[11px] text-text-low">{active.path}</span>
          </div>
          <div className="relative aspect-[16/10] w-full bg-ink-1">
            {prefersReducedMotion ? (
              <Image
                key={active.id}
                src={active.image}
                alt={active.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
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
                          sizes="(max-width: 1024px) 100vw, 620px"
                          className="object-cover object-top"
                          priority={view.id === views[0].id}
                        />
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
