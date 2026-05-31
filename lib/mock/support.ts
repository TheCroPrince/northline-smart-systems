/**
 * Support requests — the Support tab's source of truth, and the Overview tab's
 * support preview. Builds on the conversation primitives in `messages.ts`
 * (Technician, Message) and links out to `devices.ts` and `visits.ts`, so a
 * request reads as part of one connected system rather than an island.
 *
 * Statuses are customer-facing and calm by design (no ticketing jargon). Most
 * activity is routine; nothing here is a dramatic failure.
 *
 * Two timestamp regimes per §1.2: `createdAt` is an absolute ISO date,
 * `updatedAtMinutesAgo` is a relative offset resolved once at render.
 */

import type { Message } from "@/lib/mock/messages";

export type SupportStatus =
  | "new"
  | "scheduled"
  | "in_progress"
  | "awaiting_you"
  | "monitoring"
  | "resolved";

export type SupportPriority = "routine" | "priority" | "urgent";

/** Mirrors the Devices tab's owner-facing categories, plus a catch-all. */
export type SupportCategory =
  | "security_access"
  | "surveillance"
  | "environmental"
  | "energy"
  | "network"
  | "general";

export interface SupportRequest {
  id: string;
  propertyId: string;
  title: string;
  status: SupportStatus;
  priority: SupportPriority;
  category: SupportCategory;
  /** ISO date the request was opened. */
  createdAt: string;
  /** Relative offset for the last activity, resolved at render. */
  updatedAtMinutesAgo: number;
  assignedTechnicianId: string;
  /** FK -> devices.ts, when the request is about a specific device. */
  deviceId?: string;
  /** FK -> visits.ts, when a visit is booked for this request. */
  scheduledVisitId?: string;
  /** Present once resolved — the closing summary the client sees. */
  resolutionNote?: string;
  messages: Message[];
}

/** A completed piece of service work — terse, for the "Recent resolutions" strip. */
export interface ServiceRecord {
  id: string;
  propertyId: string;
  title: string;
  category: SupportCategory;
  technicianId: string;
  /** ISO date the work was completed. */
  completedOn: string;
}

