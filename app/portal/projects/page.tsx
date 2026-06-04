import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";
import { ProjectsTab } from "@/components/portal/ProjectsTab";
import { portalConfig } from "@/lib/mock/portal";
import {
  getActiveProjectsForProperty,
  getCompletedProjectsForProperty,
} from "@/lib/mock/projects";
import {
  getDefaultProperty,
  getPropertyById,
  properties,
} from "@/lib/mock/properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Visibility",
  description:
    "Track active installations, milestones, project updates, and completed smart-property upgrades inside the Northline client portal.",
  alternates: { canonical: "/portal/projects" },
};

type SearchParams = Promise<{
  p?: string | string[];
}>;

interface ProjectsPageProps {
  searchParams?: SearchParams;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const requestedPropertyId = firstParam(params?.p);
  const currentProperty =
    (requestedPropertyId ? getPropertyById(requestedPropertyId) : undefined) ??
    getDefaultProperty();
  const accessibleProperties = properties.filter((property) =>
    portalConfig.user.accessiblePropertyIds.includes(property.id),
  );

  const active = getActiveProjectsForProperty(currentProperty.id);
  const completed = getCompletedProjectsForProperty(currentProperty.id);

  return (
    <PortalShell
      properties={accessibleProperties}
      currentProperty={currentProperty}
      activeTab="projects"
    >
      <ProjectsTab
        property={currentProperty}
        active={active}
        completed={completed}
      />
    </PortalShell>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
