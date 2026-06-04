import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#14130f",
    theme_color: "#14130f",
    icons: [
      {
        src: "/brand-icons/northline-v4/svg/northline-signature-dark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/brand-icons/northline-v4/png/northline-signature-dark.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
