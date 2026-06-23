# Northline Smart Systems

Premium smart-property website and client portal demo for a fictional systems integrator focused on access control, surveillance, automation, networking, monitoring, and ongoing service visibility.

[Live demo](https://northline.armatir.com) | Built with Next.js, React, Tailwind CSS, and Framer Motion

## About The Demo

Northline Smart Systems is a polished product-style website for a premium smart home and commercial property systems company. The project presents a complete customer journey: a high-impact marketing homepage, selected work, service positioning, testimonials, FAQ, consultation flow, and a read-only client portal experience.

The demo is intentionally built to feel like a real high-end systems company while staying honest about its scope: it is a frontend portfolio/demo project, not an operating business or production service backend.

## Highlights

- Dark-warm premium visual identity with a signature lamp hero and animated display typography.
- Full marketing journey covering services, process, project proof, operational intelligence, portal preview, testimonials, FAQ, and CTA.
- Read-only portal demo with property switching, system health, managed devices, project visibility, and support history.
- Launch-ready metadata, robots configuration, manifest, icons, Open Graph image, and JSON-LD.
- Portfolio-only indexing strategy: public marketing routes default to `noindex, follow`, the sitemap is intentionally empty, and portal routes are `noindex, nofollow`.
- Accessibility-minded UI with keyboard-friendly modal behavior, semantic sections, reduced-motion support, and verified Lighthouse scores.
- Mock data model for properties, devices, projects, support requests, visits, events, technicians, and metrics.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4, custom design tokens |
| Motion | Framer Motion |
| Icons | Lucide React |
| Fonts | Geist, Instrument Serif |
| Deployment target | `https://northline.armatir.com` |

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portfolio/demo marketing site (`noindex, follow`) |
| `/portal` | Client portal overview (`noindex, nofollow`) |
| `/portal/devices` | Managed device status (`noindex, nofollow`) |
| `/portal/projects` | Active and completed project visibility (`noindex, nofollow`) |
| `/portal/support` | Support requests and service history (`noindex, nofollow`) |
| `/robots.txt` | Crawl rules and sitemap reference |
| `/sitemap.xml` | Valid empty sitemap for the portfolio-only indexing strategy |
| `/manifest.webmanifest` | App manifest |
| `/opengraph-image` | Generated social preview image |

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Project Structure

```text
app/                 Next.js routes, metadata, sitemap, robots, icons
components/          Marketing, portal, consultation, and shared UI components
lib/                 Site config, utilities, motion constants, mock data
public/              Images, portal captures, generated brand icons
styles/              Global styles and design tokens
scripts/             Icon generation helpers
```

## Verification Snapshot

Final audit checks for the demo included:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Playwright route and interaction checks
- Chrome DevTools console, network, screenshot, and performance inspection
- Lighthouse desktop audit with 100 scores for Accessibility, Best Practices, SEO, and Agentic Browsing

Build target from the last audit:

- Homepage first load JS: about 169 kB
- Portal routes: about 106-111 kB
- Local trace: about 1.6s LCP, 0.00 CLS

## Indexing Strategy

Northline is treated as a portfolio demonstration site surfaced through Armatir rather than a standalone indexable business. The root metadata keeps marketing routes out of search with `noindex, follow`, the sitemap route returns an empty valid sitemap, and portal routes tighten that policy to `noindex, nofollow`.

## Notes

This repository is a premium website and portal demo. The consultation form is frontend-only and resolves to an in-app confirmation state; it does not submit to a backend. The portal is a read-only demonstration backed by local mock data.
