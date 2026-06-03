/**
 * Time helpers. Source of truth: MOCK_DATA_SCHEMA §1.2.
 *
 * Two regimes:
 *  - Relative offsets (`secondsAgo`) for things that should feel "current"
 *    on every page load. Resolved once at render.
 *  - Absolute ISO strings for stable historical or scheduled dates.
 *
 * North American convention: 12-hour AM/PM, "May 22, 2026" style dates.
 * Relative timestamps resolve once; they do not tick.
 */

export interface ResolvedTime {
  /** ISO 8601 timestamp the relative offset resolves to. */
  iso: string;
  /** Human-readable display string ("3 minutes ago", "yesterday", "May 22, 2026"). */
  display: string;
}

/**
 * Resolve a `secondsAgo` offset to an ISO timestamp and a display string,
 * relative to `now` (defaults to the current moment).
 */
export function resolveRelative(
  secondsAgo: number,
  now: Date = new Date(),
): ResolvedTime {
  const target = new Date(now.getTime() - secondsAgo * 1000);
  return {
    iso: target.toISOString(),
    display: formatRelativeDisplay(secondsAgo, target, now),
  };
}

/**
 * Format an ISO date string. Two styles:
 *  - "short": "May 22"
 *  - "long":  "May 22, 2026"  (default)
 */
export function formatDate(
  iso: string,
  style: "short" | "long" = "long",
): string {
  const date = parseDate(iso);
  if (style === "short") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a time-of-day in 12-hour AM/PM, e.g., "4:12 PM".
 * Exposed for surfaces that show clock time (event log absolute fallbacks,
 * support thread timestamps).
 */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Local calendar date `daysAhead` from `now`, as a "YYYY-MM-DD" string. Keeps
 * scheduled items (visits, maintenance) in the near future so the demo never
 * shows a "next visit" in the past as the reference date drifts.
 */
export function upcomingDate(now: Date, daysAhead: number): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysAhead);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * Local datetime `daysAhead` from `now` at `hour:minute`, as a tz-less
 * "YYYY-MM-DDTHH:mm:00" string that `formatTime` renders back at the same
 * wall-clock time. Used for recurring automation next-run times.
 */
export function upcomingDateTime(
  now: Date,
  daysAhead: number,
  hour: number,
  minute: number,
): string {
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${upcomingDate(now, daysAhead)}T${hh}:${mm}:00`;
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function parseDate(iso: string): Date {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return new Date(iso);
}

function formatRelativeDisplay(
  secondsAgo: number,
  target: Date,
  now: Date,
): string {
  if (secondsAgo < 0) return formatDate(target.toISOString(), "long");
  if (secondsAgo < 45) return "just now";
  if (secondsAgo < 90) return "1 minute ago";

  if (secondsAgo < 3600) {
    const minutes = Math.round(secondsAgo / 60);
    return `${minutes} minutes ago`;
  }

  if (secondsAgo < 86_400) {
    const hours = Math.round(secondsAgo / 3600);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  // 24h+: check for "yesterday" before falling back to absolute date.
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (target.toDateString() === yesterday.toDateString()) {
    return "yesterday";
  }

  return formatDate(target.toISOString(), "long");
}
