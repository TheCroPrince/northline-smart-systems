/**
 * Support messages. Source of truth: MOCK_DATA_SCHEMA section 7.
 */

export interface Technician {
  id: string;
  firstName: string;
  lastInitial: string;
  role: "Project lead" | "Field tech" | "Operations";
  avatarColor: string;
}

export type ThreadStatus = "open" | "awaiting_client" | "resolved";

export interface Message {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  sentAtMinutesAgo?: number;
  sentAt?: string;
}

export interface Thread {
  id: string;
  propertyId: string;
  subject: string;
  status: ThreadStatus;
  participantTechnicianId: string;
  lastActivityMinutesAgo: number;
  messages: Message[];
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
];

export const threads: Thread[] = [
  {
    id: "th-birch-side-yard-replacement",
    propertyId: "birch-house",
    subject: "Side yard camera replacement",
    status: "awaiting_client",
    participantTechnicianId: "tech-aaron-k",
    lastActivityMinutesAgo: 240,
    messages: [
      {
        id: "msg-2026-05-30-0014",
        threadId: "th-birch-side-yard-replacement",
        authorId: "tech-aaron-k",
        body:
          "Hi Michael. The intermittent uplink on the north side yard camera is the cable, not the unit. We have a replacement on the truck for Tuesday morning, 9 to 11 window. Aaron will text when he is parked.",
        sentAt: "2026-05-30T15:42:00-04:00",
      },
      {
        id: "msg-2026-05-30-0019",
        threadId: "th-birch-side-yard-replacement",
        authorId: "client",
        body: "Tuesday works. Side gate code is the same.",
        sentAt: "2026-05-30T16:08:00-04:00",
      },
      {
        id: "msg-2026-05-31-0003",
        threadId: "th-birch-side-yard-replacement",
        authorId: "tech-aaron-k",
        body:
          "Confirmed. A calendar hold is on the account with Aaron as the lead tech.",
        sentAtMinutesAgo: 240,
      },
    ],
  },
  {
    id: "th-birch-firmware-window",
    propertyId: "birch-house",
    subject: "Scheduled firmware push",
    status: "resolved",
    participantTechnicianId: "tech-aaron-k",
    lastActivityMinutesAgo: 1820,
    messages: [
      {
        id: "msg-2026-05-29-0008",
        threadId: "th-birch-firmware-window",
        authorId: "tech-aaron-k",
        body:
          "Hi Michael. The access points updated overnight and the roaming tables rebuilt cleanly. No action needed.",
        sentAt: "2026-05-29T07:24:00-04:00",
      },
    ],
  },
  {
    id: "th-linden-reader-audit",
    propertyId: "linden-commercial",
    subject: "Access reader audit",
    status: "open",
    participantTechnicianId: "tech-maya-o",
    lastActivityMinutesAgo: 95,
    messages: [
      {
        id: "msg-2026-05-31-0102",
        threadId: "th-linden-reader-audit",
        authorId: "tech-maya-o",
        body:
          "Hi Priya. Maya will start at the loading dock and move through the north stair readers before tenant arrival. The work stays inside the 7:30 to 9:30 window.",
        sentAtMinutesAgo: 95,
      },
      {
        id: "msg-2026-05-31-0105",
        threadId: "th-linden-reader-audit",
        authorId: "client",
        body: "Good. Security has the visitor badge ready.",
        sentAtMinutesAgo: 52,
      },
    ],
  },
  {
    id: "th-linden-ev-load",
    propertyId: "linden-commercial",
    subject: "EV load balance report",
    status: "resolved",
    participantTechnicianId: "tech-maya-o",
    lastActivityMinutesAgo: 1280,
    messages: [
      {
        id: "msg-2026-05-30-0110",
        threadId: "th-linden-ev-load",
        authorId: "tech-maya-o",
        body:
          "Hi Priya. The EV controller held peak draw below the building threshold during the afternoon session. Report attached in the project record.",
        sentAt: "2026-05-30T18:12:00-07:00",
      },
    ],
  },
];

export function getTechnicianById(id: string): Technician | undefined {
  return technicians.find((technician) => technician.id === id);
}

export function getThreadsForProperty(propertyId: string): Thread[] {
  return threads
    .filter((thread) => thread.propertyId === propertyId)
    .sort((a, b) => a.lastActivityMinutesAgo - b.lastActivityMinutesAgo);
}

export function getPrimaryThreadForProperty(propertyId: string): Thread | undefined {
  return getThreadsForProperty(propertyId)[0];
}

