import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "brand-icons", "northline");
const SVG_DIR = path.join(OUT_DIR, "svg");
const PNG_DIR = path.join(OUT_DIR, "png");

const SIZE = 1024;
const STROKE = 48;

const themes = {
  transparent: {
    suffix: "",
    background: null,
    primary: "#f3eede",
    secondary: "#aca695",
    quiet: "#4a4636",
    accent: "#5fd6bb",
    accentDeep: "#34b39a",
    surface: "#201e17",
    nodeInner: "#0c0b08",
  },
  dark: {
    suffix: "-dark",
    background: "#0c0b08",
    primary: "#f3eede",
    secondary: "#aca695",
    quiet: "#4a4636",
    accent: "#5fd6bb",
    accentDeep: "#34b39a",
    surface: "#15140e",
    nodeInner: "#0c0b08",
  },
  light: {
    suffix: "-light",
    background: "#f3eede",
    primary: "#15140e",
    secondary: "#4a4636",
    quiet: "#d6cdb8",
    accent: "#1f8f7d",
    accentDeep: "#34b39a",
    surface: "#fffaf0",
    nodeInner: "#f3eede",
  },
};

const icons = [
  {
    slug: "smart-home-integration",
    title: "Smart Home Integration",
    desc: "Unified architectural system paths for lighting, climate, audio, shades, and control.",
    draw: smartHomeIntegration,
  },
  {
    slug: "surveillance-security",
    title: "Surveillance and Security",
    desc: "Protected perimeter, controlled access, and calm system awareness.",
    draw: surveillanceSecurity,
  },
  {
    slug: "ev-charging",
    title: "EV Charging",
    desc: "Elegant charging infrastructure integrated into a property plan.",
    draw: evCharging,
  },
  {
    slug: "intelligent-automation",
    title: "Intelligent Automation",
    desc: "Flagship orchestration mark showing silent event-driven system communication.",
    draw: intelligentAutomation,
  },
  {
    slug: "commercial-networking",
    title: "Commercial Networking",
    desc: "Structured enterprise connectivity and backbone pathways.",
    draw: commercialNetworking,
  },
  {
    slug: "remote-monitoring",
    title: "Remote Monitoring",
    desc: "Operational oversight, diagnostics, and continuous system health awareness.",
    draw: remoteMonitoring,
  },
  {
    slug: "structured-cabling",
    title: "Structured Cabling",
    desc: "Engineered cable routing, pathways, and organized terminations.",
    draw: structuredCabling,
  },
  {
    slug: "managed-systems",
    title: "Managed Systems",
    desc: "Continuous stewardship and lifecycle support around installed systems.",
    draw: managedSystems,
  },
  {
    slug: "northline-signature",
    title: "Northline Signature Icon",
    desc: "Symbolic brand mark for integrated architecture, intelligence, reliability, and trust.",
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
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}" stroke-linecap="${extra.linecap ?? "round"}" stroke-linejoin="${extra.linejoin ?? "round"}"${attrs(
    {
      opacity: extra.opacity,
      "stroke-dasharray": extra.dasharray,
      "stroke-dashoffset": extra.dashoffset,
    },
  )}/>`;
}

function lineEl(x1, y1, x2, y2, color, extra = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}" stroke-linecap="${extra.linecap ?? "round"}"${attrs(
    {
      opacity: extra.opacity,
      "stroke-dasharray": extra.dasharray,
    },
  )}/>`;
}

function rectEl(x, y, width, height, color, extra = {}) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${extra.rx ?? 0}" ry="${extra.ry ?? extra.rx ?? 0}" fill="${extra.fill ?? "none"}" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}"${attrs(
    {
      opacity: extra.opacity,
      "stroke-dasharray": extra.dasharray,
    },
  )}/>`;
}

function circleEl(cx, cy, r, color, extra = {}) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${extra.fill ?? "none"}" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}"${attrs(
    {
      opacity: extra.opacity,
      "stroke-dasharray": extra.dasharray,
    },
  )}/>`;
}

function dot(cx, cy, r, fill, stroke, strokeWidth = 0) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}"` : ""}/>`;
}

