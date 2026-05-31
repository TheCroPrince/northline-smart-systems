/**
 * Device inventory. Source of truth: MOCK_DATA_SCHEMA §2.
 *
 * Drives the portal Devices tab (grouped by physical area) and underpins the
 * Overview "System health" framing. Property-scoped like every other module.
 *
 * Two intentional refinements over the §2 blueprint, made for the Devices tab:
 *  - `area` is a property-specific physical-area label (e.g., "Network closet",
 *    "Loading dock") rather than the four generic buckets. Birch House and
 *    Linden Commercial therefore have genuinely different floor plans, per the
 *    §1.7 "variety over symmetry" rule.
 *  - `category` is the owner-facing system group (Security & access,
 *    Surveillance, Environmental, Energy & utilities, Network & infrastructure)
 *    so a non-technical owner can scan it. `kind` carries the granular type and
 *    only drives icon choice.
 *
 * Status + firmware vocabularies are the locked §1.3 unions, unchanged, so the
 * StatusPill and the rest of the portal keep speaking one language.
 *
 * Device IDs deliberately match the `deviceId`s used in `events.ts`, so a
 * device's detail panel can surface its real recent activity.
 */

export type DeviceStatus =
  | "healthy"
  | "degraded"
  | "offline"
  | "updating"
  | "pending";

export type FirmwareStatus = "current" | "update_available" | "updating";

export type DeviceCategory =
  | "security_access"
  | "surveillance"
  | "environmental"
  | "energy"
  | "network";

export type DeviceKind =
  | "door_controller"
  | "access_controller"
  | "smart_lock"
  | "intercom"
  | "access_reader"
  | "camera"
  | "leak_sensor"
  | "flood_sensor"
  | "temp_sensor"
  | "humidity_sensor"
  | "ev_charger"
  | "thermostat"
  | "electrical_monitor"
  | "shutoff_valve"
  | "gateway"
  | "edge_controller"
  | "network_switch"
  | "cellular_modem"
  | "access_point"
  | "ups";

export interface Device {
  id: string;
  propertyId: string;
  name: string;
  category: DeviceCategory;
  kind: DeviceKind;
  /** Physical area within the property. Free-form, property-specific. */
  area: string;
  status: DeviceStatus;
  /** Firmware version string, e.g. "v2.14.1". */
  firmware: string;
  firmwareStatus: FirmwareStatus;
  /** Resolved against `now` at render — never ticks (see §1.2). */
  lastSeenSecondsAgo: number;
  /** ISO date the device was installed/commissioned. */
  installedOn: string;
  /** Network devices only. */
  ipAddress?: string;
  /** Technician/service note, shown in the detail panel. ~25% of devices. */
  notes?: string;
}

/**
 * Display order of physical areas per property. Areas not listed here fall to
 * the end, alphabetically, so a new area never silently disappears.
 */
const propertyAreaOrder: Record<string, string[]> = {
  "birch-house": [
    "Exterior",
    "Garage",
    "Main floor",
    "Mechanical room",
    "Network closet",
  ],
  "linden-commercial": [
    "Lobby",
    "Parking area",
    "Loading dock",
    "Mechanical room",
    "Server room",
  ],
};

