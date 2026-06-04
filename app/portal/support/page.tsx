import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";
import { SupportTab } from "@/components/portal/SupportTab";
import { portalConfig } from "@/lib/mock/portal";
import {
  getDefaultProperty,
  getPropertyById,
  properties,
} from "@/lib/mock/properties";
import {
  getServiceHistoryForProperty,
  getSupportRequestsForProperty,
  summarizeSupport,
} from "@/lib/mock/support";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support Requests",
  description:
    "Review support requests, service history, scheduled visits, and technician updates in the Northline client portal.",
  alternates: { canonical: "/portal/support" },
};

type SearchParams = Promise<{
  p?: string | string[];
}>;

interface SupportPageProps {
  searchParams?: SearchParams;
}

export default async function SupportPage({ searchParams }: SupportPageProps) {
  const params = await searchParams;
  const requestedPropertyId = firstParam(params?.p);
  const currentProperty =
    (requestedPropertyId ? getPropertyById(requestedPropertyId) : undefined) ??
    getDefaultProperty();
  const accessibleProperties = properties.filter((property) =>
    portalConfig.user.accessiblePropertyIds.includes(property.id),
  );

  const requests = getSupportRequestsForProperty(currentProperty.id);
  const serviceHistory = getServiceHistoryForProperty(currentProperty.id);
  const now = new Date();
  const summary = summarizeSupport(requests, serviceHistory, now);

  return (
    <PortalShell
      properties={accessibleProperties}
      currentProperty={currentProperty}
      activeTab="support"
    >
      <SupportTab
        property={currentProperty}
        requests={requests}
        serviceHistory={serviceHistory}
        summary={summary}
        now={now}
      />
    </PortalShell>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
