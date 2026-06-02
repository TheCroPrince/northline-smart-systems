import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDot,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/time";
import { getTechnicianById, type Technician } from "@/lib/mock/messages";
import type { Property } from "@/lib/mock/properties";
import type {
  Project,
  ProjectImage,
  ProjectMilestone,
  ProjectStatus,
  ProjectUpdate,
} from "@/lib/mock/projects";

interface ProjectsTabProps {
  property: Property;
  active: Project[];
  completed: Project[];
}

export function ProjectsTab({ property, active, completed }: ProjectsTabProps) {
  return (
    <main id="main" className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <ProjectsHeader
        property={property}
        activeCount={active.length}
        completedCount={completed.length}
      />

      <div className="mt-8 space-y-8">
        {active.length > 0 ? (
          active.map((project) => (
            <ActiveProject key={project.id} project={project} />
          ))
        ) : (
          <div className="rounded-lg border border-border-soft bg-surface p-6 text-center">
            <p className="text-sm text-text-mid">
              No active projects. Northline is monitoring and maintaining{" "}
              {property.name}.
            </p>
          </div>
        )}
      </div>

      {completed.length > 0 ? <CompletedProjects projects={completed} /> : null}
    </main>
  );
}

function ProjectsHeader({
  property,
  activeCount,
  completedCount,
}: {
  property: Property;
  activeCount: number;
  completedCount: number;
}) {
  return (
    <div className="rounded-lg border border-border-soft bg-ink-1 p-5 sm:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-low">
        Projects
      </p>
      <h1 className="mt-3 font-display text-4xl leading-none tracking-tight text-text-hi sm:text-5xl">
        Projects &amp; installations
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-mid sm:text-base">
        What Northline is building and has delivered at {property.name}.{" "}
        {activeCount > 0
          ? `${activeCount} active · ${completedCount} completed.`
          : `${completedCount} completed.`}
      </p>
    </div>
  );
}

