import {
  Activity,
  ArrowUpRight,
  BatteryCharging,
  ChevronDown,
  Cpu,
  DoorClosed,
  Droplet,
  Droplets,
  Gauge,
  KeyRound,
  Lock,
  type LucideIcon,
  MessageSquare,
  Network,
  Phone,
  PlugZap,
  RadioTower,
  Router,
  Thermometer,
  Video,
  Waves,
  Wifi,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";
import { formatDate, resolveRelative } from "@/lib/time";
import type {
  Device,
  DeviceAreaGroup,
  DeviceCategory,
  DeviceKind,
  DeviceStatus,
  DeviceStatusCounts,
  FirmwareStatus,
} from "@/lib/mock/devices";
import type { FeedEvent } from "@/lib/mock/events";
import type { Property } from "@/lib/mock/properties";

interface DevicesTabProps {
  property: Property;
  groups: DeviceAreaGroup[];
  statusCounts: DeviceStatusCounts;
  /** Property-scoped events, used to surface per-device recent activity. */
  events: FeedEvent[];
  /** deviceId -> href of an active support request about that device. */
  supportLinks: Record<string, string>;
  now: Date;
}

export function DevicesTab({
  property,
  groups,
  statusCounts,
  events,
  supportLinks,
  now,
}: DevicesTabProps) {
  const total = groups.reduce((sum, group) => sum + group.devices.length, 0);

  // Index events by deviceId once, so each card can show its own recent activity.
  const eventsByDevice = new Map<string, FeedEvent[]>();
  for (const event of events) {
    if (!event.deviceId) continue;
    const list = eventsByDevice.get(event.deviceId);
    if (list) list.push(event);
    else eventsByDevice.set(event.deviceId, [event]);
  }

  return (
    <main id="main" className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <DevicesHeader
        property={property}
        total={total}
        areaCount={groups.length}
        statusCounts={statusCounts}
      />

      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <AreaSection
            key={group.area}
            group={group}
            eventsByDevice={eventsByDevice}
            supportLinks={supportLinks}
            now={now}
          />
        ))}
      </div>
    </main>
  );
}

function DevicesHeader({
  property,
  total,
  areaCount,
  statusCounts,
}: {
  property: Property;
  total: number;
  areaCount: number;
  statusCounts: DeviceStatusCounts;
}) {
  const attention =
    statusCounts.degraded + statusCounts.offline + statusCounts.pending;

  return (
    <div className="rounded-lg border border-border-soft bg-ink-1 p-5 sm:p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-low">
            Devices
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none tracking-tight text-text-hi sm:text-5xl">
            Managed systems
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-mid sm:text-base">
            {total} systems Northline installs and monitors across {areaCount}{" "}
            areas at {property.name}.{" "}
            {attention === 0
              ? "Everything is reporting normally."
              : `${attention} ${attention === 1 ? "system needs" : "systems need"} attention.`}
          </p>
        </div>

        <StatusSummary counts={statusCounts} />
      </div>
    </div>
  );
}

function StatusSummary({ counts }: { counts: DeviceStatusCounts }) {
  // Show only the states present, healthy first, in a fixed sensible order.
  const order: DeviceStatus[] = [
    "healthy",
    "degraded",
    "updating",
    "pending",
    "offline",
  ];
  const present = order.filter((status) => counts[status] > 0);

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:flex xl:flex-wrap xl:justify-end">
      {present.map((status) => {
        const meta = STATUS_META[status];
        return (
          <div
            key={status}
            className="flex items-center gap-2.5 rounded-md border border-border-soft bg-surface/50 px-3 py-2 xl:min-w-[7.5rem]"
          >
            <span
              className={cn("size-2 shrink-0 rounded-full", meta.dotClass)}
              aria-hidden
            />
            <div className="min-w-0">
              <dd className="font-mono text-lg leading-none text-text-hi">
                {counts[status]}
              </dd>
              <dt className="mt-1 text-xs text-text-low">{meta.label}</dt>
            </div>
          </div>
        );
      })}
    </dl>
  );
}

