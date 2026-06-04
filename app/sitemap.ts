import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // Only indexable marketing surfaces belong in the sitemap. Portal routes are
  // noindex (see app/portal/layout.tsx), so they are intentionally excluded.
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
