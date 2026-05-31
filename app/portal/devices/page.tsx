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
import {
  getDefaultProperty,
  getPropertyById,
  properties,
} from "@/lib/mock/properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Devices · Client portal",
  description: "Systems Northline installs and monitors at the property.",
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
        now={new Date()}
      />
    </PortalShell>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
