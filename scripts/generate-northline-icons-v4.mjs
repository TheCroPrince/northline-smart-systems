import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "brand-icons", "northline-v4");
const SVG_DIR = path.join(OUT_DIR, "svg");
const PNG_DIR = path.join(OUT_DIR, "png");

const SIZE = 1024;
const STROKE = 30;

const themes = {
  transparent: {
    suffix: "",
    background: null,
    primary: "#f3eede",
    secondary: "#958f80",
    quiet: "#454237",
    accent: "#72dec9",
    nodeInner: "#0c0b08",
  },
  dark: {
    suffix: "-dark",
    background: "#0c0b08",
    primary: "#f3eede",
    secondary: "#958f80",
    quiet: "#454237",
    accent: "#72dec9",
    nodeInner: "#0c0b08",
  },
  light: {
    suffix: "-light",
    background: "#f3eede",
    primary: "#11100c",
    secondary: "#686252",
    quiet: "#d1c8b4",
    accent: "#1c8877",
    nodeInner: "#f3eede",
  },
};

const icons = [
  {
    slug: "smart-home-integration",
    title: "Smart Home Integration",
    desc: "An integrated interior environment resolved into a single quiet control point.",
    draw: smartHomeIntegration,
  },
  {
    slug: "surveillance-security",
    title: "Surveillance and Security",
    desc: "Perimeter awareness, controlled visibility, and quiet protection.",
    draw: surveillanceSecurity,
  },
  {
    slug: "ev-charging",
    title: "EV Charging",
    desc: "Energy arriving as an architectural utility rather than a visible device.",
    draw: evCharging,
  },
  {
    slug: "intelligent-automation",
    title: "Intelligent Automation",
    desc: "A signature ambient mark for invisible orchestration throughout the environment.",
    draw: intelligentAutomation,
  },
  {
    slug: "commercial-networking",
    title: "Commercial Networking",
    desc: "Hidden communication pathways through a premium commercial property.",
    draw: commercialNetworking,
  },
  {
    slug: "remote-monitoring",
    title: "Remote Monitoring",
    desc: "Calm operational oversight and continuous system awareness.",
    draw: remoteMonitoring,
  },
  {
    slug: "structured-cabling",
    title: "Structured Cabling",
    desc: "Disciplined routing concealed behind the finished architecture.",
    draw: structuredCabling,
  },
  {
    slug: "managed-systems",
    title: "Managed Systems",
    desc: "Ongoing stewardship and lifecycle care around the installed environment.",
    draw: managedSystems,
  },
  {
    slug: "northline-signature",
    title: "Northline Signature Icon",
    desc: "A timeless symbolic mark for architecture, integration, intelligence, and trust.",
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
  })}/>`;
}

function lineEl(x1, y1, x2, y2, color, extra = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}" stroke-linecap="${extra.linecap ?? "round"}"${attrs({
    opacity: extra.opacity,
  })}/>`;
}

function circleEl(cx, cy, r, color, extra = {}) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${extra.fill ?? "none"}" stroke="${color}" stroke-width="${extra.strokeWidth ?? STROKE}"${attrs({
    opacity: extra.opacity,
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
    pathEl("M 344 358 C 344 330 366 308 394 308 H 630 C 658 308 680 330 680 358", t.primary),
    pathEl("M 680 666 C 680 694 658 716 630 716 H 394 C 366 716 344 694 344 666", t.primary),
    lineEl(512, 344, 512, 680, t.secondary, { opacity: 0.7 }),
    lineEl(344, 512, 680, 512, t.secondary, { opacity: 0.7 }),
    circleEl(512, 512, 56, t.accent, { strokeWidth: 28 }),
    dot(512, 512, 10, t.primary),
  ].join("\n");
}

function surveillanceSecurity(t) {
  return [
    pathEl("M 318 512 C 420 408 604 408 706 512", t.primary),
    pathEl("M 318 512 C 420 616 604 616 706 512", t.secondary, { opacity: 0.82 }),
    pathEl("M 402 512 C 466 458 558 458 622 512", t.accent),
    lineEl(512, 322, 512, 386, t.secondary, { opacity: 0.72 }),
    dot(706, 512, 12, t.accent),
  ].join("\n");
}

function evCharging(t) {
  return [
    pathEl("M 382 330 H 556 C 614 330 646 364 646 422 V 634", t.primary),
    pathEl("M 382 694 H 586 C 704 694 782 620 782 512 C 782 418 720 352 626 352", t.accent),
    pathEl("M 466 548 L 530 448 H 486 L 566 338", t.accent),
    lineEl(382, 694, 382, 330, t.secondary, { opacity: 0.72 }),
    lineEl(382, 694, 586, 694, t.primary),
  ].join("\n");
}

