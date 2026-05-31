# Northline Smart Systems Icon System V4

Production icon assets for Northline Smart Systems.

V4 is the more premium direction:

- Thinner architectural monoline
- More negative space
- Less literal hardware
- Less schematic/networking detail
- Minimal teal as a luxury accent
- No outer brackets or decorative framing

## Files

Each icon has three SVGs and three PNGs:

- `svg/{slug}.svg` and `png/{slug}.png`: transparent background
- `svg/{slug}-dark.svg` and `png/{slug}-dark.png`: dark background
- `svg/{slug}-light.svg` and `png/{slug}-light.png`: light background

All assets are built on a `1024x1024` canvas.

## Slugs

- `smart-home-integration`
- `surveillance-security`
- `ev-charging`
- `intelligent-automation`
- `commercial-networking`
- `remote-monitoring`
- `structured-cabling`
- `managed-systems`
- `northline-signature`

## Usage

Prefer SVG on the website:

```tsx
<img
  src="/brand-icons/northline-v4/svg/intelligent-automation.svg"
  alt="Intelligent Automation"
  width={56}
  height={56}
/>
```

Use PNG exports for favicons, app icons, CMS uploads, and contexts that require raster assets.

The source generator is `scripts/generate-northline-icons-v4.mjs`.