function ActiveProject({ project }: { project: Project }) {
  const lead = getTechnicianById(project.leadTechnicianId);
  const status = STATUS_META[project.status];
  const currentMilestone = project.milestones?.find(
    (milestone) => milestone.status === "in_progress",
  );
  const phaseLabel = currentMilestone?.label ?? status.label;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface">
      {project.heroImage ? (
        <div className="relative aspect-[16/7] w-full">
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            fill
            priority
            sizes="(max-width: 1100px) 100vw, 1040px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-0 via-ink-0/85 to-ink-0/25" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
            <span className="rounded-md bg-ink-0/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-hi backdrop-blur-sm">
              Active project
            </span>
            <StatusPill tone={status.tone}>{status.label}</StatusPill>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-text-hi sm:text-4xl">
              {project.title}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text-mid sm:text-base">
              {project.summary}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4 border-b border-border-soft p-5 sm:p-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-low">
              Active project
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-text-hi">
              {project.title}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm text-text-mid">
              {project.summary}
            </p>
          </div>
          <StatusPill tone={status.tone}>{status.label}</StatusPill>
        </div>
      )}

      <div className="space-y-7 p-5 sm:p-6 lg:p-8">
        {typeof project.progressPercent === "number" ? (
          <ProgressBar percent={project.progressPercent} phase={phaseLabel} />
        ) : null}

        <div className="grid gap-3 border-y border-border-soft py-4 sm:grid-cols-3">
          <Fact label="Project lead" value={technicianLabel(lead)} />
          <Fact label="Started" value={formatDate(project.startedOn, "long")} />
          <Fact
            label="Target completion"
            value={
              project.expectedCompletion
                ? formatDate(project.expectedCompletion, "long")
                : "To be confirmed"
            }
          />
        </div>

        {project.detail ? (
          <div className="max-w-3xl">
            <p className="text-sm leading-7 text-text-mid sm:text-base">
              {project.detail}
            </p>
            <Link
              href={`/portal/devices?p=${project.propertyId}`}
              prefetch={false}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-soft transition-colors hover:text-accent-bright"
            >
              View installed devices
              <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
            </Link>
          </div>
        ) : null}

        {project.photoStrip && project.photoStrip.length > 0 ? (
          <PhotoStrip images={project.photoStrip} />
        ) : null}

        <div className="grid gap-8 lg:grid-cols-2">
          {project.milestones && project.milestones.length > 0 ? (
            <MilestoneTimeline milestones={project.milestones} />
          ) : null}
          {project.updates && project.updates.length > 0 ? (
            <UpdatesFeed updates={project.updates} />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ProgressBar({ percent, phase }: { percent: number; phase: string }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-text-hi">{phase}</span>
        <span className="font-mono text-sm text-text-mid">{clamped}% complete</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full border border-border-soft bg-bg-0"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Project progress: ${clamped}% complete, currently in ${phase}.`}
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-low">{label}</p>
      <p className="mt-1 text-sm font-medium text-text-hi">{value}</p>
    </div>
  );
}

function PhotoStrip({ images }: { images: ProjectImage[] }) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-text-low">
        Progress photos
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image) => (
          <figure key={image.src + image.alt}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border-soft">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, 320px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-1.5 text-xs leading-5 text-text-low">
              {image.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function MilestoneTimeline({
  milestones,
}: {
  milestones: ProjectMilestone[];
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-text-low">
        Milestones
      </p>
      <ol>
        {milestones.map((milestone, index) => {
          const meta = MILESTONE_META[milestone.status];
          const Icon = meta.icon;
          const isLast = index === milestones.length - 1;
          return (
            <li key={milestone.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute bottom-0 left-[11px] top-6 w-px bg-border-soft"
                  aria-hidden
                />
              ) : null}
              <Icon
                size={22}
                strokeWidth={1.8}
                className={cn("z-10 shrink-0 bg-surface", meta.iconClass)}
                aria-hidden
              />
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      milestone.status === "pending"
                        ? "text-text-low"
                        : "text-text-hi",
                    )}
                  >
                    {milestone.label}
                  </p>
                  {milestone.status === "in_progress" ? (
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold">
                      In progress
                    </span>
                  ) : null}
                </div>
                {milestone.date ? (
                  <p className="mt-0.5 font-mono text-xs text-text-low">
                    {formatDate(milestone.date, "long")}
                  </p>
                ) : null}
                {milestone.note ? (
                  <p className="mt-1 text-sm leading-6 text-text-mid">
                    {milestone.note}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function UpdatesFeed({ updates }: { updates: ProjectUpdate[] }) {
  return (
    <div>
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-text-low">
        Recent updates
      </p>
      <ol className="space-y-4">
        {updates.map((update) => {
          const author = update.authorTechnicianId
            ? getTechnicianById(update.authorTechnicianId)
            : undefined;
          return (
            <li key={update.id} className="relative border-l border-border-soft pl-4">
              <span
                className="absolute -left-[3px] top-1.5 size-1.5 rounded-full bg-border-strong"
                aria-hidden
              />
              <p className="text-sm leading-6 text-text-mid">{update.body}</p>
              <p className="mt-1 font-mono text-xs text-text-low">
                {formatDate(update.date, "long")}
                {author ? ` · ${technicianLabel(author)}` : ""}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CompletedProjects({ projects }: { projects: Project[] }) {
  return (
    <section className="mt-10" aria-labelledby="completed-projects">
      <h2
        id="completed-projects"
        className="mb-4 text-sm font-medium text-text-mid"
      >
        Completed projects
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <CompletedCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function CompletedCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-lg border border-border-soft bg-surface">
      {project.thumbnail ? (
        <div className="relative aspect-video w-full">
          <Image
            src={project.thumbnail.src}
            alt={project.thumbnail.alt}
            fill
            sizes="(max-width: 640px) 100vw, 520px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-0/40 to-transparent" />
        </div>
      ) : null}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium text-text-hi">{project.title}</h3>
          <StatusPill tone="muted" className="shrink-0">
            Completed
          </StatusPill>
        </div>
        <p className="mt-1 font-mono text-xs text-text-low">
          {project.completedOn
            ? `Completed ${formatDate(project.completedOn, "long")}`
            : "Completed"}
        </p>
        {project.outcome ? (
          <p className="mt-2 text-sm leading-6 text-text-mid">{project.outcome}</p>
        ) : null}
      </div>
    </article>
  );
}

function technicianLabel(technician?: Technician): string {
  if (!technician) return "Northline";
  return `${technician.firstName} ${technician.lastInitial}.`;
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

type PillTone = "healthy" | "notice" | "warning" | "muted";

const STATUS_META: Record<ProjectStatus, { label: string; tone: PillTone }> = {
  in_progress: { label: "In progress", tone: "healthy" },
  commissioning: { label: "Commissioning", tone: "notice" },
  on_hold: { label: "On hold", tone: "warning" },
  completed: { label: "Completed", tone: "muted" },
};

const MILESTONE_META: Record<
  ProjectMilestone["status"],
  { icon: typeof CheckCircle2; iconClass: string }
> = {
  done: { icon: CheckCircle2, iconClass: "text-accent" },
  in_progress: { icon: CircleDot, iconClass: "text-gold" },
  pending: { icon: Circle, iconClass: "text-text-low" },
  blocked: { icon: CircleAlert, iconClass: "text-signal-warm" },
};
