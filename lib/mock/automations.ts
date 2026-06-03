/**
 * Scheduled automations for the Overview tab.
 *
 * This keeps the PRD overview surface populated without coupling it to future
 * device-tab implementation details.
 */

import { upcomingDateTime } from "@/lib/time";

export type AutomationStatus = "scheduled" | "active" | "paused";

export interface AutomationRule {
  id: string;
  propertyId: string;
  name: string;
  cadence: string;
  nextRun: string;
  status: AutomationStatus;
  scope: string;
  /** Next-run schedule, resolved relative to "now" so it always reads current. */
  daysAhead?: number;
  hour?: number;
  minute?: number;
}

export const automationRules: AutomationRule[] = [
  {
    id: "auto-birch-evening-perimeter",
    propertyId: "birch-house",
    name: "Evening perimeter",
    cadence: "Daily",
    nextRun: "2026-05-31T21:30:00",
    status: "scheduled",
    scope: "Arms exterior motion after family mode ends.",
    daysAhead: 0,
    hour: 21,
    minute: 30,
  },
  {
    id: "auto-birch-ev-load",
    propertyId: "birch-house",
    name: "EV load balance",
    cadence: "Weeknights",
    nextRun: "2026-05-31T23:15:00",
    status: "scheduled",
    scope: "Staggers both chargers below panel threshold.",
    daysAhead: 0,
    hour: 23,
    minute: 15,
  },
  {
    id: "auto-linden-lobby-unlock",
    propertyId: "linden-commercial",
    name: "Lobby unlock",
    cadence: "Weekdays",
    nextRun: "2026-06-01T06:45:00",
    status: "scheduled",
    scope: "Unlocks tenant lobby after overnight guard handoff.",
    daysAhead: 1,
    hour: 6,
    minute: 45,
  },
  {
    id: "auto-linden-ev-throttle",
    propertyId: "linden-commercial",
    name: "EV peak throttle",
    cadence: "Business days",
    nextRun: "2026-06-01T14:00:00",
    status: "active",
    scope: "Holds charger demand under building load limit.",
    daysAhead: 0,
    hour: 14,
    minute: 0,
  },
];

function resolveAutomation(rule: AutomationRule, now?: Date): AutomationRule {
  if (now === undefined || rule.daysAhead === undefined) return rule;
  return {
    ...rule,
    nextRun: upcomingDateTime(now, rule.daysAhead, rule.hour ?? 0, rule.minute ?? 0),
  };
}

export function getAutomationRulesForProperty(
  propertyId: string,
  now?: Date,
): AutomationRule[] {
  return automationRules
    .filter((rule) => rule.propertyId === propertyId)
    .map((rule) => resolveAutomation(rule, now));
}

