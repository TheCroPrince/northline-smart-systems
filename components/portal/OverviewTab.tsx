import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  KeyRound,
  MessageSquare,
  Minus,
  RadioTower,
  SearchCheck,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";
import { formatDate, formatTime, resolveRelative } from "@/lib/time";
import type { AutomationRule } from "@/lib/mock/automations";
import type { FeedEvent } from "@/lib/mock/events";
import type { KpiCard, PropertyMetrics } from "@/lib/mock/metrics";
import type { Technician } from "@/lib/mock/messages";
import type { Property } from "@/lib/mock/properties";
import type { SupportRequest, SupportStatus } from "@/lib/mock/support";
import type { Visit } from "@/lib/mock/visits";

interface OverviewTabProps {
  property: Property;
  metrics: PropertyMetrics;
  events: FeedEvent[];
  visit?: Visit;
  supportRequest?: SupportRequest;
  technician?: Technician;
  automations: AutomationRule[];
  now: Date;
}

export function OverviewTab({
  property,
  metrics,
  events,
  visit,
  supportRequest,
  technician,
  automations,
  now,
}: OverviewTabProps) {
  return (
    <main id="main" className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <OverviewHeader property={property} metrics={metrics} />
          <KpiStrip cards={metrics.cards} values={metrics.uptimeSparkline} />
          <RecentEvents events={events} now={now} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
          <PropertyRecord property={property} technician={technician} />
          <VisitPanel visit={visit} technician={technician} propertyId={property.id} />
          <SupportPanel
            request={supportRequest}
            technician={technician}
            propertyId={property.id}
            now={now}
          />
          <AutomationPanel automations={automations} />
        </aside>
      </section>
    </main>
  );
}

