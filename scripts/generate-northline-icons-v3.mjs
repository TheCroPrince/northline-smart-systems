import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "brand-icons", "northline-v3");
const SVG_DIR = path.join(OUT_DIR, "svg");
const PNG_DIR = path.join(OUT_DIR, "png");

const SIZE = 1024;
const STROKE = 34;

const themes = {
  transparent: {
    suffix: "",
    background: null,
    primary: "#f3eede",
    secondary: "#9f998a",
    quiet: "#49463b",
    accent: "#69dac4",
    accentDeep: "#2f9f8a",
    nodeInner: "#0c0b08",
  },
  dark: {
    suffix: "-dark",
    background: "#0c0b08",
    primary: "#f3eede",
    secondary: "#9f998a",
    quiet: "#49463b",
    accent: "#69dac4",
    accentDeep: "#2f9f8a",
    nodeInner: "#0c0b08",
  },
  light: {
    suffix: "-light",
    background: "#f3eede",
    primary: "#11100c",
    secondary: "#5c574a",
    quiet: "#d3cbb7",
    accent: "#1f8d7a",
    accentDeep: "#2f9f8a",
    nodeInner: "#f3eede",
  },
};

const icons = [
  {
    slug: "smart-home-integration",
    title: "Smart Home Integration",
    desc: "A unified living environment with technology resolved into the architecture.",
    draw: smartHomeIntegration,
  },
  {
    slug: "surveillance-security",
    title: "Surveillance and Security",
    desc: "Quiet perimeter awareness and controlled visibility without aggressive security symbolism.",
    draw: surveillanceSecurity,
  },
  {
    slug: "ev-charging",
    title: "EV Charging",
    desc: "Charging as an integrated architectural utility, not a device illustration.",
    draw: evCharging,
  },
  {
    slug: "intelligent-automation",
    title: "Intelligent Automation",
    desc: "A signature ambient mark for silent orchestration between conditions, systems, and spaces.",
    draw: intelligentAutomation,
  },
  {
    slug: "commercial-networking",
    title: "Commercial Networking",
    desc: "Commercial connectivity as hidden pathways through a composed building plan.",
    draw: commercialNetworking,
  },
  {
    slug: "remote-monitoring",
    title: "Remote Monitoring",
    desc: "Continuous system awareness expressed as calm operational oversight.",
    draw: remoteMonitoring,
  },
  {
    slug: "structured-cabling",
    title: "Structured Cabling",
    desc: "Disciplined pathways that are planned, aligned, and concealed.",
    draw: structuredCabling,
  },
  {
    slug: "managed-systems",
    title: "Managed Systems",
    desc: "Long-term stewardship and lifecycle ownership around the built environment.",
    draw: managedSystems,
  },
  {
    slug: "northline-signature",
    title: "Northline Signature Icon",
    desc: "A timeless symbolic mark for integration, architecture, intelligence, and trust.",
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
    rectEl(318, 318, 388, 388, t.primary, { rx: 126 }),
    lineEl(512, 360, 512, 664, t.secondary, { strokeWidth: 28, opacity: 0.72 }),
    lineEl(360, 512, 664, 512, t.secondary, { strokeWidth: 28, opacity: 0.72 }),
    circleEl(512, 512, 62, t.accent, { strokeWidth: 30 }),
    circleEl(512, 512, 17, t.primary, { fill: t.nodeInner, strokeWidth: 16 }),
  ].join("\n");
}

function surveillanceSecurity(t) {
  return [
    rectEl(304, 342, 416, 340, t.primary, { rx: 118 }),
    pathEl("M 352 520 C 444 438 580 438 672 520", t.accent, { strokeWidth: 32 }),
    pathEl("M 352 520 C 444 602 580 602 672 520", t.secondary, { strokeWidth: 32, opacity: 0.86 }),
    lineEl(512, 342, 512, 276, t.secondary, { strokeWidth: 28, opacity: 0.72 }),
    dot(672, 520, 14, t.primary),
  ].join("\n");
}

function evCharging(t) {
  return [
    rectEl(386, 254, 252, 404, t.primary, { rx: 92 }),
    pathEl("M 470 520 L 526 432 H 488 L 554 330", t.accent, { strokeWidth: 34 }),
    pathEl("M 638 464 C 726 464 782 530 782 614 C 782 704 714 760 622 760", t.accent, { strokeWidth: 34 }),
    lineEl(386, 760, 622, 760, t.primary),
    lineEl(458, 360, 550, 360, t.secondary, { strokeWidth: 28, opacity: 0.78 }),
  ].join("\n");
}

function intelligentAutomation(t) {
  return [
    pathEl("M 512 250 C 512 374 610 414 724 392", t.accent, { strokeWidth: 36 }),
    pathEl("M 774 512 C 650 512 610 610 632 724", t.primary, { strokeWidth: 36 }),
    pathEl("M 512 774 C 512 650 414 610 300 632", t.accent, { strokeWidth: 36 }),
    pathEl("M 250 512 C 374 512 414 414 392 300", t.primary, { strokeWidth: 36 }),
    circleEl(512, 512, 72, t.secondary, { strokeWidth: 28, opacity: 0.72 }),
    circleEl(512, 512, 18, t.accent, { fill: t.nodeInner, strokeWidth: 30 }),
  ].join("\n");
}

