/**
 * Property records. Source of truth: MOCK_DATA_SCHEMA §6.
 *
 * Two properties power the portal switcher and every downstream data fetch.
 * All property-scoped data (devices, events, projects, messages, metrics)
 * keys off `propertyId`.
 */

export type PropertyKind = "residential" | "commercial";

export interface PropertySystemsSummary {
  cameras: number;
  /** Wi-Fi / network APs (distinct from card readers). */
  accessPoints: number;
  /** Physical access readers (gates, doors). */
  accessReaders: number;
  sensors: number;
  automationZones: number;
  evChargers: number;
}

export interface Property {
  id: string;
  name: string;
  kind: PropertyKind;
  city: string;
  region: string;
  squareFootage: number;
  /** ISO date the system was first commissioned. */
  commissionedOn: string;
  /** ISO date of the most recent quarterly review. */
  lastReviewedOn: string;
  /** FK -> messages.ts Technician.id */
  assignedTechnicianId: string;
  systems: PropertySystemsSummary;
}

export const properties: Property[] = [
  {
    id: "birch-house",
    name: "Birch House",
    kind: "residential",
    city: "Toronto",
    region: "Ontario, Canada",
    squareFootage: 11_000,
    commissionedOn: "2024-08-14",
    lastReviewedOn: "2026-05-04",
    assignedTechnicianId: "tech-aaron-k",
    systems: {
      cameras: 8,
      accessPoints: 6,
      accessReaders: 3,
      sensors: 38,
      automationZones: 6,
      evChargers: 2,
    },
  },
  {
    id: "linden-commercial",
    name: "Linden Commercial",
    kind: "commercial",
    city: "Seattle",
    region: "Washington, USA",
    squareFootage: 28_000,
    commissionedOn: "2023-11-02",
    lastReviewedOn: "2026-05-12",
    assignedTechnicianId: "tech-maya-o",
    systems: {
      cameras: 64,
      accessPoints: 18,
      accessReaders: 38,
      sensors: 142,
      automationZones: 12,
      evChargers: 4,
    },
  },
];

/**
 * Return the property matching `id`, or `undefined` if no match.
 */
export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

/**
 * Default property for the portal on first load (Birch House).
 * Mirrors `PortalUser.defaultPropertyId` in MOCK_DATA_SCHEMA §10.
 */
export function getDefaultProperty(): Property {
  return properties[0];
}
