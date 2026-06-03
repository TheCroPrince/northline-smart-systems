/**
 * Upcoming visit records for the Overview surface.
 *
 * The PRD calls for upcoming visits in the portal overview. These records are
 * property-scoped like the rest of the mock data and mirror scheduled
 * maintenance entries in events.ts.
 */

import { upcomingDate } from "@/lib/time";

export type VisitStatus = "scheduled" | "in_progress" | "resolved";

export interface Visit {
  id: string;
  propertyId: string;
  title: string;
  scheduledFor: string;
  window: string;
  technicianId: string;
  status: VisitStatus;
  scope: string[];
  /** Days ahead of "now" the visit sits, so the date never drifts into the past. */
  daysAhead?: number;
}

export const visits: Visit[] = [
  {
    id: "visit-birch-side-yard-camera",
    propertyId: "birch-house",
    title: "Side yard camera replacement",
    scheduledFor: "2026-06-02",
    window: "9:00 AM to 11:00 AM",
    technicianId: "tech-aaron-k",
    status: "scheduled",
    scope: ["Replace north camera cable", "Pair thermostat remote sensor"],
    daysAhead: 2,
  },
  {
    id: "visit-linden-reader-audit",
    propertyId: "linden-commercial",
    title: "Access reader audit",
    scheduledFor: "2026-06-03",
    window: "7:30 AM to 9:30 AM",
    technicianId: "tech-maya-o",
    status: "scheduled",
    scope: ["Audit rear staff reader", "Verify loading dock badge schedule"],
    daysAhead: 3,
  },
];

/**
 * Resolve a visit's `scheduledFor` to a near-future date relative to `now`.
 * Without `now` the stored fallback date is returned (e.g., for static callers).
 */
function resolveVisit(visit: Visit, now?: Date): Visit {
  if (now === undefined || visit.daysAhead === undefined) return visit;
  return { ...visit, scheduledFor: upcomingDate(now, visit.daysAhead) };
}

export function getNextVisitForProperty(
  propertyId: string,
  now?: Date,
): Visit | undefined {
  const visit = visits.find((visit) => visit.propertyId === propertyId);
  return visit ? resolveVisit(visit, now) : undefined;
}

export function getVisitById(id: string, now?: Date): Visit | undefined {
  const visit = visits.find((visit) => visit.id === id);
  return visit ? resolveVisit(visit, now) : undefined;
}