function commercialNetworking(t) {
  return [
    rectEl(306, 338, 412, 348, t.primary, { rx: 116 }),
    pathEl("M 364 430 H 506 C 600 430 662 482 662 512", t.accent, { strokeWidth: 32 }),
    pathEl("M 364 594 H 506 C 600 594 662 542 662 512", t.accent, { strokeWidth: 32 }),
    lineEl(512, 338, 512, 686, t.secondary, { strokeWidth: 28, opacity: 0.68 }),
    lineEl(364, 512, 662, 512, t.secondary, { strokeWidth: 28, opacity: 0.68 }),
  ].join("\n");
}

function remoteMonitoring(t) {
  return [
    rectEl(306, 348, 412, 328, t.primary, { rx: 108 }),
    pathEl("M 364 548 C 430 500 484 588 548 536 S 648 496 704 548", t.accent, { strokeWidth: 32 }),
    circleEl(620, 448, 58, t.secondary, { strokeWidth: 28, opacity: 0.86 }),
    pathEl("M 620 408 V 448 H 662", t.accent, { strokeWidth: 28 }),
    lineEl(364, 440, 456, 440, t.secondary, { strokeWidth: 26, opacity: 0.78 }),
  ].join("\n");
}

function structuredCabling(t) {
  return [
    lineEl(330, 344, 330, 680, t.secondary, { strokeWidth: 28, opacity: 0.86 }),
    lineEl(694, 344, 694, 680, t.secondary, { strokeWidth: 28, opacity: 0.86 }),
    pathEl("M 330 398 H 454 C 552 398 552 512 650 512 H 694", t.primary, { strokeWidth: 34 }),
    pathEl("M 330 512 H 694", t.primary, { strokeWidth: 34 }),
    pathEl("M 330 626 H 454 C 552 626 552 512 650 512", t.accent, { strokeWidth: 34 }),
    dot(330, 398, 12, t.accent),
    dot(330, 512, 12, t.accent),
    dot(330, 626, 12, t.accent),
  ].join("\n");
}

function managedSystems(t) {
  return [
    pathEl("M 512 244 C 654 244 774 364 774 512 C 774 624 706 720 610 760", t.accent, { strokeWidth: 34 }),
    pathEl("M 512 780 C 370 780 250 660 250 512 C 250 400 318 304 414 264", t.accent, { strokeWidth: 34 }),
    rectEl(398, 350, 228, 324, t.primary, { rx: 86 }),
    lineEl(458, 450, 566, 450, t.secondary, { strokeWidth: 26, opacity: 0.82 }),
    lineEl(458, 512, 566, 512, t.quiet, { strokeWidth: 26, opacity: 0.74 }),
    circleEl(512, 584, 36, t.secondary, { strokeWidth: 26 }),
    dot(610, 760, 14, t.accent),
  ].join("\n");
}

function northlineSignature(t) {
  return [
    pathEl("M 512 226 L 736 358 V 666 L 512 798 L 288 666 V 358 Z", t.primary, { strokeWidth: 36 }),
    pathEl("M 388 438 L 512 512 L 636 438", t.accent, { strokeWidth: 34 }),
    pathEl("M 388 586 L 512 512 L 636 586", t.accent, { strokeWidth: 34 }),
    lineEl(512, 344, 512, 680, t.primary, { strokeWidth: 34 }),
    lineEl(288, 512, 388, 512, t.secondary, { strokeWidth: 32, opacity: 0.82 }),
    lineEl(636, 512, 736, 512, t.secondary, { strokeWidth: 32, opacity: 0.82 }),
    circleEl(512, 512, 17, t.accent, { fill: t.nodeInner, strokeWidth: 30 }),
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
  const darkCards = icons.map((icon) => svgCard(icon, "dark")).join("\n");
  const lightCards = icons.map((icon) => svgCard(icon, "light")).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Northline Icon System V3</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0c0b08;
      --text: #f3eede;
      --muted: #9f998a;
      --accent: #69dac4;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 15px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main { width: min(1440px, calc(100% - 48px)); margin: 0 auto; padding: 56px 0 72px; }
    header { display: flex; justify-content: space-between; gap: 24px; align-items: end; margin-bottom: 44px; }
    h1 { margin: 0; font-size: clamp(32px, 5vw, 64px); line-height: 1; letter-spacing: -0.02em; font-family: Georgia, serif; font-weight: 500; }
    h1 em { color: var(--accent); font-weight: 400; }
    .meta { max-width: 560px; color: var(--muted); }
    h2 { margin: 14px 0 2px; font-size: 14px; font-weight: 600; }
    p { margin: 0; color: var(--muted); font-size: 12px; }
    section + section { margin-top: 64px; }
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
      <h1>Northline <em>icon system V3</em></h1>
      <p class="meta">A thinner, quieter, more premium icon family for invisible building technology and intelligent environments.</p>
    </header>
    <section>
      <h2>Dark Background Versions</h2>
      <div class="grid">${darkCards}</div>
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
    name: "Northline Smart Systems Icon System V3",
    canvas: `${SIZE}x${SIZE}`,
    strokeWidth: STROKE,
    designNotes: [
      "More premium and less pictographic than V2",
      "No outer brackets or decorative framing",
      "Thinner monoline geometry with larger negative space",
      "Reduced literal hardware references",
      "Built for luxury residential integration and premium commercial systems",
    ],
    colors: {
      ink: "#0c0b08",
      warmCream: "#f3eede",
      accentBright: "#69dac4",
      accent: "#2f9f8a",
      warmGray: "#9f998a",
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
