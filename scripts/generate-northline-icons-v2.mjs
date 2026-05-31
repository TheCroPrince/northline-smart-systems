import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "brand-icons", "northline-v2");
const SVG_DIR = path.join(OUT_DIR, "svg");
const PNG_DIR = path.join(OUT_DIR, "png");

const SIZE = 1024;
const STROKE = 44;

const themes = {
  transparent: {
    suffix: "",
    background: null,
    primary: "#f3eede",
    secondary: "#aca695",
    quiet: "#4a4636",
    accent: "#57d1ba",
    accentDeep: "#34b39a",
    nodeInner: "#0c0b08",
  },
  dark: {
    suffix: "-dark",
    background: "#0c0b08",
    primary: "#f3eede",
    secondary: "#aca695",
    quiet: "#4a4636",
    accent: "#57d1ba",
    accentDeep: "#34b39a",
    nodeInner: "#0c0b08",
  },
  light: {
    suffix: "-light",
    background: "#f3eede",
    primary: "#14130f",
    secondary: "#5b5649",
    quiet: "#d8d0bd",
    accent: "#218f7c",
    accentDeep: "#34b39a",
    nodeInner: "#f3eede",
  },
};

const icons = [
  {
    slug: "smart-home-integration",
    title: "Smart Home Integration",
    desc: "A calm integrated environment for lighting, climate, audio, shades, and unified control.",
    draw: smartHomeIntegration,
  },
  {
    slug: "surveillance-security",
    title: "Surveillance and Security",
    desc: "A protected perimeter with controlled visibility and quiet awareness.",
    draw: surveillanceSecurity,
  },
  {
    slug: "ev-charging",
    title: "EV Charging",
    desc: "Refined charging infrastructure integrated into the property.",
    draw: evCharging,
  },
  {
    slug: "intelligent-automation",
    title: "Intelligent Automation",
    desc: "A signature mark for silent orchestration between building systems.",
    draw: intelligentAutomation,
  },
  {
    slug: "commercial-networking",
    title: "Commercial Networking",
    desc: "Premium commercial connectivity expressed as structured building pathways.",
    draw: commercialNetworking,
  },
  {
    slug: "remote-monitoring",
    title: "Remote Monitoring",
    desc: "Continuous operational awareness and health visibility.",
    draw: remoteMonitoring,
  },
  {
    slug: "structured-cabling",
    title: "Structured Cabling",
    desc: "Organized physical pathways that disappear into the architecture.",
    draw: structuredCabling,
  },
  {
    slug: "managed-systems",
    title: "Managed Systems",
    desc: "Long-term stewardship around the installed environment.",
    draw: managedSystems,
  },
  {
    slug: "northline-signature",
    title: "Northline Signature Icon",
    desc: "A symbolic mark for integrated architecture, intelligence, reliability, and trust.",
    draw: northlineSignature,
  },
];

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function attrs(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => ` ${key}="${String(value)}"`)
    .join("");
}

function pathEl(d, color, extra = {}) {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}" stroke-linecap="${extra.linecap ?? "round"}" stroke-linejoin="${extra.linejoin ?? "round"}"${attrs({
    opacity: extra.opacity,
    "stroke-dasharray": extra.dasharray,
    "stroke-dashoffset": extra.dashoffset,
  })}/>`;
}

function lineEl(x1, y1, x2, y2, color, extra = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}" stroke-linecap="${extra.linecap ?? "round"}"${attrs({
    opacity: extra.opacity,
    "stroke-dasharray": extra.dasharray,
  })}/>`;
}

function rectEl(x, y, width, height, color, extra = {}) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${extra.rx ?? 0}" ry="${extra.ry ?? extra.rx ?? 0}" fill="${extra.fill ?? "none"}" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}"${attrs({
    opacity: extra.opacity,
    "stroke-dasharray": extra.dasharray,
  })}/>`;
}

function circleEl(cx, cy, r, color, extra = {}) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${extra.fill ?? "none"}" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}"${attrs({
    opacity: extra.opacity,
    "stroke-dasharray": extra.dasharray,
  })}/>`;
}

function dot(cx, cy, r, fill, stroke, strokeWidth = 0) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}"` : ""}/>`;
}

function renderSvg(icon, themeName) {
  const t = themes[themeName];
  const background = t.background
    ? `<rect width="${SIZE}" height="${SIZE}" fill="${t.background}"/>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-labelledby="${icon.slug}-title ${icon.slug}-desc">
  <title id="${icon.slug}-title">${escapeXml(icon.title)}</title>
  <desc id="${icon.slug}-desc">${escapeXml(icon.desc)}</desc>
  ${background}
  <g id="${icon.slug}" fill="none">
${icon.draw(t)}
  </g>
</svg>
`;
}

function smartHomeIntegration(t) {
  return [
    rectEl(306, 306, 412, 412, t.primary, { rx: 104 }),
    pathEl("M 512 344 V 450", t.secondary, { strokeWidth: 36 }),
    pathEl("M 512 574 V 680", t.secondary, { strokeWidth: 36 }),
    pathEl("M 344 512 H 450", t.secondary, { strokeWidth: 36 }),
    pathEl("M 574 512 H 680", t.secondary, { strokeWidth: 36 }),
    circleEl(512, 512, 58, t.accent, { strokeWidth: 38 }),
    dot(512, 512, 18, t.accent),
    dot(512, 344, 18, t.primary),
    dot(680, 512, 18, t.primary),
  ].join("\n");
}