export const supportRequests: SupportRequest[] = [
  // ---------------------------------------------------------------------------
  // Birch House — client Michael R., project lead Aaron K.
  // ---------------------------------------------------------------------------
  {
    id: "sr-birch-porch-glare",
    propertyId: "birch-house",
    title: "Front porch camera glare in the afternoon",
    status: "new",
    priority: "routine",
    category: "surveillance",
    createdAt: "2026-05-31",
    updatedAtMinutesAgo: 35,
    assignedTechnicianId: "tech-aaron-k",
    deviceId: "front-porch-camera",
    messages: [
      {
        id: "sr-birch-porch-glare-m1",
        threadId: "sr-birch-porch-glare",
        authorId: "client",
        body: "The front porch camera washes out around 5pm with the sun low. Anything we can do?",
        sentAtMinutesAgo: 35,
      },
    ],
  },
  {
    id: "sr-birch-side-yard-camera",
    propertyId: "birch-house",
    title: "Side yard camera replacement",
    status: "scheduled",
    priority: "routine",
    category: "surveillance",
    createdAt: "2026-05-30",
    updatedAtMinutesAgo: 240,
    assignedTechnicianId: "tech-aaron-k",
    deviceId: "side-yard-camera-north",
    scheduledVisitId: "visit-birch-side-yard-camera",
    messages: [
      {
        id: "sr-birch-side-yard-camera-m1",
        threadId: "sr-birch-side-yard-camera",
        authorId: "tech-aaron-k",
        body: "Hi Michael. The intermittent uplink on the north side yard camera is the cable, not the unit. We have a replacement on the truck for Tuesday morning, 9 to 11 window. Jordan will text when he is parked.",
        sentAt: "2026-05-30T15:42:00-04:00",
      },
      {
        id: "sr-birch-side-yard-camera-m2",
        threadId: "sr-birch-side-yard-camera",
        authorId: "client",
        body: "Tuesday works. Side gate code is the same.",
        sentAt: "2026-05-30T16:08:00-04:00",
      },
      {
        id: "sr-birch-side-yard-camera-m3",
        threadId: "sr-birch-side-yard-camera",
        authorId: "tech-aaron-k",
        body: "Confirmed. A calendar hold is on the account with Jordan as the lead tech for the visit.",
        sentAtMinutesAgo: 240,
      },
    ],
  },
  {
    id: "sr-birch-thermostat-battery",
    propertyId: "birch-house",
    title: "Living thermostat remote sensor battery",
    status: "in_progress",
    priority: "routine",
    category: "energy",
    createdAt: "2026-05-29",
    updatedAtMinutesAgo: 1500,
    assignedTechnicianId: "tech-aaron-k",
    deviceId: "living-thermostat",
    messages: [
      {
        id: "sr-birch-thermostat-battery-m1",
        threadId: "sr-birch-thermostat-battery",
        authorId: "tech-aaron-k",
        body: "Hi Michael. The living thermostat's paired remote sensor is reporting a low battery. It is not affecting heating or cooling. We will swap it during Tuesday's visit so there is no second trip.",
        sentAtMinutesAgo: 1500,
      },
      {
        id: "sr-birch-thermostat-battery-m2",
        threadId: "sr-birch-thermostat-battery",
        authorId: "client",
        body: "Perfect, no rush. Thanks for folding it in.",
        sentAtMinutesAgo: 1460,
      },
    ],
  },
  {
    id: "sr-birch-guest-codes",
    propertyId: "birch-house",
    title: "Guest access codes for the summer",
    status: "awaiting_you",
    priority: "routine",
    category: "security_access",
    createdAt: "2026-05-28",
    updatedAtMinutesAgo: 2600,
    assignedTechnicianId: "tech-aaron-k",
    deviceId: "side-gate-reader",
    messages: [
      {
        id: "sr-birch-guest-codes-m1",
        threadId: "sr-birch-guest-codes",
        authorId: "tech-aaron-k",
        body: "Hi Michael. You asked about guest codes for the season. Send over the names and the days you want active and we will set each to expire automatically. Nothing stays open longer than you intend.",
        sentAtMinutesAgo: 2600,
      },
    ],
  },
  {
    id: "sr-birch-ev-schedule",
    propertyId: "birch-house",
    title: "Garage EV charger overnight schedule",
    status: "monitoring",
    priority: "routine",
    category: "energy",
    createdAt: "2026-05-26",
    updatedAtMinutesAgo: 4320,
    assignedTechnicianId: "tech-aaron-k",
    deviceId: "garage-ev-charger",
    messages: [
      {
        id: "sr-birch-ev-schedule-m1",
        threadId: "sr-birch-ev-schedule",
        authorId: "client",
        body: "The garage charger seems to wait until late evening to start. Is that intentional?",
        sentAt: "2026-05-26T20:14:00-04:00",
      },
      {
        id: "sr-birch-ev-schedule-m2",
        threadId: "sr-birch-ev-schedule",
        authorId: "tech-aaron-k",
        body: "Yes. The load-balance automation staggers both chargers after the evening peak so you stay under the panel limit. We are watching the panel draw this week to confirm there is headroom to start earlier.",
        sentAt: "2026-05-26T20:41:00-04:00",
      },
    ],
  },
  {
    id: "sr-birch-firmware-window",
    propertyId: "birch-house",
    title: "Scheduled firmware push",
    status: "resolved",
    priority: "routine",
    category: "network",
    createdAt: "2026-05-28",
    updatedAtMinutesAgo: 1820,
    assignedTechnicianId: "tech-aaron-k",
    deviceId: "network-closet-switch",
    resolutionNote:
      "Access points updated overnight and the roaming tables rebuilt cleanly. No client downtime.",
    messages: [
      {
        id: "sr-birch-firmware-window-m1",
        threadId: "sr-birch-firmware-window",
        authorId: "tech-aaron-k",
        body: "Hi Michael. We have a firmware push staged for the access points overnight. You should not notice anything; I will confirm in the morning.",
        sentAt: "2026-05-28T17:02:00-04:00",
      },
      {
        id: "sr-birch-firmware-window-m2",
        threadId: "sr-birch-firmware-window",
        authorId: "tech-aaron-k",
        body: "All set. The access points updated overnight and the roaming tables rebuilt cleanly. No action needed.",
        sentAt: "2026-05-29T07:24:00-04:00",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Linden Commercial — client Priya N., operations Maya O.
  // ---------------------------------------------------------------------------
  {
    id: "sr-linden-reader-audit",
    propertyId: "linden-commercial",
    title: "Access reader audit",
    status: "scheduled",
    priority: "routine",
    category: "security_access",
    createdAt: "2026-05-31",
    updatedAtMinutesAgo: 52,
    assignedTechnicianId: "tech-maya-o",
    scheduledVisitId: "visit-linden-reader-audit",
    messages: [
      {
        id: "sr-linden-reader-audit-m1",
        threadId: "sr-linden-reader-audit",
        authorId: "tech-maya-o",
        body: "Hi Priya. Jordan will start at the loading dock and move through the north stair readers before tenant arrival. The work stays inside the 7:30 to 9:30 window.",
        sentAtMinutesAgo: 95,
      },
      {
        id: "sr-linden-reader-audit-m2",
        threadId: "sr-linden-reader-audit",
        authorId: "client",
        body: "Good. Security has the visitor badge ready.",
        sentAtMinutesAgo: 52,
      },
    ],
  },
  {
    id: "sr-linden-ev-bay-3",
    propertyId: "linden-commercial",
    title: "EV charger bay 3 charging slower than usual",
    status: "in_progress",
    priority: "priority",
    category: "energy",
    createdAt: "2026-05-30",
    updatedAtMinutesAgo: 300,
    assignedTechnicianId: "tech-maya-o",
    deviceId: "ev-charger-bay-3",
    messages: [
      {
        id: "sr-linden-ev-bay-3-m1",
        threadId: "sr-linden-ev-bay-3",
        authorId: "client",
        body: "A tenant flagged that bay 3 is charging slowly compared to the others.",
        sentAtMinutesAgo: 540,
      },
      {
        id: "sr-linden-ev-bay-3-m2",
        threadId: "sr-linden-ev-bay-3",
        authorId: "tech-maya-o",
        body: "Thanks Priya. Bay 3 capped its own charge rate after a thermal warning, which is the unit protecting itself. We have a replacement contactor on order and a ticket open. The other bays are unaffected.",
        sentAtMinutesAgo: 300,
      },
    ],
  },
  {
    id: "sr-linden-humidity-drift",
    propertyId: "linden-commercial",
    title: "Mechanical room humidity reading drift",
    status: "in_progress",
    priority: "routine",
    category: "environmental",
    createdAt: "2026-05-29",
    updatedAtMinutesAgo: 1600,
    assignedTechnicianId: "tech-maya-o",
    deviceId: "linden-mech-humidity-sensor",
    messages: [
      {
        id: "sr-linden-humidity-drift-m1",
        threadId: "sr-linden-humidity-drift",
        authorId: "tech-maya-o",
        body: "Hi Priya. The mechanical room humidity sensor is reading a little high against the reference. Nothing is at risk; we have a recalibration scheduled and will confirm the reading afterward.",
        sentAtMinutesAgo: 1600,
      },
    ],
  },
  {
    id: "sr-linden-annex-camera",
    propertyId: "linden-commercial",
    title: "Parking annex camera offline during resurfacing",
    status: "monitoring",
    priority: "routine",
    category: "surveillance",
    createdAt: "2026-05-27",
    updatedAtMinutesAgo: 3300,
    assignedTechnicianId: "tech-maya-o",
    deviceId: "parking-annex-camera",
    messages: [
      {
        id: "sr-linden-annex-camera-m1",
        threadId: "sr-linden-annex-camera",
        authorId: "tech-maya-o",
        body: "Hi Priya. We pulled the south annex camera ahead of the resurfacing crew so it would not be damaged. It will read offline in the portal until the bay reopens, then we will remount and realign it.",
        sentAtMinutesAgo: 3300,
      },
      {
        id: "sr-linden-annex-camera-m2",
        threadId: "sr-linden-annex-camera",
        authorId: "client",
        body: "Understood, thanks for the heads up.",
        sentAtMinutesAgo: 3260,
      },
    ],
  },
  {
    id: "sr-linden-contractor-access",
    propertyId: "linden-commercial",
    title: "Remove former contractor credential",
    status: "resolved",
    priority: "priority",
    category: "security_access",
    createdAt: "2026-05-30",
    updatedAtMinutesAgo: 1200,
    assignedTechnicianId: "tech-maya-o",
    deviceId: "storage-corridor-reader",
    resolutionNote:
      "Credential revoked across all readers and verified denied at the storage corridor on May 30.",
    messages: [
      {
        id: "sr-linden-contractor-access-m1",
        threadId: "sr-linden-contractor-access",
        authorId: "client",
        body: "Please pull access for the fit-out contractor; their work wrapped Friday.",
        sentAt: "2026-05-30T09:10:00-07:00",
      },
      {
        id: "sr-linden-contractor-access-m2",
        threadId: "sr-linden-contractor-access",
        authorId: "tech-maya-o",
        body: "Done. The credential is revoked across every reader and I confirmed it is denied at the storage corridor. You will see the denied attempt logged in the event feed.",
        sentAtMinutesAgo: 1200,
      },
    ],
  },
  {
    id: "sr-linden-wifi-interference",
    propertyId: "linden-commercial",
    title: "Conference wing Wi-Fi dropouts",
    status: "resolved",
    priority: "routine",
    category: "network",
    createdAt: "2026-05-28",
    updatedAtMinutesAgo: 2880,
    assignedTechnicianId: "tech-maya-o",
    deviceId: "roof-ap-west",
    resolutionNote:
      "Wireless channel plan moved off the neighboring tenant's interference. The conference wing has been stable since May 30.",
    messages: [
      {
        id: "sr-linden-wifi-interference-m1",
        threadId: "sr-linden-wifi-interference",
        authorId: "client",
        body: "We had a few video calls drop in the conference wing this week.",
        sentAt: "2026-05-28T13:20:00-07:00",
      },
      {
        id: "sr-linden-wifi-interference-m2",
        threadId: "sr-linden-wifi-interference",
        authorId: "tech-maya-o",
        body: "We traced it to a neighboring tenant on the same wireless channels. We rebuilt the channel plan around them. Let us know if you see another drop, but it has held since.",
        sentAtMinutesAgo: 2880,
      },
    ],
  },
];

export const serviceHistory: ServiceRecord[] = [
  // Birch House
  {
    id: "svc-birch-firmware-aps",
    propertyId: "birch-house",
    title: "Firmware updated · 6 access points",
    category: "network",
    technicianId: "tech-aaron-k",
    completedOn: "2026-05-29",
  },
  {
    id: "svc-birch-driveway-align",
    propertyId: "birch-house",
    title: "Driveway camera alignment completed",
    category: "surveillance",
    technicianId: "tech-jordan-p",
    completedOn: "2026-05-20",
  },
  {
    id: "svc-birch-controller-check",
    propertyId: "birch-house",
    title: "Controller health check · automations verified",
    category: "network",
    technicianId: "tech-aaron-k",
    completedOn: "2026-05-14",
  },
  {
    id: "svc-birch-guest-codes",
    propertyId: "birch-house",
    title: "Guest access codes refreshed for spring",
    category: "security_access",
    technicianId: "tech-aaron-k",
    completedOn: "2026-05-06",
  },
  // Linden Commercial
  {
    id: "svc-linden-switch-reboot",
    propertyId: "linden-commercial",
    title: "Core switch firmware pre-check and reboot",
    category: "network",
    technicianId: "tech-maya-o",
    completedOn: "2026-05-31",
  },
  {
    id: "svc-linden-channel-plan",
    propertyId: "linden-commercial",
    title: "Wireless channel plan updated",
    category: "network",
    technicianId: "tech-maya-o",
    completedOn: "2026-05-30",
  },
  {
    id: "svc-linden-ev-report",
    propertyId: "linden-commercial",
    title: "EV load-balance report delivered",
    category: "energy",
    technicianId: "tech-maya-o",
    completedOn: "2026-05-30",
  },
  {
    id: "svc-linden-badge-schedule",
    propertyId: "linden-commercial",
    title: "Loading dock badge schedule verified",
    category: "security_access",
    technicianId: "tech-jordan-p",
    completedOn: "2026-05-18",
  },
];

// ---------------------------------------------------------------------------
// Accessors — the mock/real seam (§1.5). Components import these helpers.
// ---------------------------------------------------------------------------

/** Sort key: active and attention-needing first, resolved last. */
const STATUS_ORDER: Record<SupportStatus, number> = {
  new: 0,
  awaiting_you: 1,
  in_progress: 2,
  scheduled: 3,
  monitoring: 4,
  resolved: 5,
};

export function getSupportRequestsForProperty(
  propertyId: string,
): SupportRequest[] {
  return supportRequests
    .filter((request) => request.propertyId === propertyId)
    .sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        a.updatedAtMinutesAgo - b.updatedAtMinutesAgo,
    );
}

export function isActiveSupportStatus(status: SupportStatus): boolean {
  return status !== "resolved";
}

/** The top active request — used by the Overview tab's support preview. */
export function getPrimarySupportRequestForProperty(
  propertyId: string,
): SupportRequest | undefined {
  return getSupportRequestsForProperty(propertyId).find((request) =>
    isActiveSupportStatus(request.status),
  );
}

export function getServiceHistoryForProperty(
  propertyId: string,
): ServiceRecord[] {
  return serviceHistory
    .filter((record) => record.propertyId === propertyId)
    .sort((a, b) => b.completedOn.localeCompare(a.completedOn));
}

export interface SupportSummary {
  open: number;
  awaitingYou: number;
  scheduledVisits: number;
  resolvedThisMonth: number;
}

/**
 * Summary counts for the Support tab header. "Resolved this month" counts the
 * service-history entries within the same calendar month as `now`, so the
 * number stays honest as the demo's reference date moves.
 */
export function summarizeSupport(
  requests: SupportRequest[],
  history: ServiceRecord[],
  now: Date,
): SupportSummary {
  const month = now.getUTCFullYear() * 12 + now.getUTCMonth();
  const sameMonth = (iso: string) => {
    const date = new Date(`${iso}T00:00:00Z`);
    return date.getUTCFullYear() * 12 + date.getUTCMonth() === month;
  };

  return {
    open: requests.filter((r) => isActiveSupportStatus(r.status)).length,
    awaitingYou: requests.filter((r) => r.status === "awaiting_you").length,
    scheduledVisits: requests.filter((r) => Boolean(r.scheduledVisitId)).length,
    resolvedThisMonth: history.filter((r) => sameMonth(r.completedOn)).length,
  };
}