function planCorners(t, inset = 174, length = 154, gap = 0) {
  const right = SIZE - inset;
  const bottom = SIZE - inset;
  const left = inset;
  const top = inset;
  const longLeft = left + length;
  const longRight = right - length;
  const longTop = top + length;
  const longBottom = bottom - length;

  return [
    pathEl(`M ${left + gap} ${top} H ${longLeft}`, t.quiet, { opacity: 0.7 }),
    pathEl(`M ${left} ${top + gap} V ${longTop}`, t.quiet, { opacity: 0.7 }),
    pathEl(`M ${right - gap} ${top} H ${longRight}`, t.quiet, { opacity: 0.7 }),
    pathEl(`M ${right} ${top + gap} V ${longTop}`, t.quiet, { opacity: 0.7 }),
    pathEl(`M ${left + gap} ${bottom} H ${longLeft}`, t.quiet, { opacity: 0.7 }),
    pathEl(`M ${left} ${bottom - gap} V ${longBottom}`, t.quiet, { opacity: 0.7 }),
    pathEl(`M ${right - gap} ${bottom} H ${longRight}`, t.quiet, { opacity: 0.7 }),
    pathEl(`M ${right} ${bottom - gap} V ${longBottom}`, t.quiet, { opacity: 0.7 }),
  ].join("\n");
}

