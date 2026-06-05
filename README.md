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
- SEO-ready metadata, sitemap, robots configuration, manifest, icons, Open Graph image, and JSON-LD.
- Portal routes are intentionally `noindex, nofollow`; the public homepage remains indexable.
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
| `/` | Public marketing site |
| `/portal` | Client portal overview |
| `/portal/devices` | Managed device status |
| `/portal/projects` | Active and completed project visibility |
| `/portal/support` | Support requests and service history |
| `/robots.txt` | Crawl rules |
| `/sitemap.xml` | Public sitemap |
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

## Notes

This repository is a premium website and portal demo. The consultation form is frontend-only and resolves to an in-app confirmation state; it does not submit to a backend. The portal is a read-only demonstration backed by local mock data.
