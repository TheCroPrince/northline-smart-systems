/**
 * Portal configuration. Source of truth: MOCK_DATA_SCHEMA section 10.
 *
 * Static shell state for the read-only client portal preview.
 */

export type PortalTab = "overview" | "projects" | "devices" | "support";

export interface PortalUser {
  id: string;
  firstName: string;
  lastInitial: string;
  emailMasked: string;
  defaultPropertyId: string;
  accessiblePropertyIds: string[];
  initials: string;
  avatarColor: string;
}

export interface PortalTabDef {
  id: PortalTab;
  label: string;
  order: number;
}

export interface PortalConfig {
  user: PortalUser;
  tabs: PortalTabDef[];
  brandLabel: string;
}

export const portalConfig: PortalConfig = {
  brandLabel: "Northline · Client portal",
  user: {
    id: "user-m-roth",
    firstName: "Michael",
    lastInitial: "R",
    emailMasked: "m***@***.com",
    defaultPropertyId: "birch-house",
    accessiblePropertyIds: ["birch-house", "linden-commercial"],
    initials: "MR",
    avatarColor: "#171B25",
  },
  tabs: [
    { id: "overview", label: "Overview", order: 1 },
    { id: "projects", label: "Projects", order: 2 },
    { id: "devices", label: "Devices", order: 3 },
    { id: "support", label: "Support", order: 4 },
  ],
};

