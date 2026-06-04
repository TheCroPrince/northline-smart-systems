import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Northline is a portfolio demonstration site (noindex sitewide), so there are
  // no URLs to advertise for indexing. The sitemap is intentionally empty; the
  // route is kept so robots.txt's Sitemap reference resolves with a valid 200.
  return [];
}
