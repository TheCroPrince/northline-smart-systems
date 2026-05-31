/**
 * Support conversation primitives. Source of truth: MOCK_DATA_SCHEMA §7.
 *
 * This module owns the *people* (technicians) and the *message* shape. The
 * richer support-request model that strings these into conversations lives in
 * `lib/mock/support.ts`, which imports from here — so there is one definition
 * of a technician and one definition of a message across the portal.
 */

export interface Technician {
  id: string;
  firstName: string;
  lastInitial: string;
  role: "Project lead" | "Field tech" | "Operations";
  avatarColor: string;
}

export interface Message {
  id: string;
  /** FK -> support.ts SupportRequest.id (the conversation it belongs to). */
  threadId: string;
  /** Technician id, or the literal "client". */
  authorId: string;
  body: string;
  /** Resolved at render for recent messages (<48h). */
  sentAtMinutesAgo?: number;
  /** Absolute ISO for older messages. Exactly one of the two is set. */
  sentAt?: string;
}

export const technicians: Technician[] = [
  {
    id: "tech-aaron-k",
    firstName: "Aaron",
    lastInitial: "K",
    role: "Project lead",
    avatarColor: "#1F2530",
  },
  {
    id: "tech-maya-o",
    firstName: "Maya",
    lastInitial: "O",
    role: "Operations",
    avatarColor: "#243128",
  },
  {
    id: "tech-jordan-p",
    firstName: "Jordan",
    lastInitial: "P",
    role: "Field tech",
    avatarColor: "#2A2418",
  },
];

export function getTechnicianById(id: string): Technician | undefined {
  return technicians.find((technician) => technician.id === id);
}