function intelligentAutomation(t) {
  return [
    pathEl("M 512 246 C 512 370 604 424 728 398", t.accent),
    pathEl("M 778 512 C 654 512 600 604 626 728", t.primary),
    pathEl("M 512 778 C 512 654 420 600 296 626", t.accent),
    pathEl("M 246 512 C 370 512 424 420 398 296", t.primary),
    circleEl(512, 512, 60, t.secondary, { strokeWidth: 24, opacity: 0.68 }),
    dot(512, 512, 16, t.accent),
  ].join("\n");
}

function commercialNetworking(t) {
  return [
    pathEl("M 324 364 H 664 C 696 364 720 388 720 420 V 604 C 720 636 696 660 664 660 H 324", t.primary),
    pathEl("M 352 430 H 496 C 584 430 628 474 672 512", t.accent),
    pathEl("M 352 594 H 496 C 584 594 628 550 672 512", t.accent),
    lineEl(512, 364, 512, 660, t.secondary, { opacity: 0.66 }),
    lineEl(352, 512, 672, 512, t.secondary, { opacity: 0.62 }),
  ].join("\n");
}

function remoteMonitoring(t) {
  return [
    pathEl("M 328 392 H 652 C 690 392 718 420 718 458 V 626", t.primary),
    pathEl("M 328 632 H 652 C 690 632 718 604 718 566", t.primary),
    pathEl("M 352 548 C 430 496 492 584 556 532 S 646 500 702 552", t.accent),
    circleEl(612, 450, 48, t.secondary, { strokeWidth: 24, opacity: 0.86 }),
    pathEl("M 612 416 V 450 H 646", t.accent, { strokeWidth: 24 }),
  ].join("\n");
}

function structuredCabling(t) {
  return [
    lineEl(340, 350, 340, 674, t.secondary, { opacity: 0.76 }),
    lineEl(684, 350, 684, 674, t.secondary, { opacity: 0.76 }),
    pathEl("M 340 410 H 468 C 546 410 558 494 636 494 H 684", t.primary),
    pathEl("M 340 512 H 684", t.primary),
    pathEl("M 340 614 H 468 C 546 614 558 530 636 530 H 684", t.accent),
  ].join("\n");
}

function managedSystems(t) {
  return [
    pathEl("M 512 250 C 650 250 768 368 768 512 C 768 630 690 730 584 762", t.accent),
    pathEl("M 512 774 C 374 774 256 656 256 512 C 256 394 334 294 440 262", t.accent),
    pathEl("M 414 388 H 578 C 604 388 624 408 624 434 V 636", t.primary),
    pathEl("M 414 636 H 578 C 604 636 624 616 624 590", t.primary),
    lineEl(464, 476, 564, 476, t.secondary, { strokeWidth: 24, opacity: 0.8 }),
    lineEl(464, 538, 540, 538, t.quiet, { strokeWidth: 24, opacity: 0.74 }),
    dot(584, 762, 12, t.accent),
  ].join("\n");
}

function northlineSignature(t) {
  return [
    pathEl("M 512 244 L 718 366 V 658 L 512 780 L 306 658 V 366 Z", t.primary),
    pathEl("M 402 446 L 512 512 L 622 446", t.accent),
    pathEl("M 402 578 L 512 512 L 622 578", t.accent),
    lineEl(512, 364, 512, 660, t.primary),
    lineEl(306, 512, 402, 512, t.secondary, { opacity: 0.74 }),
    lineEl(622, 512, 718, 512, t.secondary, { opacity: 0.74 }),
    dot(512, 512, 12, t.accent),
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
  <title>Northline Icon System V4</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0c0b08;
      --text: #f3eede;
      --muted: #958f80;
      --accent: #72dec9;
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
      <h1>Northline <em>icon system V4</em></h1>
      <p class="meta">A more restrained atelier-grade system for invisible architectural technology.</p>
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
    name: "Northline Smart Systems Icon System V4",
    canvas: `${SIZE}x${SIZE}`,
    strokeWidth: STROKE,
    designNotes: [
      "More premium than V3: less pictographic and less device-led",
      "No outer brackets or decorative framing",
      "Thin architectural monoline with generous negative space",
      "Minimal teal use as a luxury accent",
      "Built for invisible technology and intelligent environments",
    ],
    colors: {
      ink: "#0c0b08",
      warmCream: "#f3eede",
      accentBright: "#72dec9",
      warmGray: "#958f80",
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
