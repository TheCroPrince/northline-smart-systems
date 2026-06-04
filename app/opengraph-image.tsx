import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social/OG card — generated at build with next/og. Dark-warm Northline stage:
 * the signature mark + wordmark, the positioning line, and the service line.
 * Uses the default font (no custom-font fetch) to keep the build self-contained.
 */
export default async function OpengraphImage() {
  const markData = await readFile(
    join(process.cwd(), "public/brand-icons/northline-v4/png/northline-signature.png"),
    "base64",
  );
  const markSrc = `data:image/png;base64,${markData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 84px",
          background: "#14130f",
          backgroundImage:
            "radial-gradient(900px 420px at 50% -8%, rgba(52,179,154,0.22), transparent 70%)",
          color: "#f3eede",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={84} height={84} alt="" />
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", fontSize: 38 }}>
            <span style={{ letterSpacing: "0.5px" }}>Northline</span>
            <span style={{ color: "#5fd6bb", fontStyle: "italic" }}>smart systems</span>
          </div>
        </div>

        {/* Proposition */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, maxWidth: 960 }}>
            Premium smart-property systems.
          </div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, color: "#aca695", maxWidth: 880 }}>
            Access control, surveillance, automation, networking, monitoring, and
            client portal visibility — for homes and commercial properties.
          </div>
        </div>

        {/* Footing */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: 24, color: "#7d7868" }}>
          <span>Designed · Installed · Monitored</span>
          <span style={{ color: "#5fd6bb" }}>·</span>
          <span>Canada &amp; United States</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
