import type { Metadata } from "next";
import { DevicesTab } from "@/components/portal/DevicesTab";
import { PortalShell } from "@/components/portal/PortalShell";
import {
  getDevicesForProperty,
  groupDevicesByArea,
  summarizeDeviceStatuses,
} from "@/lib/mock/devices";
import { getEventsForProperty } from "@/lib/mock/events";
import { portalConfig } from "@/lib/mock/portal";
import { getSupportRequestsForProperty } from "@/lib/mock/support";
import {
  getDefaultProperty,
  getPropertyById,
  properties,
} from "@/lib/mock/properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Managed Devices",
  description:
    "View managed smart-property systems, device status, last check-ins, firmware notes, and service visibility in the Northline client portal.",
  alternates: { canonical: "/portal/devices" },
};

type SearchParams = Promise<{
  p?: string | string[];
}>;

interface DevicesPageProps {
  searchParams?: SearchParams;
}

export default async function DevicesPage({ searchParams }: DevicesPageProps) {
  const params = await searchParams;
  const requestedPropertyId = firstParam(params?.p);
  const currentProperty =
    (requestedPropertyId ? getPropertyById(requestedPropertyId) : undefined) ??
    getDefaultProperty();
  const accessibleProperties = properties.filter((property) =>
    portalConfig.user.accessiblePropertyIds.includes(property.id),
  );

  const groups = groupDevicesByArea(currentProperty.id);
  const statusCounts = summarizeDeviceStatuses(
    getDevicesForProperty(currentProperty.id),
  );
  const events = getEventsForProperty(currentProperty.id);

  // Map each device to its active support request, so a device can link to it.
  const supportLinks: Record<string, string> = {};
  for (const request of getSupportRequestsForProperty(currentProperty.id)) {
    if (request.status !== "resolved" && request.deviceId) {
      supportLinks[request.deviceId] = `/portal/support?p=${currentProperty.id}#${request.id}`;
    }
  }

  return (
    <PortalShell
      properties={accessibleProperties}
      currentProperty={currentProperty}
      activeTab="devices"
    >
      <DevicesTab
        property={currentProperty}
        groups={groups}
        statusCounts={statusCounts}
        events={events}
        supportLinks={supportLinks}
        now={new Date()}
      />
    </PortalShell>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
