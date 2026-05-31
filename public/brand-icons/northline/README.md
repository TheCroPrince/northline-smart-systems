# Northline Smart Systems Icon System

Production icon assets for Northline Smart Systems.

- Canvas: `1024x1024`
- Master format: SVG
- Export format: PNG
- Stroke system: `48px`, rounded caps and joins
- Palette: warm ink, cream, Northline teal, warm gray

## Files

Each icon has three SVGs and three PNGs:

- `svg/{slug}.svg` and `png/{slug}.png`: transparent background
- `svg/{slug}-dark.svg` and `png/{slug}-dark.png`: dark background
- `svg/{slug}-light.svg` and `png/{slug}-light.png`: light background

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

For the website, prefer SVG:

```tsx
<img
  src="/brand-icons/northline/svg/intelligent-automation.svg"
  alt="Intelligent Automation"
  width={56}
  height={56}
/>
```

Use the PNG exports for favicons, app icons, social images, CMS uploads, and any toolchain that needs raster assets.

The source generator is `scripts/generate-northline-icons.mjs`.
