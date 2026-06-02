/**
 * Projects — the portal Projects tab. Source of truth: MOCK_DATA_SCHEMA §4
 * (portal-active + completed projects), shaped here for the client-facing
 * project experience: an active install with a milestone timeline, a progress
 * journal, and progress photography, plus a secondary list of completed work.
 *
 * Refinements over the §4 blueprint, made for this customer-facing surface:
 *  - Added `title`, `progressPercent`, `updates` (progress journal), and typed
 *    image objects (`heroImage`, `photoStrip`, `thumbnail`). These are portal
 *    presentation fields; the marketing-gallery fields from §4 can layer on
 *    later without conflict.
 *  - `ProjectImage.placeholderFor` documents, inline, which real photograph
 *    should eventually replace each reused stock image.
 *
 * Status + milestone vocabularies are the locked §1.3 / §4 unions, unchanged.
 * Dates are absolute ISO (§1.2 Regime B) — projects are historical/scheduled,
 * not "live", so nothing here resolves against `Date.now()`.
 */

export type ProjectStatus =
  | "in_progress"
  | "commissioning"
  | "on_hold"
  | "completed";

export type MilestoneStatus = "done" | "in_progress" | "pending" | "blocked";

export interface ProjectMilestone {
  id: string;
  label: string;
  status: MilestoneStatus;
  /** ISO date — set for completed milestones and the one in progress. */
  date?: string;
  note?: string;
}

export interface ProjectUpdate {
  id: string;
  /** ISO date of the update. */
  date: string;
  body: string;
  authorTechnicianId?: string;
}

export interface ProjectImage {
  /** Public path. Currently a reused on-brand placeholder. */
  src: string;
  alt: string;
  /** Documents the real photograph that should eventually replace `src`. */
  placeholderFor: string;
}

export interface Project {
  id: string;
  propertyId: string;
  title: string;
  status: ProjectStatus;
  /** One-line scope summary. */
  summary: string;
  /** 2–4 sentence detail, shown on active projects. */
  detail?: string;
  /** 0–100, active projects only. */
  progressPercent?: number;
  startedOn: string;
  /** Required while active. */
  expectedCompletion?: string;
  /** Required once completed. */
  completedOn?: string;
  leadTechnicianId: string;
  milestones?: ProjectMilestone[];
  updates?: ProjectUpdate[];
  heroImage?: ProjectImage;
  photoStrip?: ProjectImage[];
  /** Completed projects: short result statement + thumbnail. */
  outcome?: string;
  thumbnail?: ProjectImage;
}