function renderSvg(icon, themeName) {
  const t = themes[themeName];
  const background = t.background
    ? `<rect width="${SIZE}" height="${SIZE}" fill="${t.background}"/>`
    : "";
  const artwork = icon.draw(t);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-labelledby="${icon.slug}-title ${icon.slug}-desc">
  <title id="${icon.slug}-title">${escapeXml(icon.title)}</title>
  <desc id="${icon.slug}-desc">${escapeXml(icon.desc)}</desc>
  ${background}
  <g id="${icon.slug}" fill="none">
${artwork}
  </g>
</svg>
`;
}

function smartHomeIntegration(t) {
  return [
    planCorners(t),
    rectEl(338, 338, 348, 348, t.primary, { rx: 38 }),
    lineEl(512, 338, 512, 686, t.quiet, { opacity: 0.62 }),
    lineEl(338, 512, 686, 512, t.quiet, { opacity: 0.62 }),
    pathEl("M 256 312 H 338", t.primary),
    pathEl("M 686 312 H 768", t.primary),
    pathEl("M 256 712 H 338", t.primary),
    pathEl("M 686 712 H 768", t.primary),
    pathEl("M 312 256 V 338", t.primary),
    pathEl("M 712 256 V 338", t.primary),
    pathEl("M 312 686 V 768", t.primary),
    pathEl("M 712 686 V 768", t.primary),
    circleEl(512, 512, 64, t.accent, { strokeWidth: STROKE }),
    dot(512, 512, 24, t.accent),
    lineEl(428, 428, 456, 428, t.secondary, { strokeWidth: 32 }),
    lineEl(596, 428, 596, 456, t.secondary, { strokeWidth: 32 }),
    pathEl("M 425 609 C 445 590 474 590 494 609", t.secondary, { strokeWidth: 30 }),
    pathEl("M 592 616 H 636", t.secondary, { strokeWidth: 30 }),
    dot(312, 312, 20, t.accent),
    dot(712, 312, 20, t.accent),
    dot(312, 712, 20, t.accent),
    dot(712, 712, 20, t.accent),
  ].join("\n");
}

function surveillanceSecurity(t) {
  return [
    planCorners(t),
    rectEl(246, 248, 532, 532, t.primary, { rx: 62 }),
    pathEl("M 246 438 H 158 V 586 H 246", t.secondary),
    pathEl("M 778 438 H 866 V 586 H 778", t.secondary),
    lineEl(512, 248, 512, 180, t.secondary),
    lineEl(512, 780, 512, 844, t.secondary),
    pathEl("M 322 642 C 404 542 520 477 702 430", t.accent),
    pathEl("M 322 382 C 404 482 520 547 702 594", t.accent, { opacity: 0.82 }),
    lineEl(390, 512, 634, 512, t.quiet, { opacity: 0.85 }),
    dot(322, 382, 18, t.accent),
    dot(322, 642, 18, t.accent),
    dot(702, 430, 18, t.primary),
    dot(702, 594, 18, t.primary),
    pathEl("M 406 250 V 330", t.primary),
    pathEl("M 618 694 V 778", t.primary),
  ].join("\n");
}

function evCharging(t) {
  return [
    planCorners(t),
    rectEl(342, 220, 260, 430, t.primary, { rx: 52 }),
    pathEl("M 422 324 H 522", t.secondary, { strokeWidth: 36 }),
    pathEl("M 422 414 H 522", t.secondary, { strokeWidth: 36 }),
    pathEl("M 602 408 H 696 C 746 408 776 440 776 490 V 612 C 776 680 730 724 660 724 H 602", t.accent),
    pathEl("M 512 650 V 790 H 760", t.primary),
    pathEl("M 280 790 H 512", t.primary),
    pathEl("M 682 694 V 790", t.quiet, { opacity: 0.78 }),
    rectEl(594, 666, 88, 116, t.secondary, { rx: 26, strokeWidth: 40 }),
    pathEl("M 422 540 L 476 470 H 434 L 494 376", t.accent, { strokeWidth: 42 }),
    dot(512, 790, 22, t.accent),
    dot(760, 790, 22, t.primary),
  ].join("\n");
}

function intelligentAutomation(t) {
  return [
    planCorners(t, 166, 164),
    rectEl(396, 396, 232, 232, t.primary, { rx: 42 }),
    pathEl("M 512 236 V 396", t.accent),
    pathEl("M 512 628 V 788", t.accent),
    pathEl("M 236 512 H 396", t.accent),
    pathEl("M 628 512 H 788", t.accent),
    pathEl("M 316 316 H 410 C 466 316 512 362 512 396", t.primary),
    pathEl("M 708 316 H 614 C 558 316 512 362 512 396", t.primary),
    pathEl("M 316 708 H 410 C 466 708 512 662 512 628", t.primary),
    pathEl("M 708 708 H 614 C 558 708 512 662 512 628", t.primary),
    pathEl("M 396 512 C 444 462 580 462 628 512", t.quiet, { opacity: 0.86 }),
    pathEl("M 396 512 C 444 562 580 562 628 512", t.quiet, { opacity: 0.86 }),
    dot(512, 236, 26, t.accent),
    dot(788, 512, 26, t.accent),
    dot(512, 788, 26, t.accent),
    dot(236, 512, 26, t.accent),
    dot(512, 512, 30, t.nodeInner, t.accent, 22),
  ].join("\n");
}

function commercialNetworking(t) {
  return [
    planCorners(t),
    rectEl(256, 266, 170, 492, t.primary, { rx: 34 }),
    lineEl(306, 386, 376, 386, t.secondary, { strokeWidth: 30 }),
    lineEl(306, 512, 376, 512, t.secondary, { strokeWidth: 30 }),
    lineEl(306, 638, 376, 638, t.secondary, { strokeWidth: 30 }),
    pathEl("M 426 386 H 588 V 270 H 778", t.accent),
    pathEl("M 426 512 H 778", t.accent),
    pathEl("M 426 638 H 588 V 754 H 778", t.accent),
    pathEl("M 588 386 V 638", t.quiet, { opacity: 0.8 }),
    rectEl(778, 218, 92, 104, t.primary, { rx: 24, strokeWidth: 40 }),
    rectEl(778, 460, 92, 104, t.primary, { rx: 24, strokeWidth: 40 }),
    rectEl(778, 702, 92, 104, t.primary, { rx: 24, strokeWidth: 40 }),
    dot(588, 386, 20, t.accent),
    dot(588, 512, 20, t.accent),
    dot(588, 638, 20, t.accent),
  ].join("\n");
}

function remoteMonitoring(t) {
  return [
    planCorners(t),
    rectEl(230, 278, 564, 468, t.primary, { rx: 58 }),
    pathEl("M 306 584 C 356 536 410 536 460 584 S 562 632 616 584 S 704 536 746 584", t.accent),
    pathEl("M 318 436 H 458", t.secondary, { strokeWidth: 34 }),
    pathEl("M 318 500 H 408", t.quiet, { strokeWidth: 34, opacity: 0.8 }),
    circleEl(654, 456, 84, t.secondary, { strokeWidth: 38 }),
    pathEl("M 654 382 V 456 H 718", t.accent, { strokeWidth: 36 }),
    pathEl("M 512 278 V 218", t.secondary),
    pathEl("M 512 746 V 806", t.secondary),
    dot(306, 584, 18, t.accent),
    dot(746, 584, 18, t.accent),
    dot(654, 456, 18, t.accent),
  ].join("\n");
}

function structuredCabling(t) {
  return [
    planCorners(t),
    pathEl("M 226 294 H 416 C 462 294 488 320 488 366 V 744", t.primary),
    pathEl("M 226 424 H 548 C 594 424 620 450 620 496 V 744", t.primary),
    pathEl("M 226 554 H 680 C 726 554 752 580 752 626 V 744", t.primary),
    pathEl("M 226 684 H 356 C 402 684 428 710 428 756", t.primary),
    pathEl("M 488 366 H 802", t.accent),
    pathEl("M 620 496 H 802", t.accent),
    pathEl("M 752 626 H 802", t.accent),
    pathEl("M 428 756 H 802", t.accent),
    rectEl(792, 326, 86, 82, t.secondary, { rx: 22, strokeWidth: 38 }),
    rectEl(792, 456, 86, 82, t.secondary, { rx: 22, strokeWidth: 38 }),
    rectEl(792, 586, 86, 82, t.secondary, { rx: 22, strokeWidth: 38 }),
    rectEl(792, 716, 86, 82, t.secondary, { rx: 22, strokeWidth: 38 }),
    lineEl(286, 294, 286, 684, t.quiet, { strokeWidth: 28, opacity: 0.72 }),
    dot(226, 294, 20, t.accent),
    dot(226, 424, 20, t.accent),
    dot(226, 554, 20, t.accent),
    dot(226, 684, 20, t.accent),
  ].join("\n");
}

function managedSystems(t) {
  return [
    planCorners(t),
    rectEl(370, 338, 284, 348, t.primary, { rx: 42 }),
    pathEl("M 430 438 H 594", t.secondary, { strokeWidth: 34 }),
    pathEl("M 430 512 H 594", t.secondary, { strokeWidth: 34 }),
    pathEl("M 430 586 H 536", t.quiet, { strokeWidth: 34, opacity: 0.78 }),
    pathEl("M 512 194 C 688 194 830 336 830 512 C 830 605 790 688 726 746", t.accent),
    pathEl("M 512 830 C 336 830 194 688 194 512 C 194 419 234 336 298 278", t.accent),
    pathEl("M 726 746 H 642 V 662", t.accent),
    pathEl("M 298 278 H 382 V 362", t.accent),
    dot(512, 194, 24, t.accent),
    dot(512, 830, 24, t.accent),
    dot(654, 512, 22, t.accent),
    circleEl(512, 512, 38, t.primary, { strokeWidth: 34 }),
  ].join("\n");
}

function northlineSignature(t) {
  return [
    pathEl("M 512 166 L 798 332 V 692 L 512 858 L 226 692 V 332 Z", t.primary),
    pathEl("M 512 286 L 694 392 V 632 L 512 738 L 330 632 V 392 Z", t.quiet, { opacity: 0.84 }),
    pathEl("M 330 392 L 512 498 L 694 392", t.accent),
    pathEl("M 330 632 L 512 526 L 694 632", t.accent),
    lineEl(512, 286, 512, 738, t.primary),
    lineEl(226, 512, 330, 512, t.primary),
    lineEl(694, 512, 798, 512, t.primary),
    dot(512, 512, 34, t.nodeInner, t.accent, 22),
    dot(512, 166, 24, t.accent),
    dot(226, 512, 22, t.accent),
    dot(798, 512, 22, t.accent),
    dot(512, 858, 24, t.accent),
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
  <title>Northline Icon System</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0c0b08;
      --panel: #14130f;
      --line: #37342a;
      --text: #f3eede;
      --muted: #aca695;
      --accent: #5fd6bb;
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
    .meta { max-width: 520px; color: var(--muted); }
    h2 { margin: 14px 0 2px; font-size: 14px; font-weight: 600; }
    p { margin: 0; color: var(--muted); font-size: 12px; }
    section + section { margin-top: 56px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; }
    article { min-width: 0; }
    .preview {
      display: grid;
      place-items: center;
      aspect-ratio: 1;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      background: #0c0b08;
    }
    .preview.light { background: #f3eede; }
    img { display: block; width: 100%; height: 100%; }
    code { color: var(--accent); }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Northline <em>icon system</em></h1>
      <p class="meta">Production SVG masters and 1024px PNG exports. Stroke, corner radius, and architectural path language are shared across the family.</p>
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
    name: "Northline Smart Systems Icon System",
    canvas: `${SIZE}x${SIZE}`,
    strokeWidth: STROKE,
    colors: {
      ink: "#0c0b08",
      warmCream: "#f3eede",
      accentBright: "#5fd6bb",
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
  const bg = t.background ?? "#0c0b08";
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
      background: bg,
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
      await sharp(Buffer.from(svg)).resize(SIZE, SIZE).png().toFile(path.join(PNG_DIR, `${baseName}.png`));
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
