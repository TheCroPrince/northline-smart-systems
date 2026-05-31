/**
 * Event records. Source of truth: MOCK_DATA_SCHEMA section 3.
 *
 * The Overview feed renders a discriminated union, so each row can stay honest
 * to the type of event it represents.
 */

export type EventSeverity = "info" | "notice" | "warning";
export type EventOutcome = "logged" | "notified" | "dispatched" | "acknowledged";

interface EventBase {
  id: string;
  propertyId: string;
  secondsAgo: number;
  severity: EventSeverity;
  deviceId?: string;
}

export interface ClassificationEvent extends EventBase {
  type: "classification";
  zone: string;
  classification: string;
  confidence: number;
  outcome: EventOutcome;
  reasoning?: string;
}

export interface AccessEvent extends EventBase {
  type: "access";
  deviceName: string;
  result: "granted" | "denied";
  identity?: string;
}

export interface SystemEvent extends EventBase {
  type: "system";
  action: string;
  detail?: string;
}

export interface MaintenanceEvent extends EventBase {
  type: "maintenance";
  description: string;
  scheduledFor?: string;
}

export type FeedEvent =
  | ClassificationEvent
  | AccessEvent
  | SystemEvent
  | MaintenanceEvent;

export const events: FeedEvent[] = [
  {
    id: "evt-2026-05-31-0014",
    propertyId: "birch-house",
    type: "classification",
    severity: "info",
    secondsAgo: 420,
    deviceId: "front-porch-camera",
    zone: "front porch",
    classification: "Delivery driver",
    confidence: 94,
    outcome: "logged",
    reasoning: "Matches scheduled courier window 1-3pm.",
  },
  {
    id: "evt-2026-05-31-0013",
    propertyId: "birch-house",
    type: "access",
    severity: "info",
    secondsAgo: 1140,
    deviceName: "Garage · Reader",
    result: "granted",
    identity: "M. Roth",
  },
  {
    id: "evt-2026-05-31-0012",
    propertyId: "birch-house",
    type: "system",
    severity: "notice",
    secondsAgo: 2860,
    deviceId: "northline-controller",
    action: "controller health check completed",
    detail: "Automation schedules verified.",
  },
  {
    id: "evt-2026-05-31-0011",
    propertyId: "birch-house",
    type: "classification",
    severity: "notice",
    secondsAgo: 6150,
    deviceId: "side-yard-camera-north",
    zone: "side yard",
    classification: "Service · landscaping",
    confidence: 91,
    outcome: "acknowledged",
    reasoning: "On the recurring Friday service schedule.",
  },
  {
    id: "evt-2026-05-30-0041",
    propertyId: "birch-house",
    type: "system",
    severity: "info",
    secondsAgo: 18_100,
    deviceId: "network-closet-switch",
    action: "firmware applied · 6 access points",
    detail: "Roaming tables rebuilt without client downtime.",
  },
  {
    id: "evt-2026-05-30-0038",
    propertyId: "birch-house",
    type: "classification",
    severity: "warning",
    secondsAgo: 27_200,
    deviceId: "back-door-camera",
    zone: "back door",
    classification: "Unknown person",
    confidence: 84,
    outcome: "notified",
    reasoning: "No scheduled access. After-hours.",
  },
  {
    id: "evt-2026-05-30-0025",
    propertyId: "birch-house",
    type: "access",
    severity: "notice",
    secondsAgo: 35_700,
    deviceName: "Side gate · Reader",
    result: "denied",
    identity: "Expired guest code",
  },
  {
    id: "evt-2026-05-30-0019",
    propertyId: "birch-house",
    type: "maintenance",
    severity: "notice",
    secondsAgo: 45_200,
    description: "Side yard camera replacement scheduled",
    scheduledFor: "2026-06-02T09:00:00-04:00",
  },
  {
    id: "evt-2026-05-29-0032",
    propertyId: "birch-house",
    type: "classification",
    severity: "info",
    secondsAgo: 93_600,
    deviceId: "driveway-camera",
    zone: "driveway",
    classification: "Resident · vehicle",
    confidence: 99,
    outcome: "logged",
  },
  {
    id: "evt-2026-05-29-0024",
    propertyId: "birch-house",
    type: "system",
    severity: "notice",
    secondsAgo: 108_600,
    deviceId: "living-thermostat",
    action: "remote sensor battery low",
    detail: "Replacement paired with Tuesday visit.",
  },
  {
    id: "evt-2026-05-28-0051",
    propertyId: "birch-house",
    type: "classification",
    severity: "info",
    secondsAgo: 176_400,
    deviceId: "side-yard-camera-north",
    zone: "side yard",
    classification: "Animal (small)",
    confidence: 88,
    outcome: "logged",
  },
  {
    id: "evt-2026-05-28-0027",
    propertyId: "birch-house",
    type: "access",
    severity: "info",
    secondsAgo: 194_400,
    deviceName: "Front gate · Reader",
    result: "granted",
    identity: "Service · Northline",
  },
  {
    id: "evt-2026-05-31-1018",
    propertyId: "linden-commercial",
    type: "access",
    severity: "info",
    secondsAgo: 260,
    deviceName: "Main lobby · Reader",
    result: "granted",
    identity: "Facilities",
  },
  {
    id: "evt-2026-05-31-1017",
    propertyId: "linden-commercial",
    type: "classification",
    severity: "info",
    secondsAgo: 860,
    deviceId: "loading-dock-camera-east",
    zone: "loading dock",
    classification: "Delivery driver",
    confidence: 96,
    outcome: "acknowledged",
    reasoning: "Matches carrier slot on the tenant schedule.",
  },
  {
    id: "evt-2026-05-31-1016",
    propertyId: "linden-commercial",
    type: "system",
    severity: "notice",
    secondsAgo: 1880,
    deviceId: "core-switch-48p",
    action: "switch reboot completed",
    detail: "Firmware pre-check, 3 minute downtime.",
  },
  {
    id: "evt-2026-05-31-1015",
    propertyId: "linden-commercial",
    type: "classification",
    severity: "warning",
    secondsAgo: 5140,
    deviceId: "rear-staff-camera",
    zone: "rear staff entrance",
    classification: "Unknown person",
    confidence: 87,
    outcome: "notified",
    reasoning: "No badge event paired with the motion.",
  },
  {
    id: "evt-2026-05-31-1014",
    propertyId: "linden-commercial",
    type: "access",
    severity: "notice",
    secondsAgo: 6900,
    deviceName: "Storage corridor · Reader",
    result: "denied",
    identity: "Former contractor",
  },
  {
    id: "evt-2026-05-30-1082",
    propertyId: "linden-commercial",
    type: "maintenance",
    severity: "notice",
    secondsAgo: 21_600,
    description: "Access reader audit scheduled",
    scheduledFor: "2026-06-03T07:30:00-07:00",
  },
  {
    id: "evt-2026-05-30-1078",
    propertyId: "linden-commercial",
    type: "system",
    severity: "info",
    secondsAgo: 28_900,
    deviceId: "roof-ap-west",
    action: "wireless channel plan updated",
    detail: "Conference wing moved away from tenant interference.",
  },
  {
    id: "evt-2026-05-30-1069",
    propertyId: "linden-commercial",
    type: "classification",
    severity: "info",
    secondsAgo: 37_700,
    deviceId: "parking-camera-north",
    zone: "driveway",
    classification: "Resident · vehicle",
    confidence: 99,
    outcome: "logged",
  },
  {
    id: "evt-2026-05-30-1051",
    propertyId: "linden-commercial",
    type: "access",
    severity: "info",
    secondsAgo: 46_800,
    deviceName: "North stair · Reader",
    result: "granted",
    identity: "Tenant admin",
  },
  {
    id: "evt-2026-05-29-1034",
    propertyId: "linden-commercial",
    type: "classification",
    severity: "notice",
    secondsAgo: 103_200,
    deviceId: "loading-dock-camera-east",
    zone: "loading dock",
    classification: "Service · Northline",
    confidence: 94,
    outcome: "acknowledged",
    reasoning: "Maintenance window active.",
  },
  {
    id: "evt-2026-05-29-1026",
    propertyId: "linden-commercial",
    type: "system",
    severity: "notice",
    secondsAgo: 121_400,
    deviceId: "ev-panel-controller",
    action: "EV load balance adjusted",
    detail: "Peak draw held under the building threshold.",
  },
  {
    id: "evt-2026-05-28-1099",
    propertyId: "linden-commercial",
    type: "classification",
    severity: "info",
    secondsAgo: 174_200,
    deviceId: "front-lobby-camera",
    zone: "main lobby",
    classification: "Service · cleaning",
    confidence: 92,
    outcome: "logged",
  },
];

export function getEventsForProperty(propertyId: string): FeedEvent[] {
  return events
    .filter((event) => event.propertyId === propertyId)
    .sort((a, b) => a.secondsAgo - b.secondsAgo);
}

export function getRecentEventsForProperty(
  propertyId: string,
  limit = 12,
): FeedEvent[] {
  return getEventsForProperty(propertyId).slice(0, limit);
}

export function getUpcomingMaintenanceForProperty(
  propertyId: string,
): MaintenanceEvent | undefined {
  return getEventsForProperty(propertyId).find(
    (event): event is MaintenanceEvent =>
      event.type === "maintenance" && event.scheduledFor !== undefined,
  );
}

