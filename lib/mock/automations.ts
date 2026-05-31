/**
 * Scheduled automations for the Overview tab.
 *
 * This keeps the PRD overview surface populated without coupling it to future
 * device-tab implementation details.
 */

export type AutomationStatus = "scheduled" | "active" | "paused";

export interface AutomationRule {
  id: string;
  propertyId: string;
  name: string;
  cadence: string;
  nextRun: string;
  status: AutomationStatus;
  scope: string;
}

export const automationRules: AutomationRule[] = [
  {
    id: "auto-birch-evening-perimeter",
    propertyId: "birch-house",
    name: "Evening perimeter",
    cadence: "Daily",
    nextRun: "2026-05-31T21:30:00-04:00",
    status: "scheduled",
    scope: "Arms exterior motion after family mode ends.",
  },
  {
    id: "auto-birch-ev-load",
    propertyId: "birch-house",
    name: "EV load balance",
    cadence: "Weeknights",
    nextRun: "2026-05-31T23:15:00-04:00",
    status: "scheduled",
    scope: "Staggers both chargers below panel threshold.",
  },
  {
    id: "auto-linden-lobby-unlock",
    propertyId: "linden-commercial",
    name: "Lobby unlock",
    cadence: "Weekdays",
    nextRun: "2026-06-01T06:45:00-07:00",
    status: "scheduled",
    scope: "Unlocks tenant lobby after overnight guard handoff.",
  },
  {
    id: "auto-linden-ev-throttle",
    propertyId: "linden-commercial",
    name: "EV peak throttle",
    cadence: "Business days",
    nextRun: "2026-06-01T14:00:00-07:00",
    status: "active",
    scope: "Holds charger demand under building load limit.",
  },
];

export function getAutomationRulesForProperty(propertyId: string): AutomationRule[] {
  return automationRules.filter((rule) => rule.propertyId === propertyId);
}

