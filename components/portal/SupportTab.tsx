import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Droplet,
  KeyRound,
  MessageSquare,
  PlugZap,
  Router,
  Video,
} from "lucide-react";
import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";
import { formatDate, formatTime, resolveRelative } from "@/lib/time";
import { getDeviceById } from "@/lib/mock/devices";
import { getTechnicianById, type Message, type Technician } from "@/lib/mock/messages";
import type { Property } from "@/lib/mock/properties";
import type {
  ServiceRecord,
  SupportCategory,
  SupportPriority,
  SupportRequest,
  SupportStatus,
  SupportSummary,
} from "@/lib/mock/support";
import { getVisitById, type Visit } from "@/lib/mock/visits";

interface SupportTabProps {
  property: Property;
  requests: SupportRequest[];
  serviceHistory: ServiceRecord[];
  summary: SupportSummary;
  now: Date;
}

export function SupportTab({
  property,
  requests,
  serviceHistory,
  summary,
  now,
}: SupportTabProps) {
  const open = requests.filter((request) => request.status !== "resolved");
  const resolved = requests.filter((request) => request.status === "resolved");

  return (
    <main id="main" className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <SupportHeader property={property} summary={summary} />

      <section className="mt-8" aria-labelledby="open-requests">
        <h2
          id="open-requests"
          className="mb-3 text-sm font-medium text-text-mid"
        >
          Open requests
        </h2>
        {open.length > 0 ? (
          <ul className="space-y-2.5">
            {open.map((request) => (
              <li key={request.id}>
                <RequestCard request={request} now={now} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-border-soft bg-surface p-6 text-center">
            <p className="text-sm text-text-mid">
              No open requests. Northline is monitoring {property.name} around
              the clock.
            </p>
          </div>
        )}
      </section>

      {resolved.length > 0 ? (
        <section className="mt-8" aria-labelledby="resolved-requests">
          <h2
            id="resolved-requests"
            className="mb-3 text-sm font-medium text-text-mid"
          >
            Recently resolved
          </h2>
          <ul className="space-y-2.5">
            {resolved.map((request) => (
              <li key={request.id}>
                <RequestCard request={request} now={now} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {serviceHistory.length > 0 ? (
        <ServiceHistory records={serviceHistory} />
      ) : null}
    </main>
  );
}

function SupportHeader({
  property,
  summary,
}: {
  property: Property;
  summary: SupportSummary;
}) {
  return (
    <div className="rounded-lg border border-border-soft bg-ink-1 p-5 sm:p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-low">
            Support
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none tracking-tight text-text-hi sm:text-5xl">
            Service &amp; support
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-mid sm:text-base">
            How Northline is managing {property.name}. Every request, who has it,
            and where it stands — in one place.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[460px]">
          <SummaryStat label="Open" value={summary.open} />
          <SummaryStat label="Awaiting you" value={summary.awaitingYou} />
          <SummaryStat label="Scheduled visits" value={summary.scheduledVisits} />
          <SummaryStat label="Resolved this month" value={summary.resolvedThisMonth} />
        </dl>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border-soft bg-surface/50 px-3 py-2">
      <dd className="font-mono text-lg leading-none text-text-hi">{value}</dd>
      <dt className="mt-1 text-xs leading-4 text-text-low">{label}</dt>
    </div>
  );
}

function RequestCard({
  request,
  now,
}: {
  request: SupportRequest;
  now: Date;
}) {
  const Icon = CATEGORY_ICON[request.category];
  const status = STATUS_META[request.status];
  const technician = getTechnicianById(request.assignedTechnicianId);
  const updated = resolveRelative(request.updatedAtMinutesAgo * 60, now);

  return (
    <details
      id={request.id}
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
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-text-hi">
              {request.title}
            </p>
            {request.priority !== "routine" ? (
              <PriorityTag priority={request.priority} />
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-text-low">
            {CATEGORY_LABEL[request.category]}
            {technician ? ` · ${technicianLabel(technician)}` : ""}
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="font-mono text-xs leading-none text-text-low">Updated</p>
          <p className="mt-1 font-mono text-xs leading-none text-text-mid">
            {updated.display}
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

      <RequestDetail request={request} now={now} />
    </details>
  );
}

function RequestDetail({
  request,
  now,
}: {
  request: SupportRequest;
  now: Date;
}) {
  const technician = getTechnicianById(request.assignedTechnicianId);
  const device = request.deviceId ? getDeviceById(request.deviceId) : undefined;
  const visit = request.scheduledVisitId
    ? getVisitById(request.scheduledVisitId)
    : undefined;

  return (
    <div className="space-y-4 border-t border-border-soft px-4 pb-4 pt-4">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Meta label="Status" value={STATUS_META[request.status].label} />
        <Meta label="Priority" value={PRIORITY_LABEL[request.priority]} />
        <Meta label="Opened" value={formatDate(request.createdAt, "long")} />
        <Meta
          label="Assigned to"
          value={technician ? technicianLabel(technician) : "Northline"}
        />
        <Meta label="Category" value={CATEGORY_LABEL[request.category]} />
        {device ? (
          <Meta
            label="Related device"
            value={device.name}
            href={`/portal/devices?p=${request.propertyId}#${device.id}`}
          />
        ) : null}
      </dl>

      {request.resolutionNote ? (
        <div className="flex gap-2.5 rounded-md border border-accent/25 bg-accent-tint/60 p-3">
          <CheckCircle2
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-accent-soft"
            aria-hidden
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-accent-soft">
              Resolved
            </p>
            <p className="mt-1 text-sm leading-6 text-text-mid">
              {request.resolutionNote}
            </p>
          </div>
        </div>
      ) : null}

      {visit ? <ScheduledVisit visit={visit} /> : null}

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-text-low">
          Conversation
        </p>
        <ol className="space-y-3">
          {request.messages.map((message) => (
            <MessageRow key={message.id} message={message} now={now} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function ScheduledVisit({ visit }: { visit: Visit }) {
  const technician = getTechnicianById(visit.technicianId);
  return (
    <div className="rounded-md border border-border-soft bg-bg-0 p-3">
      <div className="flex items-start gap-2.5">
        <CalendarClock
          size={16}
          strokeWidth={1.8}
          className="mt-0.5 shrink-0 text-gold"
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-low">
            Scheduled visit
          </p>
          <p className="mt-1 text-sm font-medium text-text-hi">
            {formatDate(visit.scheduledFor, "long")}
          </p>
          <p className="mt-0.5 font-mono text-xs text-text-low">
            {visit.window}
            {technician ? ` · ${technicianLabel(technician)}` : ""}
          </p>
          {visit.scope.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {visit.scope.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-5 text-text-mid"
                >
                  <span
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-text-low"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MessageRow({ message, now }: { message: Message; now: Date }) {
  const isClient = message.authorId === "client";
  const technician = isClient
    ? undefined
    : getTechnicianById(message.authorId);
  const author = isClient
    ? "You"
    : technician
      ? `${technician.firstName} ${technician.lastInitial}.`
      : "Northline";
  const role = isClient ? "Client" : (technician?.role ?? "Northline");
  const time =
    message.sentAtMinutesAgo !== undefined
      ? resolveRelative(message.sentAtMinutesAgo * 60, now).display
      : message.sentAt
        ? `${formatDate(message.sentAt, "short")}, ${formatTime(message.sentAt)}`
        : "";

  return (
    <li className={cn("flex flex-col", isClient ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-lg border p-3",
          isClient
            ? "border-accent/20 bg-accent-tint/50"
            : "border-border-soft bg-bg-0",
        )}
      >
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-xs font-medium text-text-hi">{author}</span>
          <span className="text-[11px] text-text-low">{role}</span>
        </div>
        <p className="text-sm leading-6 text-text-mid">{message.body}</p>
      </div>
      <span className="mt-1 px-1 font-mono text-[11px] text-text-low">
        {time}
      </span>
    </li>
  );
}

function ServiceHistory({ records }: { records: ServiceRecord[] }) {
  return (
    <section
      className="mt-8 rounded-lg border border-border-soft bg-ink-1"
      aria-labelledby="service-history"
    >
      <div className="border-b border-border-soft px-4 py-4 sm:px-5">
        <h2 id="service-history" className="font-medium text-text-hi">
          Recent resolutions
        </h2>
        <p className="mt-1 text-sm text-text-low">
          Work Northline has completed on this property.
        </p>
      </div>
      <ul className="divide-y divide-border-soft">
        {records.map((record) => {
          const technician = getTechnicianById(record.technicianId);
          return (
            <li
              key={record.id}
              className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
            >
              <CheckCircle2
                size={17}
                strokeWidth={1.8}
                className="shrink-0 text-accent-soft"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-hi">
                  {record.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-text-low">
                  {CATEGORY_LABEL[record.category]}
                  {technician ? ` · ${technicianLabel(technician)}` : ""}
                </p>
              </div>
              <time
                dateTime={record.completedOn}
                className="shrink-0 font-mono text-xs text-text-low"
              >
                {formatDate(record.completedOn, "short")}
              </time>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Meta({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="rounded-md border border-border-soft bg-bg-0 p-3">
      <dt className="text-xs text-text-low">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-text-hi">
        {href ? (
          <Link
            href={href}
            prefetch={false}
            className="inline-flex items-center gap-1 text-accent-soft transition-colors hover:text-accent-bright"
          >
            {value}
            <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function PriorityTag({ priority }: { priority: Exclude<SupportPriority, "routine"> }) {
  return (
    <span
      className={cn(
        "shrink-0 font-mono text-[11px] uppercase tracking-[0.1em]",
        priority === "urgent" ? "text-signal-warm" : "text-gold",
      )}
    >
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

function technicianLabel(technician: Technician): string {
  return `${technician.firstName} ${technician.lastInitial}.`;
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

const CATEGORY_ICON: Record<SupportCategory, typeof MessageSquare> = {
  security_access: KeyRound,
  surveillance: Video,
  environmental: Droplet,
  energy: PlugZap,
  network: Router,
  general: MessageSquare,
};

const CATEGORY_LABEL: Record<SupportCategory, string> = {
  security_access: "Security & access",
  surveillance: "Surveillance",
  environmental: "Environmental",
  energy: "Energy & utilities",
  network: "Network & infrastructure",
  general: "General",
};

type PillTone = "healthy" | "notice" | "warning" | "muted";

const STATUS_META: Record<
  SupportStatus,
  { label: string; tone: PillTone }
> = {
  new: { label: "New", tone: "notice" },
  scheduled: { label: "Scheduled", tone: "healthy" },
  in_progress: { label: "In progress", tone: "healthy" },
  awaiting_you: { label: "Awaiting you", tone: "notice" },
  monitoring: { label: "Monitoring", tone: "muted" },
  resolved: { label: "Resolved", tone: "muted" },
};

const PRIORITY_LABEL: Record<SupportPriority, string> = {
  routine: "Routine",
  priority: "Priority",
  urgent: "Urgent",
};
