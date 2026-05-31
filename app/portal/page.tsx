import type { Metadata } from "next";
import { OverviewTab } from "@/components/portal/OverviewTab";
import { PortalShell } from "@/components/portal/PortalShell";
import { getAutomationRulesForProperty } from "@/lib/mock/automations";
import { getRecentEventsForProperty } from "@/lib/mock/events";
import { getMetricsForProperty } from "@/lib/mock/metrics";
import {
  getPrimaryThreadForProperty,
  getTechnicianById,
} from "@/lib/mock/messages";
import {
  getDefaultProperty,
  getPropertyById,
  properties,
} from "@/lib/mock/properties";
import { portalConfig } from "@/lib/mock/portal";
import { getNextVisitForProperty } from "@/lib/mock/visits";

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
  const metrics = getMetricsForProperty(currentProperty.id);
  const events = getRecentEventsForProperty(currentProperty.id, 12);
  const visit = getNextVisitForProperty(currentProperty.id);
  const thread = getPrimaryThreadForProperty(currentProperty.id);
  const technician = getTechnicianById(currentProperty.assignedTechnicianId);
  const automations = getAutomationRulesForProperty(currentProperty.id);

  return (
    <PortalShell
      properties={accessibleProperties}
      currentProperty={currentProperty}
    >
      <OverviewTab
        property={currentProperty}
        metrics={metrics}
        events={events}
        visit={visit}
        thread={thread}
        technician={technician}
        automations={automations}
        now={new Date()}
      />
    </PortalShell>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