function surveillanceSecurity(t) {
  return [
    rectEl(286, 310, 452, 404, t.primary, { rx: 96 }),
    pathEl("M 360 548 C 446 468 566 430 666 454", t.accent),
    pathEl("M 360 476 C 446 556 566 594 666 570", t.secondary, { opacity: 0.9 }),
    lineEl(286, 512, 218, 512, t.secondary),
    lineEl(738, 512, 806, 512, t.secondary),
    lineEl(512, 310, 512, 242, t.secondary),
    dot(666, 454, 18, t.accent),
    dot(666, 570, 18, t.primary),
  ].join("\n");
}

function evCharging(t) {
  return [
    rectEl(374, 232, 254, 424, t.primary, { rx: 72 }),
    pathEl("M 456 352 H 546", t.secondary, { strokeWidth: 34 }),
    pathEl("M 458 520 L 522 426 H 482 L 556 320", t.accent, { strokeWidth: 42 }),
    pathEl("M 628 456 C 734 456 792 520 792 606 C 792 696 722 762 626 762 H 438", t.accent),
    lineEl(386, 762, 638, 762, t.primary),
    rectEl(594, 670, 82, 104, t.secondary, { rx: 28, strokeWidth: 34 }),
    dot(438, 762, 17, t.accent),
  ].join("\n");
}

function intelligentAutomation(t) {
  return [
    pathEl("M 512 228 C 512 360 612 410 730 410", t.accent),
    pathEl("M 796 512 C 664 512 614 612 614 730", t.primary),
    pathEl("M 512 796 C 512 664 412 614 294 614", t.accent),
    pathEl("M 228 512 C 360 512 410 412 410 294", t.primary),
    circleEl(512, 512, 92, t.secondary, { strokeWidth: 34, opacity: 0.82 }),
    circleEl(512, 512, 54, t.accent, { strokeWidth: 38 }),
    dot(512, 512, 20, t.nodeInner),
  ].join("\n");
}

function commercialNetworking(t) {
  return [
    rectEl(286, 314, 452, 396, t.primary, { rx: 94 }),
    lineEl(512, 314, 512, 710, t.secondary),
    pathEl("M 358 420 H 528 C 620 420 668 466 668 512", t.accent),
    pathEl("M 358 512 H 668", t.secondary),
    pathEl("M 358 604 H 528 C 620 604 668 558 668 512", t.accent),
    dot(668, 512, 18, t.accent),
  ].join("\n");
}

function remoteMonitoring(t) {
  return [
    rectEl(286, 314, 452, 396, t.primary, { rx: 90 }),
    pathEl("M 358 552 C 426 498 482 596 546 542 S 650 502 704 558", t.accent),
    circleEl(620, 448, 66, t.secondary, { strokeWidth: 36 }),
    pathEl("M 620 396 V 448 H 670", t.accent, { strokeWidth: 34 }),
    lineEl(358, 438, 458, 438, t.secondary, { strokeWidth: 32 }),
    lineEl(358, 494, 426, 494, t.quiet, { strokeWidth: 30, opacity: 0.82 }),
    dot(704, 558, 17, t.accent),
  ].join("\n");
}

function structuredCabling(t) {
  return [
    lineEl(304, 316, 304, 708, t.secondary, { strokeWidth: 34 }),
    pathEl("M 304 356 H 456 C 548 356 548 466 640 466 H 732", t.primary),
    pathEl("M 304 512 H 732", t.primary),
    pathEl("M 304 668 H 456 C 548 668 548 558 640 558 H 732", t.accent),
    lineEl(732, 424, 732, 600, t.secondary, { strokeWidth: 34 }),
    dot(304, 356, 17, t.accent),
    dot(304, 512, 17, t.accent),
    dot(304, 668, 17, t.accent),
  ].join("\n");
}

function managedSystems(t) {
  return [
    pathEl("M 512 222 C 668 222 794 348 794 512 C 794 620 736 716 648 768", t.accent),
    pathEl("M 512 802 C 356 802 230 676 230 512 C 230 404 288 308 376 256", t.accent),
    rectEl(390, 336, 244, 352, t.primary, { rx: 70 }),
    lineEl(452, 444, 574, 444, t.secondary, { strokeWidth: 32 }),
    lineEl(452, 512, 574, 512, t.quiet, { strokeWidth: 32, opacity: 0.78 }),
    circleEl(512, 584, 42, t.secondary, { strokeWidth: 32 }),
    dot(512, 584, 15, t.accent),
    dot(648, 768, 20, t.accent),
  ].join("\n");
}