function AreaSection({
  group,
  eventsByDevice,
  supportLinks,
  now,
}: {
  group: DeviceAreaGroup;
  eventsByDevice: Map<string, FeedEvent[]>;
  supportLinks: Record<string, string>;
  now: Date;
}) {
  const attention = group.devices.filter(
    (device) => device.status !== "healthy",
  ).length;

  return (
    <section aria-label={group.area}>
      <div className="mb-3 flex items-center justify-between gap-4 border-b border-border-soft pb-2">
        <h2 className="font-display text-xl tracking-tight text-text-hi">
          {group.area}
        </h2>
        <span className="font-mono text-xs text-text-low">
          {attention === 0
            ? `${group.devices.length} online`
            : `${attention} of ${group.devices.length} flagged`}
        </span>
      </div>

      <ul className="space-y-2.5">
        {group.devices.map((device) => (
          <li key={device.id}>
            <DeviceCard
              device={device}
              relatedEvents={eventsByDevice.get(device.id) ?? []}
              supportHref={supportLinks[device.id]}
              now={now}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function DeviceCard({
  device,
  relatedEvents,
  supportHref,
  now,
}: {
  device: Device;
  relatedEvents: FeedEvent[];
  supportHref?: string;
  now: Date;
}) {
  const Icon = KIND_ICON[device.kind];
  const status = STATUS_META[device.status];
  const lastSeen = resolveRelative(device.lastSeenSecondsAgo, now);

  return (
    <details
      id={device.id}
      className="group scroll-mt-36 rounded-lg border border-border-soft bg-surface transition-colors open:border-border open:bg-surface-2 hover:border-border"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden sm:gap-4">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-md border border-border-soft bg-bg-0 text-text-mid"
          aria-hidden
        >
          <Icon size={18} strokeWidth={1.8} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-hi">
            {device.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-text-low">
            {CATEGORY_LABEL[device.category]} · {device.firmware}
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="font-mono text-xs leading-none text-text-low">
            Checked in
          </p>
          <p className="mt-1 font-mono text-xs leading-none text-text-mid">
            {lastSeen.display}
          </p>
        </div>

        <StatusPill tone={status.tone} className="shrink-0">
          {status.label}
        </StatusPill>

        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className="shrink-0 text-text-low transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <DeviceDetail
        device={device}
        relatedEvents={relatedEvents}
        supportHref={supportHref}
        now={now}
      />
    </details>
  );
}

function DeviceDetail({
  device,
  relatedEvents,
  supportHref,
  now,
}: {
  device: Device;
  relatedEvents: FeedEvent[];
  supportHref?: string;
  now: Date;
}) {
  const lastSeen = resolveRelative(device.lastSeenSecondsAgo, now);

  return (
    <div className="border-t border-border-soft px-4 pb-4 pt-4">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Meta label="Status" value={STATUS_META[device.status].label} />
        <Meta label="Last check-in" value={lastSeen.display} />
        <Meta label="Firmware" value={`${device.firmware} · ${FIRMWARE_LABEL[device.firmwareStatus]}`} />
        <Meta label="Installed" value={formatDate(device.installedOn, "long")} />
        <Meta label="Category" value={CATEGORY_LABEL[device.category]} />
        <Meta label="Area" value={device.area} />
        {device.ipAddress ? (
          <Meta label="IP address" value={device.ipAddress} mono />
        ) : null}
      </dl>

      {device.notes ? (
        <div className="mt-3 flex gap-2.5 rounded-md border border-border-soft bg-bg-0 p-3">
          <Wrench
            size={15}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-accent-soft"
            aria-hidden
          />
          <p className="text-sm leading-6 text-text-mid">{device.notes}</p>
        </div>
      ) : null}

      {relatedEvents.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-text-low">
            Recent activity
          </p>
          <ul className="space-y-1.5">
            {relatedEvents.slice(0, 3).map((event) => {
              const time = resolveRelative(event.secondsAgo, now);
              return (
                <li
                  key={event.id}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 truncate text-text-mid">
                    {describeEvent(event)}
                  </span>
                  <time
                    dateTime={time.iso}
                    className="shrink-0 font-mono text-xs text-text-low"
                  >
                    {time.display}
                  </time>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {supportHref ? (
        <Link
          href={supportHref}
          prefetch={false}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft transition-colors hover:text-accent-bright"
        >
          <MessageSquare size={14} strokeWidth={1.8} aria-hidden />
          View the open support request
          <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border border-border-soft bg-bg-0 p-3">
      <dt className="text-xs text-text-low">{label}</dt>
      <dd
        className={cn(
          "mt-1 truncate text-sm font-medium text-text-hi",
          mono && "font-mono text-[13px]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

const KIND_ICON: Record<DeviceKind, LucideIcon> = {
  door_controller: DoorClosed,
  access_controller: DoorClosed,
  smart_lock: Lock,
  intercom: Phone,
  access_reader: KeyRound,
  camera: Video,
  leak_sensor: Droplet,
  flood_sensor: Droplets,
  temp_sensor: Thermometer,
  humidity_sensor: Waves,
  ev_charger: PlugZap,
  thermostat: Gauge,
  electrical_monitor: Activity,
  shutoff_valve: Waves,
  gateway: Router,
  edge_controller: Cpu,
  network_switch: Network,
  cellular_modem: RadioTower,
  access_point: Wifi,
  ups: BatteryCharging,
};

const CATEGORY_LABEL: Record<DeviceCategory, string> = {
  security_access: "Security & access",
  surveillance: "Surveillance",
  environmental: "Environmental",
  energy: "Energy & utilities",
  network: "Network & infrastructure",
};

type PillTone = "healthy" | "notice" | "warning" | "muted";

const STATUS_META: Record<
  DeviceStatus,
  { label: string; tone: PillTone; dotClass: string }
> = {
  healthy: { label: "Online", tone: "healthy", dotClass: "bg-accent" },
  degraded: { label: "Warning", tone: "warning", dotClass: "bg-signal-warm" },
  updating: { label: "Updating", tone: "notice", dotClass: "bg-gold" },
  pending: { label: "Pending", tone: "muted", dotClass: "bg-text-low" },
  offline: { label: "Offline", tone: "muted", dotClass: "bg-text-low" },
};

const FIRMWARE_LABEL: Record<FirmwareStatus, string> = {
  current: "Current",
  update_available: "Update available",
  updating: "Updating",
};

function describeEvent(event: FeedEvent): string {
  switch (event.type) {
    case "classification":
      return `${sentenceCase(event.zone)} · ${event.classification}`;
    case "access":
      return `Access ${event.result}${event.identity ? ` · ${event.identity}` : ""}`;
    case "system":
      return sentenceCase(event.action);
    case "maintenance":
      return event.description;
  }
}

function sentenceCase(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