function OverviewHeader({
  property,
  metrics,
}: {
  property: Property;
  metrics: PropertyMetrics;
}) {
  const totalSystems =
    property.systems.cameras +
    property.systems.accessPoints +
    property.systems.accessReaders +
    property.systems.sensors +
    property.systems.automationZones +
    property.systems.evChargers;

  return (
    <div className="rounded-lg border border-border-soft bg-ink-1 p-5 sm:p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-low">
            {kindLabel(property.kind)} property
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none tracking-tight text-text-hi sm:text-5xl">
            {property.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-mid sm:text-base">
            {property.city}, {property.region}. {totalSystems} monitored systems
            across {property.squareFootage.toLocaleString("en-US")} sq ft.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 xl:w-[520px]">
          <MiniStat label="Cameras" value={property.systems.cameras} />
          <MiniStat label="Readers" value={property.systems.accessReaders} />
          <MiniStat label="Sensors" value={property.systems.sensors} />
          <MiniStat label="Chargers" value={property.systems.evChargers} />
        </div>
      </div>

      <UptimeStrip values={metrics.uptimeSparkline} />
    </div>
  );
}

function UptimeStrip({ values }: { values: number[] }) {
  const low = Math.min(...values);
  return (
    <div className="mt-6 rounded-md border border-border-soft bg-bg-0 px-3 py-3">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-xs text-text-low">Uptime · last 30 days</p>
        <p className="font-mono text-xs text-text-low">{low}% low</p>
      </div>
      <div
        className="flex h-9 items-end gap-1"
        role="img"
        aria-label={`Daily uptime over the last 30 days, ranging from ${low}% to 100%.`}
      >
        {values.map((value, index) => {
          // Map 95–100% onto a readable 6–32px range so dips are visible.
          const height = Math.min(32, Math.max(6, ((value - 95) / 5) * 26 + 6));
          return (
            <span
              key={`${value}-${index}`}
              className={cn(
                "flex-1 rounded-[2px]",
                value <= 97 ? "bg-gold/45" : "bg-accent/45",
              )}
              style={{ height: `${height}px` }}
              aria-hidden
            />
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border-soft bg-surface/50 px-3 py-2">
      <p className="font-mono text-lg leading-none text-text-hi">
        {value.toLocaleString("en-US")}
      </p>
      <p className="mt-1 text-xs text-text-low">{label}</p>
    </div>
  );
}

function KpiStrip({ cards, values }: { cards: KpiCard[]; values: number[] }) {
  const average = Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );

  return (
    <section aria-labelledby="kpi-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="kpi-heading" className="text-sm font-medium text-text-mid">
          Operational snapshot
        </h2>
        <span className="font-mono text-xs text-text-low">
          {average}% 30-day average
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <KpiCardView key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}

function KpiCardView({ card }: { card: KpiCard }) {
  const tone =
    card.status === "healthy"
      ? "healthy"
      : card.status === "degraded"
        ? "warning"
        : "muted";

  return (
    <article className="rounded-lg border border-border-soft bg-surface p-4">
      <p className="text-sm font-medium text-text-mid">{card.label}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="font-mono text-4xl leading-none tracking-tight text-text-hi">
          {card.value}
        </p>
        {card.trend ? <TrendIndicator trend={card.trend} /> : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        {card.sublabel ? (
          <p className="min-w-0 text-xs leading-5 text-text-low">{card.sublabel}</p>
        ) : null}
        {card.status ? (
          <StatusPill tone={tone} className="shrink-0">
            {statusLabel(card.status)}
          </StatusPill>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Direction-only trend mark. Neutral tone — the magnitude lives in the card
 * sublabel ("-6 vs last week"), so this just shows which way it moved without
 * the green/red "dashboard" charge.
 */
function TrendIndicator({ trend }: { trend: KpiCard["trend"] }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const label = trend === "up" ? "Trending up" : trend === "down" ? "Trending down" : "Flat";
  return (
    <span className="flex items-center gap-1 text-text-low" title={label}>
      <Icon size={15} strokeWidth={1.8} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function RecentEvents({ events, now }: { events: FeedEvent[]; now: Date }) {
  return (
    <section
      aria-labelledby="events-heading"
      className="rounded-lg border border-border-soft bg-ink-1"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border-soft px-4 py-4 sm:px-5">
        <div>
          <h2 id="events-heading" className="font-medium text-text-hi">
            Recent events
          </h2>
          <p className="mt-1 text-sm text-text-low">
            Classifications, access, and service — on the record.
          </p>
        </div>
        <StatusPill tone="healthy">Live</StatusPill>
      </div>

      <div className="divide-y divide-border-soft">
        {events.map((event) => (
          <EventRow key={event.id} event={event} now={now} />
        ))}
      </div>
    </section>
  );
}

function EventRow({ event, now }: { event: FeedEvent; now: Date }) {
  const rendered = renderEvent(event);
  const time = resolveRelative(event.secondsAgo, now);
  const Icon = rendered.icon;

  return (
    <article className="grid gap-3 px-4 py-4 transition-colors hover:bg-surface/45 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:px-5">
      <div
        className={cn(
          "grid size-9 place-items-center rounded-md border",
          event.severity === "warning" &&
            "border-signal-warm/30 bg-signal-warm/10 text-signal-warm",
          event.severity === "notice" && "border-gold/30 bg-gold/10 text-gold",
          event.severity === "info" &&
            "border-accent/25 bg-accent-tint text-accent-soft",
        )}
      >
        <Icon size={17} strokeWidth={1.8} aria-hidden />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-text-hi">{rendered.title}</h3>
          <StatusPill tone={severityTone(event.severity)}>
            {severityLabel(event.severity)}
          </StatusPill>
        </div>
        {rendered.detail ? (
          <p className="mt-1 text-sm leading-6 text-text-mid">{rendered.detail}</p>
        ) : null}
      </div>

      <time
        dateTime={time.iso}
        className="font-mono text-xs leading-6 text-text-low sm:text-right"
      >
        {time.display}
      </time>
    </article>
  );
}

function PropertyRecord({
  property,
  technician,
}: {
  property: Property;
  technician?: Technician;
}) {
  return (
    <section className="rounded-lg border border-border-soft bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-medium text-text-hi">Property record</h2>
          <p className="mt-1 text-sm text-text-low">
            Commissioned {formatDate(property.commissionedOn, "short")}
          </p>
        </div>
        <ShieldCheck size={20} strokeWidth={1.7} className="text-accent-soft" />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <RecordItem label="Last review" value={formatDate(property.lastReviewedOn, "short")} />
        <RecordItem label="Service lead" value={technicianLabel(technician)} />
        <RecordItem label="Monitoring" value="24/7" />
        <RecordItem label="Location" value={property.city} />
      </dl>

      <PanelLink href={`/portal/devices?p=${property.id}`}>
        View all devices
      </PanelLink>
    </section>
  );
}

function PanelLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent-soft transition-colors hover:text-accent-bright"
    >
      {children}
      <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
    </Link>
  );
}

function VisitPanel({
  visit,
  technician,
  propertyId,
}: {
  visit?: Visit;
  technician?: Technician;
  propertyId: string;
}) {
  return (
    <section className="rounded-lg border border-border-soft bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-medium text-text-hi">Upcoming visit</h2>
          <p className="mt-1 text-sm text-text-low">
            {visit ? formatDate(visit.scheduledFor, "long") : "No visit scheduled"}
          </p>
        </div>
        <CalendarClock size={20} strokeWidth={1.7} className="text-gold" />
      </div>

      {visit ? (
        <>
          <div className="mt-5 rounded-md border border-border-soft bg-bg-0 p-3">
            <p className="font-medium text-text-hi">{visit.title}</p>
            <p className="mt-1 font-mono text-xs text-text-low">{visit.window}</p>
            <p className="mt-3 text-sm text-text-mid">
              {technicianLabel(technician)} · {statusLabel(visit.status)}
            </p>
          </div>

          <ul className="mt-4 space-y-2">
            {visit.scope.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-text-mid">
                <CheckCircle2
                  size={15}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-accent-soft"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <PanelLink href={`/portal/support?p=${propertyId}`}>
            View in Support
          </PanelLink>
        </>
      ) : null}
    </section>
  );
}

function SupportPanel({
  request,
  technician,
  propertyId,
  now,
}: {
  request?: SupportRequest;
  technician?: Technician;
  propertyId: string;
  now: Date;
}) {
  const latestMessage = request?.messages.at(-1);
  const latestTime =
    latestMessage?.sentAtMinutesAgo !== undefined
      ? resolveRelative(latestMessage.sentAtMinutesAgo * 60, now).display
      : latestMessage?.sentAt
        ? `${formatDate(latestMessage.sentAt, "short")}, ${formatTime(latestMessage.sentAt)}`
        : "No new messages";

  return (
    <section className="rounded-lg border border-border-soft bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-medium text-text-hi">Support</h2>
          <p className="mt-1 text-sm text-text-low">{technicianLabel(technician)}</p>
        </div>
        <MessageSquare size={20} strokeWidth={1.7} className="text-accent-soft" />
      </div>

      {request ? (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-medium text-text-hi">
              {request.title}
            </p>
            <StatusPill
              tone={request.status === "awaiting_you" ? "notice" : "healthy"}
            >
              {supportStatusLabel(request.status)}
            </StatusPill>
          </div>
          {latestMessage ? (
            <p className="mt-3 text-sm leading-6 text-text-mid">
              {latestMessage.body}
            </p>
          ) : null}
          <p className="mt-4 font-mono text-xs text-text-low">{latestTime}</p>
        </div>
      ) : (
        <p className="mt-5 text-sm text-text-mid">
          No open requests. Everything is running normally.
        </p>
      )}

      <PanelLink
        href={`/portal/support?p=${propertyId}${request ? `#${request.id}` : ""}`}
      >
        {request ? "Open in Support" : "View Support"}
      </PanelLink>
    </section>
  );
}

function AutomationPanel({ automations }: { automations: AutomationRule[] }) {
  return (
    <section className="rounded-lg border border-border-soft bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-medium text-text-hi">Automations</h2>
          <p className="mt-1 text-sm text-text-low">{automationSummary(automations)}</p>
        </div>
        <Zap size={20} strokeWidth={1.7} className="text-gold" />
      </div>

      <div className="mt-4 space-y-3">
        {automations.map((automation) => (
          <div
            key={automation.id}
            className="rounded-md border border-border-soft bg-bg-0 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-text-hi">{automation.name}</p>
              <StatusPill tone={automation.status === "active" ? "healthy" : "muted"}>
                {statusLabel(automation.status)}
              </StatusPill>
            </div>
            <p className="mt-2 text-sm leading-5 text-text-mid">{automation.scope}</p>
            <p className="mt-3 font-mono text-xs text-text-low">
              {automation.cadence} · {formatDate(automation.nextRun, "short")}{" "}
              {formatTime(automation.nextRun)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecordItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-soft bg-bg-0 p-3">
      <dt className="text-xs text-text-low">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-text-hi">{value}</dd>
    </div>
  );
}

function renderEvent(event: FeedEvent): {
  title: string;
  detail?: string;
  icon: typeof SearchCheck;
} {
  switch (event.type) {
    case "classification":
      return {
        title: `${sentenceCase(event.zone)} · classified ${event.classification}`,
        detail: `${event.confidence}% confidence · ${statusLabel(event.outcome)}${
          event.reasoning ? ` · ${event.reasoning}` : ""
        }`,
        icon: SearchCheck,
      };
    case "access":
      return {
        title: `${event.deviceName} · access ${event.result}`,
        detail: event.identity,
        icon: KeyRound,
      };
    case "system":
      return {
        title: `System · ${event.action}`,
        detail: event.detail,
        icon: RadioTower,
      };
    case "maintenance":
      return {
        title: `Maintenance · ${event.description}`,
        detail: event.scheduledFor
          ? `${formatDate(event.scheduledFor, "long")} · scheduled`
          : undefined,
        icon: Wrench,
      };
  }
}

function sentenceCase(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function severityTone(severity: FeedEvent["severity"]) {
  if (severity === "warning") return "warning";
  if (severity === "notice") return "notice";
  return "healthy";
}

// Attention level for the row, not the system's action — the action word
// (logged / acknowledged / notified) already lives in the event detail, so the
// pill conveys "how much should this draw your eye" instead of repeating it.
function severityLabel(severity: FeedEvent["severity"]) {
  if (severity === "info") return "Routine";
  if (severity === "notice") return "Notice";
  return "Alert";
}

function statusLabel(status: string): string {
  return status
    .split("_")
    .map((part, index) =>
      index === 0
        ? `${part.charAt(0).toUpperCase()}${part.slice(1)}`
        : part,
    )
    .join(" ");
}

function supportStatusLabel(status: SupportStatus): string {
  if (status === "awaiting_you") return "Awaiting you";
  if (status === "in_progress") return "In progress";
  return statusLabel(status);
}

function technicianLabel(technician?: Technician): string {
  if (!technician) return "Northline";
  return `${technician.firstName} ${technician.lastInitial}.`;
}

function kindLabel(kind: Property["kind"]): string {
  return kind === "residential" ? "Residential" : "Commercial";
}

function automationSummary(automations: AutomationRule[]): string {
  const running = automations.filter((rule) => rule.status === "active").length;
  const scheduled = automations.filter((rule) => rule.status === "scheduled").length;
  const parts: string[] = [];
  if (running) parts.push(`${running} running`);
  if (scheduled) parts.push(`${scheduled} scheduled`);
  if (!parts.length) return `${automations.length} rules`;
  return parts.join(" · ");
}
