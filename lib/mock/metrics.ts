/**
 * Property metrics. Source of truth: MOCK_DATA_SCHEMA section 9.
 *
 * Exactly four KPI cards per property power the Overview tab.
 */

export type Trend = "up" | "down" | "flat";
export type KpiStatus = "healthy" | "degraded" | "offline";

export interface KpiCard {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
  trend?: Trend;
  status?: KpiStatus;
}

export interface PropertyMetrics {
  propertyId: string;
  cards: KpiCard[];
  uptimeSparkline: number[];
  eventsThisWeek: number;
}

export const propertyMetrics: PropertyMetrics[] = [
  {
    propertyId: "birch-house",
    eventsThisWeek: 41,
    uptimeSparkline: [
      99, 98, 100, 99, 97, 100, 99, 98, 99, 100, 99, 99, 96, 99, 100,
      99, 98, 100, 99, 99, 100, 98, 99, 99, 100, 99, 98, 100, 99, 99,
    ],
    cards: [
      {
        id: "kpi-health",
        label: "System health",
        value: "97%",
        sublabel: "38 of 38 devices reporting",
        trend: "flat",
        status: "healthy",
      },
      {
        id: "kpi-active",
        label: "Active devices",
        value: "38",
        sublabel: "1 awaiting commissioning",
        status: "healthy",
      },
      {
        id: "kpi-events",
        label: "Events this week",
        value: "41",
        sublabel: "-6 vs last week",
        trend: "down",
      },
      {
        id: "kpi-next-visit",
        label: "Next visit",
        value: "Jun 2",
        sublabel: "Side yard camera replacement",
      },
    ],
  },
  {
    propertyId: "linden-commercial",
    eventsThisWeek: 76,
    uptimeSparkline: [
      100, 99, 99, 98, 100, 99, 99, 100, 98, 99, 97, 99, 100, 99, 98,
      99, 99, 100, 100, 99, 98, 99, 100, 99, 99, 96, 99, 100, 99, 99,
    ],
    cards: [
      {
        id: "kpi-health",
        label: "System health",
        value: "98%",
        sublabel: "96 of 96 devices reporting",
        trend: "up",
        status: "healthy",
      },
      {
        id: "kpi-active",
        label: "Active devices",
        value: "96",
        sublabel: "2 updates staged overnight",
        status: "healthy",
      },
      {
        id: "kpi-events",
        label: "Events this week",
        value: "76",
        sublabel: "+9 vs last week",
        trend: "up",
      },
      {
        id: "kpi-next-visit",
        label: "Next visit",
        value: "Jun 3",
        sublabel: "Access reader audit",
      },
    ],
  },
];

export function getMetricsForProperty(propertyId: string): PropertyMetrics {
  const metrics = propertyMetrics.find((item) => item.propertyId === propertyId);
  if (!metrics) {
    throw new Error(`No metrics found for property "${propertyId}".`);
  }
  return metrics;
}