export const devices: Device[] = [
  // ---------------------------------------------------------------------------
  // Birch House (residential) — Toronto
  // ---------------------------------------------------------------------------

  // Exterior
  {
    id: "front-door-controller",
    propertyId: "birch-house",
    name: "Front entry · Door controller",
    category: "security_access",
    kind: "door_controller",
    area: "Exterior",
    status: "healthy",
    firmware: "v3.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 28,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.10",
  },
  {
    id: "front-porch-camera",
    propertyId: "birch-house",
    name: "Front porch · Camera",
    category: "surveillance",
    kind: "camera",
    area: "Exterior",
    status: "healthy",
    firmware: "v2.14.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 12,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.16",
  },
  {
    id: "driveway-camera",
    propertyId: "birch-house",
    name: "Driveway · Camera",
    category: "surveillance",
    kind: "camera",
    area: "Exterior",
    status: "healthy",
    firmware: "v2.14.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 48,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.17",
  },
  {
    id: "side-yard-camera-north",
    propertyId: "birch-house",
    name: "Side yard · Camera (north)",
    category: "surveillance",
    kind: "camera",
    area: "Exterior",
    status: "degraded",
    firmware: "v2.14.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 1820,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.22",
    notes:
      "Intermittent uplink traced to the cable, not the unit. Replacement scheduled for the June 2 visit.",
  },
  {
    id: "back-door-camera",
    propertyId: "birch-house",
    name: "Back door · Camera",
    category: "surveillance",
    kind: "camera",
    area: "Exterior",
    status: "healthy",
    firmware: "v2.14.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 96,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.19",
  },
  {
    id: "front-gate-reader",
    propertyId: "birch-house",
    name: "Front gate · Reader",
    category: "security_access",
    kind: "access_reader",
    area: "Exterior",
    status: "healthy",
    firmware: "v1.8.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 300,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.31",
  },
  {
    id: "side-gate-reader",
    propertyId: "birch-house",
    name: "Side gate · Reader",
    category: "security_access",
    kind: "access_reader",
    area: "Exterior",
    status: "healthy",
    firmware: "v1.8.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 5400,
    installedOn: "2024-08-14",
    notes: "Guest codes expire automatically 24 hours after they are issued.",
  },
  {
    id: "driveway-ev-charger",
    propertyId: "birch-house",
    name: "Driveway · EV charger",
    category: "energy",
    kind: "ev_charger",
    area: "Exterior",
    status: "healthy",
    firmware: "v4.0.3",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 120,
    installedOn: "2024-08-14",
    ipAddress: "10.20.6.4",
  },

  // Garage
  {
    id: "garage-access-controller",
    propertyId: "birch-house",
    name: "Garage · Access controller",
    category: "security_access",
    kind: "access_controller",
    area: "Garage",
    status: "healthy",
    firmware: "v3.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 60,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.11",
  },
  {
    id: "garage-camera",
    propertyId: "birch-house",
    name: "Garage · Camera",
    category: "surveillance",
    kind: "camera",
    area: "Garage",
    status: "healthy",
    firmware: "v2.14.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 75,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.20",
  },
  {
    id: "garage-ev-charger",
    propertyId: "birch-house",
    name: "Garage · EV charger",
    category: "energy",
    kind: "ev_charger",
    area: "Garage",
    status: "healthy",
    firmware: "v4.0.3",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 200,
    installedOn: "2024-08-14",
    ipAddress: "10.20.6.5",
    notes:
      "Coordinates overnight charging with the EV load-balance automation.",
  },
  {
    id: "garage-smart-lock",
    propertyId: "birch-house",
    name: "Garage · Smart lock",
    category: "security_access",
    kind: "smart_lock",
    area: "Garage",
    status: "healthy",
    firmware: "v1.5.4",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 410,
    installedOn: "2024-08-14",
  },

  // Main floor
  {
    id: "entry-intercom",
    propertyId: "birch-house",
    name: "Entry · Intercom panel",
    category: "security_access",
    kind: "intercom",
    area: "Main floor",
    status: "healthy",
    firmware: "v2.2.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 95,
    installedOn: "2024-08-14",
    ipAddress: "10.20.4.40",
  },
  {
    id: "living-thermostat",
    propertyId: "birch-house",
    name: "Living · Thermostat",
    category: "energy",
    kind: "thermostat",
    area: "Main floor",
    status: "degraded",
    firmware: "v5.2.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 60,
    installedOn: "2024-08-14",
    notes:
      "Paired remote sensor is reporting a low battery. Replacement batteries are on the next visit.",
  },
  {
    id: "kitchen-leak-sensor",
    propertyId: "birch-house",
    name: "Kitchen · Water leak sensor",
    category: "environmental",
    kind: "leak_sensor",
    area: "Main floor",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 800,
    installedOn: "2024-08-14",
  },
  {
    id: "living-temp-sensor",
    propertyId: "birch-house",
    name: "Living · Temperature sensor",
    category: "environmental",
    kind: "temp_sensor",
    area: "Main floor",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 650,
    installedOn: "2024-08-14",
  },
  {
    id: "back-door-smart-lock",
    propertyId: "birch-house",
    name: "Back door · Smart lock",
    category: "security_access",
    kind: "smart_lock",
    area: "Main floor",
    status: "healthy",
    firmware: "v1.5.3",
    firmwareStatus: "update_available",
    lastSeenSecondsAgo: 520,
    installedOn: "2024-08-14",
    notes: "Firmware update staged for the next maintenance window.",
  },

  // Mechanical room
  {
    id: "mechanical-shutoff-valve",
    propertyId: "birch-house",
    name: "Mechanical · Smart shutoff valve",
    category: "energy",
    kind: "shutoff_valve",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v2.0.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 300,
    installedOn: "2024-08-14",
    notes:
      "Auto-closes on a confirmed leak signal from any environmental sensor.",
  },
  {
    id: "mechanical-flood-sensor",
    propertyId: "birch-house",
    name: "Mechanical · Flood sensor",
    category: "environmental",
    kind: "flood_sensor",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 240,
    installedOn: "2024-08-14",
  },
  {
    id: "mechanical-electrical-monitor",
    propertyId: "birch-house",
    name: "Mechanical · Electrical monitor",
    category: "energy",
    kind: "electrical_monitor",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v2.3.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 30,
    installedOn: "2024-08-14",
    ipAddress: "10.20.6.2",
  },
  {
    id: "mechanical-temp-sensor",
    propertyId: "birch-house",
    name: "Mechanical · Temperature sensor",
    category: "environmental",
    kind: "temp_sensor",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 700,
    installedOn: "2024-08-14",
  },
  {
    id: "utility-humidity-sensor",
    propertyId: "birch-house",
    name: "Utility · Humidity sensor",
    category: "environmental",
    kind: "humidity_sensor",
    area: "Mechanical room",
    status: "pending",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 90,
    installedOn: "2026-05-29",
    notes: "Added during the last visit. Awaiting commissioning on June 2.",
  },
  {
    id: "pool-temp-sensor",
    propertyId: "birch-house",
    name: "Pool equipment · Temperature sensor",
    category: "environmental",
    kind: "temp_sensor",
    area: "Mechanical room",
    status: "offline",
    firmware: "v1.1.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 284_400,
    installedOn: "2024-08-14",
    notes:
      "Pulled for scheduled replacement. Back online after the June 2 visit.",
  },

  // Network closet
  {
    id: "northline-controller",
    propertyId: "birch-house",
    name: "Network closet · Northline controller",
    category: "network",
    kind: "edge_controller",
    area: "Network closet",
    status: "updating",
    firmware: "v3.4.0",
    firmwareStatus: "updating",
    lastSeenSecondsAgo: 20,
    installedOn: "2024-08-14",
    ipAddress: "10.20.0.5",
    notes:
      "Applying a scheduled firmware update. Automations continue on the last known schedule.",
  },
  {
    id: "network-closet-switch",
    propertyId: "birch-house",
    name: "Network closet · Switch (24-port)",
    category: "network",
    kind: "network_switch",
    area: "Network closet",
    status: "healthy",
    firmware: "v3.2.7",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 15,
    installedOn: "2024-08-14",
    ipAddress: "10.20.0.2",
  },
  {
    id: "network-closet-gateway",
    propertyId: "birch-house",
    name: "Network closet · Gateway",
    category: "network",
    kind: "gateway",
    area: "Network closet",
    status: "healthy",
    firmware: "v3.2.7",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 10,
    installedOn: "2024-08-14",
    ipAddress: "10.20.0.1",
  },
  {
    id: "roof-access-point",
    propertyId: "birch-house",
    name: "Roof · Access point",
    category: "network",
    kind: "access_point",
    area: "Network closet",
    status: "healthy",
    firmware: "v3.2.7",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 25,
    installedOn: "2024-08-14",
    ipAddress: "10.20.0.12",
  },
  {
    id: "main-floor-access-point",
    propertyId: "birch-house",
    name: "Main floor · Access point",
    category: "network",
    kind: "access_point",
    area: "Network closet",
    status: "healthy",
    firmware: "v3.2.6",
    firmwareStatus: "update_available",
    lastSeenSecondsAgo: 28,
    installedOn: "2024-08-14",
    ipAddress: "10.20.0.13",
  },
  {
    id: "network-closet-modem",
    propertyId: "birch-house",
    name: "Network closet · Backup cellular modem",
    category: "network",
    kind: "cellular_modem",
    area: "Network closet",
    status: "healthy",
    firmware: "v1.9.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 40,
    installedOn: "2024-08-14",
    notes: "Fails over automatically if the primary fiber uplink drops.",
  },
  {
    id: "network-closet-ups",
    propertyId: "birch-house",
    name: "Network closet · Battery backup",
    category: "network",
    kind: "ups",
    area: "Network closet",
    status: "healthy",
    firmware: "v1.2.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 35,
    installedOn: "2024-08-14",
    notes: "Holds the network closet for roughly 45 minutes during an outage.",
  },

  // ---------------------------------------------------------------------------
  // Linden Commercial — Seattle
  // ---------------------------------------------------------------------------

  // Lobby
  {
    id: "lobby-door-controller",
    propertyId: "linden-commercial",
    name: "Main lobby · Door controller",
    category: "security_access",
    kind: "door_controller",
    area: "Lobby",
    status: "healthy",
    firmware: "v3.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 20,
    installedOn: "2023-11-02",
    ipAddress: "10.10.4.10",
  },
  {
    id: "front-lobby-camera",
    propertyId: "linden-commercial",
    name: "Lobby · Camera",
    category: "surveillance",
    kind: "camera",
    area: "Lobby",
    status: "healthy",
    firmware: "v2.16.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 18,
    installedOn: "2023-11-02",
    ipAddress: "10.10.4.16",
  },
  {
    id: "lobby-reader",
    propertyId: "linden-commercial",
    name: "Main lobby · Reader",
    category: "security_access",
    kind: "access_reader",
    area: "Lobby",
    status: "healthy",
    firmware: "v1.9.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 60,
    installedOn: "2023-11-02",
    ipAddress: "10.10.4.31",
  },
  {
    id: "reception-intercom",
    propertyId: "linden-commercial",
    name: "Reception · Intercom panel",
    category: "security_access",
    kind: "intercom",
    area: "Lobby",
    status: "healthy",
    firmware: "v2.2.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 120,
    installedOn: "2023-11-02",
  },
  {
    id: "north-stair-reader",
    propertyId: "linden-commercial",
    name: "North stair · Reader",
    category: "security_access",
    kind: "access_reader",
    area: "Lobby",
    status: "healthy",
    firmware: "v1.9.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 220,
    installedOn: "2023-11-02",
  },
  {
    id: "lobby-temp-sensor",
    propertyId: "linden-commercial",
    name: "Lobby · Temperature sensor",
    category: "environmental",
    kind: "temp_sensor",
    area: "Lobby",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 500,
    installedOn: "2023-11-02",
  },

  // Parking area
  {
    id: "parking-camera-north",
    propertyId: "linden-commercial",
    name: "Parking · Camera (north)",
    category: "surveillance",
    kind: "camera",
    area: "Parking area",
    status: "healthy",
    firmware: "v2.16.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 30,
    installedOn: "2023-11-02",
    ipAddress: "10.10.4.40",
  },
  {
    id: "parking-camera-south",
    propertyId: "linden-commercial",
    name: "Parking · Camera (south)",
    category: "surveillance",
    kind: "camera",
    area: "Parking area",
    status: "healthy",
    firmware: "v2.16.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 45,
    installedOn: "2023-11-02",
    ipAddress: "10.10.4.41",
  },
  {
    id: "parking-annex-camera",
    propertyId: "linden-commercial",
    name: "Parking · Camera (south annex)",
    category: "surveillance",
    kind: "camera",
    area: "Parking area",
    status: "offline",
    firmware: "v2.16.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 198_000,
    installedOn: "2023-11-02",
    notes:
      "Relocated for the parking resurfacing project. Back online when the bay reopens.",
  },
  {
    id: "parking-gate-reader",
    propertyId: "linden-commercial",
    name: "Parking gate · Reader",
    category: "security_access",
    kind: "access_reader",
    area: "Parking area",
    status: "healthy",
    firmware: "v1.9.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 300,
    installedOn: "2023-11-02",
  },
  {
    id: "ev-charger-bay-1",
    propertyId: "linden-commercial",
    name: "Parking · EV charger (bay 1)",
    category: "energy",
    kind: "ev_charger",
    area: "Parking area",
    status: "healthy",
    firmware: "v4.1.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 60,
    installedOn: "2023-11-02",
    ipAddress: "10.10.6.4",
  },
  {
    id: "ev-charger-bay-2",
    propertyId: "linden-commercial",
    name: "Parking · EV charger (bay 2)",
    category: "energy",
    kind: "ev_charger",
    area: "Parking area",
    status: "healthy",
    firmware: "v4.1.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 70,
    installedOn: "2023-11-02",
    ipAddress: "10.10.6.5",
  },
  {
    id: "ev-charger-bay-3",
    propertyId: "linden-commercial",
    name: "Parking · EV charger (bay 3)",
    category: "energy",
    kind: "ev_charger",
    area: "Parking area",
    status: "degraded",
    firmware: "v4.1.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 1400,
    installedOn: "2023-11-02",
    ipAddress: "10.10.6.6",
    notes: "Charge rate capped after a thermal warning. Service ticket open.",
  },
  {
    id: "ev-panel-controller",
    propertyId: "linden-commercial",
    name: "Parking · EV panel controller",
    category: "energy",
    kind: "electrical_monitor",
    area: "Parking area",
    status: "healthy",
    firmware: "v2.3.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 25,
    installedOn: "2023-11-02",
    ipAddress: "10.10.6.2",
    notes: "Holds total charger draw under the building load limit.",
  },

  // Loading dock
  {
    id: "loading-dock-camera-east",
    propertyId: "linden-commercial",
    name: "Loading dock · Camera (east)",
    category: "surveillance",
    kind: "camera",
    area: "Loading dock",
    status: "healthy",
    firmware: "v2.16.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 22,
    installedOn: "2023-11-02",
    ipAddress: "10.10.4.50",
  },
  {
    id: "loading-dock-camera-west",
    propertyId: "linden-commercial",
    name: "Loading dock · Camera (west)",
    category: "surveillance",
    kind: "camera",
    area: "Loading dock",
    status: "healthy",
    firmware: "v2.16.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 26,
    installedOn: "2023-11-02",
    ipAddress: "10.10.4.51",
  },
  {
    id: "dock-door-controller",
    propertyId: "linden-commercial",
    name: "Loading dock · Door controller",
    category: "security_access",
    kind: "door_controller",
    area: "Loading dock",
    status: "healthy",
    firmware: "v3.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 90,
    installedOn: "2023-11-02",
  },
  {
    id: "dock-reader",
    propertyId: "linden-commercial",
    name: "Loading dock · Reader",
    category: "security_access",
    kind: "access_reader",
    area: "Loading dock",
    status: "healthy",
    firmware: "v1.9.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 350,
    installedOn: "2023-11-02",
  },
  {
    id: "storage-corridor-reader",
    propertyId: "linden-commercial",
    name: "Storage corridor · Reader",
    category: "security_access",
    kind: "access_reader",
    area: "Loading dock",
    status: "healthy",
    firmware: "v1.9.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 4200,
    installedOn: "2023-11-02",
    notes: "Access revoked for a former contractor on May 30.",
  },
  {
    id: "dock-leak-sensor",
    propertyId: "linden-commercial",
    name: "Loading dock · Water leak sensor",
    category: "environmental",
    kind: "leak_sensor",
    area: "Loading dock",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 900,
    installedOn: "2023-11-02",
  },

  // Mechanical room
  {
    id: "linden-shutoff-valve",
    propertyId: "linden-commercial",
    name: "Mechanical · Smart shutoff valve",
    category: "energy",
    kind: "shutoff_valve",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v2.0.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 200,
    installedOn: "2023-11-02",
  },
  {
    id: "linden-flood-sensor",
    propertyId: "linden-commercial",
    name: "Mechanical · Flood sensor",
    category: "environmental",
    kind: "flood_sensor",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 260,
    installedOn: "2023-11-02",
  },
  {
    id: "linden-electrical-monitor",
    propertyId: "linden-commercial",
    name: "Mechanical · Electrical monitor",
    category: "energy",
    kind: "electrical_monitor",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v2.3.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 35,
    installedOn: "2023-11-02",
    ipAddress: "10.10.6.3",
  },
  {
    id: "linden-mech-temp-sensor",
    propertyId: "linden-commercial",
    name: "Mechanical · Temperature sensor",
    category: "environmental",
    kind: "temp_sensor",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 720,
    installedOn: "2023-11-02",
  },
  {
    id: "linden-mech-humidity-sensor",
    propertyId: "linden-commercial",
    name: "Mechanical · Humidity sensor",
    category: "environmental",
    kind: "humidity_sensor",
    area: "Mechanical room",
    status: "degraded",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 1600,
    installedOn: "2023-11-02",
    notes: "Reading drift under review. Recalibration scheduled.",
  },
  {
    id: "boiler-temp-sensor",
    propertyId: "linden-commercial",
    name: "Boiler room · Temperature sensor",
    category: "environmental",
    kind: "temp_sensor",
    area: "Mechanical room",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 480,
    installedOn: "2023-11-02",
  },

  // Server room
  {
    id: "core-switch-48p",
    propertyId: "linden-commercial",
    name: "Server room · Switch (48-port)",
    category: "network",
    kind: "network_switch",
    area: "Server room",
    status: "healthy",
    firmware: "v3.2.7",
    firmwareStatus: "update_available",
    lastSeenSecondsAgo: 15,
    installedOn: "2023-11-02",
    ipAddress: "10.10.0.2",
    notes: "Update available; scheduled for the next overnight window.",
  },
  {
    id: "server-room-gateway",
    propertyId: "linden-commercial",
    name: "Server room · Gateway",
    category: "network",
    kind: "gateway",
    area: "Server room",
    status: "healthy",
    firmware: "v3.3.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 10,
    installedOn: "2023-11-02",
    ipAddress: "10.10.0.1",
  },
  {
    id: "distribution-switch-24p",
    propertyId: "linden-commercial",
    name: "Server room · Switch (24-port)",
    category: "network",
    kind: "network_switch",
    area: "Server room",
    status: "healthy",
    firmware: "v3.2.7",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 14,
    installedOn: "2023-11-02",
    ipAddress: "10.10.0.3",
  },
  {
    id: "edge-controller",
    propertyId: "linden-commercial",
    name: "Server room · Edge controller",
    category: "network",
    kind: "edge_controller",
    area: "Server room",
    status: "updating",
    firmware: "v3.4.0",
    firmwareStatus: "updating",
    lastSeenSecondsAgo: 20,
    installedOn: "2023-11-02",
    ipAddress: "10.10.0.5",
    notes:
      "Applying a scheduled firmware update during the maintenance window.",
  },
  {
    id: "server-room-ups",
    propertyId: "linden-commercial",
    name: "Server room · Battery backup",
    category: "network",
    kind: "ups",
    area: "Server room",
    status: "healthy",
    firmware: "v1.2.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 30,
    installedOn: "2023-11-02",
    notes: "Sized to hold core network and cameras for about 30 minutes.",
  },
  {
    id: "server-room-modem",
    propertyId: "linden-commercial",
    name: "Server room · Backup cellular modem",
    category: "network",
    kind: "cellular_modem",
    area: "Server room",
    status: "healthy",
    firmware: "v1.9.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 40,
    installedOn: "2023-11-02",
  },
  {
    id: "server-room-temp-sensor",
    propertyId: "linden-commercial",
    name: "Server room · Temperature sensor",
    category: "environmental",
    kind: "temp_sensor",
    area: "Server room",
    status: "healthy",
    firmware: "v1.1.2",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 300,
    installedOn: "2023-11-02",
    notes: "Trips an alert if the room passes 27°C.",
  },
  {
    id: "roof-ap-west",
    propertyId: "linden-commercial",
    name: "Roof · Access point (west)",
    category: "network",
    kind: "access_point",
    area: "Server room",
    status: "healthy",
    firmware: "v3.2.7",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 25,
    installedOn: "2023-11-02",
    ipAddress: "10.10.0.20",
    notes: "Channel plan moved off the tenant interference on May 30.",
  },
  {
    id: "roof-ap-east",
    propertyId: "linden-commercial",
    name: "Roof · Access point (east)",
    category: "network",
    kind: "access_point",
    area: "Server room",
    status: "healthy",
    firmware: "v3.2.7",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 27,
    installedOn: "2023-11-02",
    ipAddress: "10.10.0.21",
  },
  {
    id: "conf-wing-ap",
    propertyId: "linden-commercial",
    name: "Conference wing · Access point",
    category: "network",
    kind: "access_point",
    area: "Server room",
    status: "healthy",
    firmware: "v3.2.7",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 33,
    installedOn: "2023-11-02",
    ipAddress: "10.10.0.22",
  },
  {
    id: "rear-staff-camera",
    propertyId: "linden-commercial",
    name: "Rear staff entrance · Camera",
    category: "surveillance",
    kind: "camera",
    area: "Server room",
    status: "healthy",
    firmware: "v2.16.0",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 40,
    installedOn: "2023-11-02",
    ipAddress: "10.10.4.52",
  },
  {
    id: "rear-staff-reader",
    propertyId: "linden-commercial",
    name: "Rear staff entrance · Reader",
    category: "security_access",
    kind: "access_reader",
    area: "Server room",
    status: "pending",
    firmware: "v1.9.1",
    firmwareStatus: "current",
    lastSeenSecondsAgo: 110,
    installedOn: "2026-05-28",
    notes: "Newly installed during the reader audit. Awaiting commissioning.",
  },
];

