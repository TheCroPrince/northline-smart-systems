/**
 * Central site config — single source of truth for canonical URL, names, and
 * launch copy used across metadata, sitemap, robots, manifest, and JSON-LD.
 *
 * `NEXT_PUBLIC_SITE_URL` lets the deploy override the canonical base without a
 * code change (set it in the hosting env). The default is a placeholder domain
 * to swap before go-live.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://northlinesmartsystems.com";

export const siteConfig = {
  name: "Northline Smart Systems",
  shortName: "Northline",
  url: siteUrl,
  /** Customer-facing positioning line. */
  tagline: "Premium smart-property systems for homes and commercial properties.",
  /** Default meta description — specific, not keyword-stuffed. */
  description:
    "Northline designs, installs, and supports premium smart-property systems for homes and commercial spaces, including access control, surveillance, automation, networking, monitoring, and client portal visibility.",
  /** Honest, non-stuffed keyword set. */
  keywords: [
    "smart property systems",
    "smart home integration",
    "access control",
    "surveillance and security",
    "home and building automation",
    "commercial networking",
    "EV charging",
    "remote monitoring",
    "client portal",
  ],
  locale: "en_US",
  /** Markets the site copy already commits to. */
  serviceAreas: ["Canada", "United States"],
} as const;
