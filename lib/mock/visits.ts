/**
 * Upcoming visit records for the Overview surface.
 *
 * The PRD calls for upcoming visits in the portal overview. These records are
 * property-scoped like the rest of the mock data and mirror scheduled
 * maintenance entries in events.ts.
 */

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
}

export const visits: Visit[] = [
  {
    id: "visit-birch-side-yard-camera",
    propertyId: "birch-house",
    title: "Side yard camera replacement",
    scheduledFor: "2026-06-02T09:00:00-04:00",
    window: "9:00 AM to 11:00 AM",
    technicianId: "tech-aaron-k",
    status: "scheduled",
    scope: ["Replace north camera cable", "Pair thermostat remote sensor"],
  },
  {
    id: "visit-linden-reader-audit",
    propertyId: "linden-commercial",
    title: "Access reader audit",
    scheduledFor: "2026-06-03T07:30:00-07:00",
    window: "7:30 AM to 9:30 AM",
    technicianId: "tech-maya-o",
    status: "scheduled",
    scope: ["Audit rear staff reader", "Verify loading dock badge schedule"],
  },
];

export function getNextVisitForProperty(propertyId: string): Visit | undefined {
  return visits.find((visit) => visit.propertyId === propertyId);
}