// ---------------------------------------------------------------------------
// Accessors — the mock/real seam (see §1.5). Components import these, never the
// raw `devices` array.
// ---------------------------------------------------------------------------

export function getDevicesForProperty(propertyId: string): Device[] {
  return devices.filter((device) => device.propertyId === propertyId);
}

export function getDeviceById(id: string): Device | undefined {
  return devices.find((device) => device.id === id);
}

export interface DeviceAreaGroup {
  area: string;
  devices: Device[];
}

/**
 * Devices grouped by physical area, in the property's defined display order.
 * Areas not present in `propertyAreaOrder` are appended alphabetically.
 */
export function groupDevicesByArea(propertyId: string): DeviceAreaGroup[] {
  const scoped = getDevicesForProperty(propertyId);
  const order = propertyAreaOrder[propertyId] ?? [];

  const byArea = new Map<string, Device[]>();
  for (const device of scoped) {
    const list = byArea.get(device.area);
    if (list) list.push(device);
    else byArea.set(device.area, [device]);
  }

  const rank = (area: string) => {
    const index = order.indexOf(area);
    return index === -1 ? order.length : index;
  };

  return [...byArea.keys()]
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .map((area) => ({ area, devices: byArea.get(area) ?? [] }));
}

export type DeviceStatusCounts = Record<DeviceStatus, number>;

/**
 * Count devices by status. Used by the Devices tab header summary.
 */
export function summarizeDeviceStatuses(deviceList: Device[]): DeviceStatusCounts {
  const counts: DeviceStatusCounts = {
    healthy: 0,
    degraded: 0,
    offline: 0,
    updating: 0,
    pending: 0,
  };
  for (const device of deviceList) counts[device.status] += 1;
  return counts;
}