function northlineSignature(t) {
  return [
    pathEl("M 512 208 L 752 350 V 674 L 512 816 L 272 674 V 350 Z", t.primary),
    pathEl("M 376 430 L 512 512 L 648 430", t.accent),
    pathEl("M 376 594 L 512 512 L 648 594", t.accent),
    lineEl(512, 326, 512, 698, t.primary),
    lineEl(272, 512, 376, 512, t.secondary),
    lineEl(648, 512, 752, 512, t.secondary),
    circleEl(512, 512, 52, t.accent, { strokeWidth: 38 }),
    dot(512, 512, 17, t.nodeInner),
  ].join("\n");
}

function svgCard(icon, variant) {
  const file = `svg/${icon.slug}${themes[variant].suffix}.svg`;
  return `<article>
  <div class="preview ${variant}">
    <img src="${file}" alt="${escapeXml(icon.title)} ${variant} SVG">
  </div>
  <h2>${escapeXml(icon.title)}</h2>
  <p>${escapeXml(icon.slug)}</p>
</article>`;
}

function previewHtml() {
  const cards = icons.map((icon) => svgCard(icon, "dark")).join("\n");
  const lightCards = icons.map((icon) => svgCard(icon, "light")).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Northline Icon System V2</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0c0b08;
      --line: #37342a;
      --text: #f3eede;
      --muted: #aca695;
      --accent: #57d1ba;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 15px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main { width: min(1440px, calc(100% - 48px)); margin: 0 auto; padding: 56px 0 72px; }
    header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 32px; }
    h1 { margin: 0; font-size: clamp(32px, 5vw, 64px); line-height: 1; letter-spacing: -0.02em; font-family: Georgia, serif; font-weight: 500; }
    h1 em { color: var(--accent); font-weight: 400; }
    .meta { max-width: 540px; color: var(--muted); }
    h2 { margin: 14px 0 2px; font-size: 14px; font-weight: 600; }
    p { margin: 0; color: var(--muted); font-size: 12px; }
    section + section { margin-top: 56px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; }
    .preview {
      display: grid;
      place-items: center;
      aspect-ratio: 1;
      overflow: hidden;
      background: #0c0b08;
    }
    .preview.light { background: #f3eede; }
    img { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Northline <em>icon system V2</em></h1>
      <p class="meta">A calmer luxury residential and commercial systems icon family. No outer brackets, fewer schematic details, and more negative space.</p>
    </header>
    <section>
      <h2>Dark Background Versions</h2>
      <div class="grid">${cards}</div>
    </section>
    <section>
      <h2>Light Background Versions</h2>
      <div class="grid">${lightCards}</div>
    </section>
  </main>
</body>
</html>
`;
}

async function writeManifest() {
  const manifest = {
    name: "Northline Smart Systems Icon System V2",
    canvas: `${SIZE}x${SIZE}`,
    strokeWidth: STROKE,
    designNotes: [
      "No outer corner brackets or decorative framing elements",
      "Reduced visual complexity versus V1",
      "Luxury residential integration and premium commercial systems tone",
      "SVG-first assets with transparent, dark, and light variants",
    ],
    colors: {
      ink: "#0c0b08",
      warmCream: "#f3eede",
      accentBright: "#57d1ba",
      accent: "#34b39a",
      warmGray: "#aca695",
    },
    icons: icons.map((icon) => ({
      slug: icon.slug,
      title: icon.title,
      svg: `svg/${icon.slug}.svg`,
      svgDark: `svg/${icon.slug}-dark.svg`,
      svgLight: `svg/${icon.slug}-light.svg`,
      pngTransparent: `png/${icon.slug}.png`,
      pngDark: `png/${icon.slug}-dark.png`,
      pngLight: `png/${icon.slug}-light.png`,
    })),
  };

  await fs.writeFile(path.join(OUT_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function createContactSheet(variant) {
  const t = themes[variant];
  const cell = 320;
  const gap = 32;
  const columns = 3;
  const rows = Math.ceil(icons.length / columns);
  const width = columns * cell + (columns + 1) * gap;
  const height = rows * cell + (rows + 1) * gap;
  const composites = await Promise.all(icons.map(async (icon, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    return {
      input: await sharp(Buffer.from(renderSvg(icon, variant)))
        .resize(cell, cell, { fit: "contain" })
        .png()
        .toBuffer(),
      left: gap + col * (cell + gap),
      top: gap + row * (cell + gap),
    };
  }));

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: t.background ?? "#0c0b08",
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(OUT_DIR, `contact-sheet-${variant}.png`));
}

async function main() {
  await fs.mkdir(SVG_DIR, { recursive: true });
  await fs.mkdir(PNG_DIR, { recursive: true });

  for (const icon of icons) {
    for (const themeName of Object.keys(themes)) {
      const theme = themes[themeName];
      const svg = renderSvg(icon, themeName);
      const baseName = `${icon.slug}${theme.suffix}`;
      await fs.writeFile(path.join(SVG_DIR, `${baseName}.svg`), svg);
      await sharp(Buffer.from(svg))
        .resize(SIZE, SIZE)
        .png()
        .toFile(path.join(PNG_DIR, `${baseName}.png`));
    }
  }

  await writeManifest();
  await fs.writeFile(path.join(OUT_DIR, "preview.html"), previewHtml());
  await createContactSheet("dark");
  await createContactSheet("light");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
