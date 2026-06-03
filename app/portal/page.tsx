import type { Metadata } from "next";
import { OverviewTab } from "@/components/portal/OverviewTab";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAutomationRulesForProperty } from "@/lib/mock/automations";
import { getRecentEventsForProperty } from "@/lib/mock/events";
import { getMetricsForProperty } from "@/lib/mock/metrics";
import { getTechnicianById } from "@/lib/mock/messages";
import {
  getDefaultProperty,
  getPropertyById,
  properties,
} from "@/lib/mock/properties";
import { portalConfig } from "@/lib/mock/portal";
import { getPrimarySupportRequestForProperty } from "@/lib/mock/support";
import { getNextVisitForProperty } from "@/lib/mock/visits";
import { formatDate } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client portal preview",
  description: "Northline client portal overview preview.",
};

type SearchParams = Promise<{
  p?: string | string[];
}>;

interface PortalHomeProps {
  searchParams?: SearchParams;
}

export default async function PortalHome({ searchParams }: PortalHomeProps) {
  const params = await searchParams;
  const requestedPropertyId = firstParam(params?.p);
  const currentProperty =
    (requestedPropertyId ? getPropertyById(requestedPropertyId) : undefined) ??
    getDefaultProperty();
  const accessibleProperties = properties.filter((property) =>
    portalConfig.user.accessiblePropertyIds.includes(property.id),
  );
  const now = new Date();
  const visit = getNextVisitForProperty(currentProperty.id, now);

  // Keep the "Next visit" KPI in sync with the (now-relative) scheduled visit,
  // so the headline date never drifts into the past.
  const baseMetrics = getMetricsForProperty(currentProperty.id);
  const metrics = visit
    ? {
        ...baseMetrics,
        cards: baseMetrics.cards.map((card) =>
          card.id === "kpi-next-visit"
            ? { ...card, value: formatDate(visit.scheduledFor, "short"), sublabel: visit.title }
            : card,
        ),
      }
    : baseMetrics;

  // The "scheduled maintenance" event mirrors the same visit — align its date too.
  const events = getRecentEventsForProperty(currentProperty.id, 12).map((event) =>
    visit && event.type === "maintenance" && event.scheduledFor
      ? { ...event, scheduledFor: visit.scheduledFor }
      : event,
  );

  const supportRequest = getPrimarySupportRequestForProperty(currentProperty.id);
  const technician = getTechnicianById(currentProperty.assignedTechnicianId);
  const automations = getAutomationRulesForProperty(currentProperty.id, now);

  return (
    <PortalShell
      properties={accessibleProperties}
      currentProperty={currentProperty}
      activeTab="overview"
    >
      <OverviewTab
        property={currentProperty}
        metrics={metrics}
        events={events}
        visit={visit}
        supportRequest={supportRequest}
        technician={technician}
        automations={automations}
        now={now}
      />
    </PortalShell>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

