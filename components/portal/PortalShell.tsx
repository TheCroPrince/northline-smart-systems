import Link from "next/link";
import type { ReactNode } from "react";
import { Building2, ChevronDown, Home, Search } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";
import type { Property } from "@/lib/mock/properties";
import { portalConfig } from "@/lib/mock/portal";

interface PortalShellProps {
  properties: Property[];
  currentProperty: Property;
  children: ReactNode;
}

export function PortalShell({
  properties,
  currentProperty,
  children,
}: PortalShellProps) {
  return (
    <div className="min-h-screen bg-bg-0 text-text-hi">
      <header className="sticky top-0 z-40 border-b border-border-soft bg-ink-0/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/"
                prefetch={false}
                className="flex shrink-0 items-baseline gap-2 transition-colors hover:text-accent-soft"
                aria-label="Northline home"
              >
                <span className="font-display text-xl tracking-tight text-text-hi">
                  Northline
                </span>
                <span className="hidden font-display text-xl italic text-accent-bright sm:inline">
                  smart systems
                </span>
              </Link>

              <span className="hidden h-5 w-px bg-border-soft md:block" aria-hidden />

              <PropertySwitcher
                currentProperty={currentProperty}
                properties={properties}
              />
            </div>

            <div className="flex items-center gap-3">
              <div
                role="search"
                className="hidden h-10 min-w-64 items-center gap-2 rounded-md border border-border-soft bg-surface/55 px-3 text-text-low lg:flex"
              >
                <Search size={15} strokeWidth={1.8} aria-hidden />
                <input
                  readOnly
                  aria-label="Search portal"
                  placeholder="Search events, devices, visits"
                  className="w-full bg-transparent text-sm text-text-mid placeholder:text-text-low"
                />
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-none text-text-hi">
                  {portalConfig.user.firstName} {portalConfig.user.lastInitial}.
                </p>
                <p className="mt-1 font-mono text-[11px] leading-none text-text-low">
                  {portalConfig.user.emailMasked}
                </p>
              </div>

              <div
                className="grid size-10 place-items-center rounded-md border border-border bg-surface-2 text-sm font-semibold text-text-hi"
                style={{ backgroundColor: portalConfig.user.avatarColor }}
                aria-label={`${portalConfig.user.firstName} account`}
                role="img"
              >
                {portalConfig.user.initials}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <nav
              aria-label="Portal sections"
              className="flex min-w-0 gap-1 overflow-x-auto pb-1 text-sm scrollbar-hide"
            >
              {portalConfig.tabs.map((tab) => {
                const isActive = tab.id === "overview";
                return isActive ? (
                  <span
                    key={tab.id}
                    aria-current="page"
                    className="relative flex h-9 items-center rounded-md bg-surface-2 px-3.5 font-medium text-text-hi"
                  >
                    {tab.label}
                    <span
                      className="absolute inset-x-2 -bottom-1 h-px bg-accent-soft"
                      aria-hidden
                    />
                  </span>
                ) : (
                  <span
                    key={tab.id}
                    aria-disabled="true"
                    className="flex h-9 items-center rounded-md px-3.5 font-medium text-text-low"
                  >
                    {tab.label}
                  </span>
                );
              })}
            </nav>

            <StatusPill tone="healthy" className="hidden shrink-0 md:inline-flex">
              Monitored
            </StatusPill>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}

function PropertySwitcher({
  currentProperty,
  properties,
}: {
  currentProperty: Property;
  properties: Property[];
}) {
  const Icon = currentProperty.kind === "residential" ? Home : Building2;

  return (
    <details className="group relative">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-md border border-border-soft bg-surface/60 px-3 text-sm font-medium text-text-hi transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
        <Icon size={15} strokeWidth={1.8} aria-hidden />
        <span className="max-w-[42vw] truncate sm:max-w-none">
          {currentProperty.name}
        </span>
        <ChevronDown
          size={15}
          strokeWidth={1.8}
          className="text-text-low transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <div className="absolute left-0 top-12 z-50 w-72 rounded-lg border border-border bg-ink-1 p-1 shadow-[var(--shadow-2)]">
        {properties.map((property) => {
          const isActive = property.id === currentProperty.id;
          const PropertyIcon = property.kind === "residential" ? Home : Building2;
          return (
            <a
              key={property.id}
              href={propertyHref(property.id)}
              className={cn(
                "flex items-start gap-3 rounded-md px-3 py-3 transition-colors",
                isActive
                  ? "bg-surface-2 text-text-hi"
                  : "text-text-mid hover:bg-surface hover:text-text-hi",
              )}
            >
              <PropertyIcon
                size={17}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0"
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {property.name}
                </span>
                <span className="mt-0.5 block truncate text-xs text-text-low">
                  {property.city} · {property.systems.cameras} cameras ·{" "}
                  {property.systems.accessPoints} access points
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </details>
  );
}

function propertyHref(propertyId: string): string {
  return `/portal?p=${propertyId}`;
}