export const projects: Project[] = [
  // ---------------------------------------------------------------------------
  // Birch House — active
  // ---------------------------------------------------------------------------
  {
    id: "proj-birch-garage-access",
    propertyId: "birch-house",
    title: "Garage access modernization",
    status: "in_progress",
    summary:
      "Replacing the garage access controller and reader, adding a smart lock and a dedicated camera.",
    detail:
      "The original garage controller is being replaced with a current-generation unit, paired with a new reader, a smart lock on the interior door, and a camera covering the bay. The work ties into the existing network and automations so entry stays logged and the EV charger keeps its overnight schedule. Commissioning is planned for mid-June with no impact to the rest of the property.",
    progressPercent: 62,
    startedOn: "2026-05-12",
    expectedCompletion: "2026-06-16",
    leadTechnicianId: "tech-aaron-k",
    milestones: [
      { id: "m1", label: "Site assessment", status: "done", date: "2026-05-12" },
      { id: "m2", label: "Design review", status: "done", date: "2026-05-19" },
      { id: "m3", label: "Equipment procurement", status: "done", date: "2026-05-27" },
      {
        id: "m4",
        label: "Installation",
        status: "in_progress",
        date: "2026-06-02",
        note: "Reader and camera mounted; smart lock fitting underway.",
      },
      { id: "m5", label: "Commissioning", status: "pending" },
      { id: "m6", label: "Final handover", status: "pending" },
    ],
    updates: [
      {
        id: "u1",
        date: "2026-05-31",
        body: "Garage camera mounted and aimed; field of view confirmed with the household.",
        authorTechnicianId: "tech-jordan-p",
      },
      {
        id: "u2",
        date: "2026-05-29",
        body: "New access reader wired and powered at the side door.",
        authorTechnicianId: "tech-jordan-p",
      },
      {
        id: "u3",
        date: "2026-05-27",
        body: "Equipment delivered to the site: controller, reader, smart lock, and camera.",
        authorTechnicianId: "tech-aaron-k",
      },
      {
        id: "u4",
        date: "2026-05-19",
        body: "Design review approved; device placements finalized with the client.",
        authorTechnicianId: "tech-aaron-k",
      },
      {
        id: "u5",
        date: "2026-05-12",
        body: "Site assessment completed; existing garage controller flagged for replacement.",
        authorTechnicianId: "tech-aaron-k",
      },
    ],
    heroImage: {
      src: "/Images/services/surveillance-security.jpg",
      alt: "Northline technician installing the exterior camera and access hardware",
      placeholderFor:
        "Wide photo of the modernized garage entry with the new controller and reader installed.",
    },
    photoStrip: [
      {
        src: "/Images/carousel/access-inside.jpg",
        alt: "Newly installed access reader",
        placeholderFor: "Close-up of the installed side-door access reader.",
      },
      {
        src: "/Images/services/commercial-networking.jpg",
        alt: "New access controller and switching wired in",
        placeholderFor: "The new garage access controller wired into the network.",
      },
      {
        src: "/Images/services/structured-cabling.jpg",
        alt: "Structured cabling run to the network closet",
        placeholderFor: "Cabling run from the controller to the network closet.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Birch House — completed
  // ---------------------------------------------------------------------------
  {
    id: "proj-birch-whole-home",
    propertyId: "birch-house",
    title: "Whole-home systems install",
    status: "completed",
    summary: "The original commissioning across the main house and laneway studio.",
    startedOn: "2024-06-03",
    completedOn: "2024-09-20",
    leadTechnicianId: "tech-aaron-k",
    outcome:
      "Security, climate, EV, and network commissioned across both buildings with fiber backhaul between them.",
    thumbnail: {
      src: "/Images/services/smart-home-integration.jpg",
      alt: "Smart-home control and integration",
      placeholderFor: "Hero photo from the Birch House handover walkthrough.",
    },
  },
  {
    id: "proj-birch-ev",
    propertyId: "birch-house",
    title: "Driveway and garage EV chargers",
    status: "completed",
    summary: "Two Level 2 chargers with panel load coordination.",
    startedOn: "2025-05-05",
    completedOn: "2025-06-12",
    leadTechnicianId: "tech-aaron-k",
    outcome:
      "Two Level 2 chargers installed with a load controller that staggers draw below the panel limit.",
    thumbnail: {
      src: "/Images/carousel/ev.jpg",
      alt: "EV charger",
      placeholderFor: "The installed driveway and garage chargers.",
    },
  },
  {
    id: "proj-birch-leak",
    propertyId: "birch-house",
    title: "Leak detection rollout",
    status: "completed",
    summary: "Leak and flood sensors tied to an automatic shutoff valve.",
    startedOn: "2025-10-28",
    completedOn: "2025-11-18",
    leadTechnicianId: "tech-aaron-k",
    outcome:
      "Sensors added in the kitchen, mechanical room, and utility, wired to auto-close the smart shutoff valve on a confirmed leak.",
    thumbnail: {
      src: "/Images/services/home-control-panel-repair.jpg",
      alt: "Mechanical-room controller and automatic shutoff valve",
      placeholderFor: "Mechanical-room sensors and the shutoff valve install.",
    },
  },
  {
    id: "proj-birch-wifi",
    propertyId: "birch-house",
    title: "Wi-Fi 6E network upgrade",
    status: "completed",
    summary: "Access points and switching refreshed for full-property coverage.",
    startedOn: "2026-02-03",
    completedOn: "2026-02-22",
    leadTechnicianId: "tech-aaron-k",
    outcome:
      "Coverage rebuilt for both buildings with isolated segments for cameras, control, and guests.",
    thumbnail: {
      src: "/Images/services/commercial-networking.jpg",
      alt: "Refreshed network equipment after the upgrade",
      placeholderFor: "The refreshed network closet after the upgrade.",
    },
  },

  // ---------------------------------------------------------------------------
  // Linden Commercial — active
  // ---------------------------------------------------------------------------
  {
    id: "proj-linden-dock-access",
    propertyId: "linden-commercial",
    title: "Loading dock access control upgrade",
    status: "in_progress",
    summary:
      "Upgrading readers, the dock door controller, and camera coverage across the loading dock and storage corridor.",
    detail:
      "The loading dock and storage corridor are moving to current-generation readers with auto-expiring credentials and tenant-hour schedules, alongside a new door controller and refreshed camera coverage. The design maps badge access to delivery windows so the dock stays secure outside of scheduled carrier slots. Work is staged around tenant hours to avoid disruption.",
    progressPercent: 38,
    startedOn: "2026-05-20",
    expectedCompletion: "2026-07-08",
    leadTechnicianId: "tech-maya-o",
    milestones: [
      { id: "m1", label: "Site assessment", status: "done", date: "2026-05-20" },
      { id: "m2", label: "Design review", status: "done", date: "2026-05-26" },
      {
        id: "m3",
        label: "Equipment procurement",
        status: "in_progress",
        date: "2026-05-30",
        note: "Long-lead reader controllers on order; cameras in stock.",
      },
      { id: "m4", label: "Installation", status: "pending" },
      { id: "m5", label: "Commissioning", status: "pending" },
      { id: "m6", label: "Final handover", status: "pending" },
    ],
    updates: [
      {
        id: "u1",
        date: "2026-05-30",
        body: "Procurement underway; long-lead reader controllers ordered.",
        authorTechnicianId: "tech-maya-o",
      },
      {
        id: "u2",
        date: "2026-05-26",
        body: "Design review approved; badge schedule mapped to tenant delivery hours.",
        authorTechnicianId: "tech-maya-o",
      },
      {
        id: "u3",
        date: "2026-05-20",
        body: "Site assessment completed across the dock and storage corridor.",
        authorTechnicianId: "tech-maya-o",
      },
    ],
    heroImage: {
      src: "/Images/services/remote-monitoring.jpg",
      alt: "Loading-dock camera coverage on the Northline monitoring wall",
      placeholderFor:
        "Wide photo of the loading dock with the new readers and cameras in place.",
    },
    photoStrip: [
      {
        src: "/Images/carousel/access-inside.jpg",
        alt: "Access reader staged for installation",
        placeholderFor: "Reader staged at the dock prior to mounting.",
      },
      {
        src: "/Images/carousel/network.jpg",
        alt: "Network cabinet",
        placeholderFor: "The dock network cabinet feeding the new controller.",
      },
      {
        src: "/Images/carousel/monitoring-inside.jpg",
        alt: "Camera coverage review",
        placeholderFor: "Camera coverage review for the dock approach.",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Linden Commercial — completed
  // ---------------------------------------------------------------------------
  {
    id: "proj-linden-commissioning",
    propertyId: "linden-commercial",
    title: "Building systems commissioning",
    status: "completed",
    summary: "The original building-wide commissioning ahead of tenant move-in.",
    startedOn: "2023-08-14",
    completedOn: "2023-12-18",
    leadTechnicianId: "tech-maya-o",
    outcome:
      "Cameras, access, network, and EV commissioned building-wide before the first tenants moved in.",
    thumbnail: {
      src: "/Images/services/surveillance-security.jpg",
      alt: "Building-wide cameras and access commissioned",
      placeholderFor: "Hero photo from the Linden Commercial commissioning.",
    },
  },
  {
    id: "proj-linden-ev",
    propertyId: "linden-commercial",
    title: "Parking EV charger deployment",
    status: "completed",
    summary: "Four Level 2 bays with building-aware load control.",
    startedOn: "2024-06-17",
    completedOn: "2024-08-05",
    leadTechnicianId: "tech-maya-o",
    outcome:
      "Four Level 2 bays installed with a controller holding total charger draw under the building limit.",
    thumbnail: {
      src: "/Images/carousel/ev.jpg",
      alt: "EV charging bay",
      placeholderFor: "The installed parking charger bays.",
    },
  },
  {
    id: "proj-linden-readers",
    propertyId: "linden-commercial",
    title: "Lobby and stair reader modernization",
    status: "completed",
    summary: "Access readers upgraded with auto-expiring credentials.",
    startedOn: "2025-04-21",
    completedOn: "2025-05-22",
    leadTechnicianId: "tech-maya-o",
    outcome:
      "Lobby and stair readers upgraded with auto-expiring credentials and tenant-hour schedules.",
    thumbnail: {
      src: "/Images/carousel/access-inside.jpg",
      alt: "Modernized lobby access reader",
      placeholderFor: "The modernized lobby reader.",
    },
  },
  {
    id: "proj-linden-network",
    propertyId: "linden-commercial",
    title: "Core network refresh",
    status: "completed",
    summary: "Core and distribution switching replaced with no tenant downtime.",
    startedOn: "2025-09-08",
    completedOn: "2025-10-12",
    leadTechnicianId: "tech-maya-o",
    outcome:
      "48-port core, distribution switching, and roof access points replaced over a maintenance window with no tenant downtime.",
    thumbnail: {
      src: "/Images/services/structured-cabling.jpg",
      alt: "Refreshed core switching and patch panel",
      placeholderFor: "The refreshed server-room core switching.",
    },
  },
];

// ---------------------------------------------------------------------------
// Accessors — the mock/real seam (§1.5).
// ---------------------------------------------------------------------------

export function getProjectsForProperty(propertyId: string): Project[] {
  return projects.filter((project) => project.propertyId === propertyId);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getActiveProjectsForProperty(propertyId: string): Project[] {
  return getProjectsForProperty(propertyId).filter(
    (project) => project.status !== "completed",
  );
}

export function getCompletedProjectsForProperty(propertyId: string): Project[] {
  return getProjectsForProperty(propertyId)
    .filter((project) => project.status === "completed")
    .sort((a, b) => (b.completedOn ?? "").localeCompare(a.completedOn ?? ""));
}
