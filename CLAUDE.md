# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal website for Marie Uhrbom — a Swedish practitioner offering classical homeopathy, life coaching, and handmade leather craft. The site is entirely in Swedish. Built with Astro 5 and Tailwind CSS v4, deployed as a static site.

## Goals & intent

The site's primary purpose is visibility — giving Marie an address to share with potential clients and showcasing her work, especially photos of the leather craft.

**Current scope:**
- Information about all three services (homeopathy, life coaching, leather craft)
- Contact/inquiry forms as the main conversion point (no booking system or webshop yet)
- Testimonials/client stories (planned)
- Many images, especially of the leather craft

**Planned but not yet built:**
- Email list signup, segmented by interest area: (1) homeopathy/health, (2) leather craft — for sending occasional newsletters (~1×/month)
- Online booking for consultations
- Craft order form with product configuration (rifle sling customisation: motif, name, colour)

**Explicitly out of scope for now:** webshop, online product sales, any e-commerce infrastructure.

**Services and pricing (for content accuracy):**
- Homeopathy — first consultation 1 200 kr (1.5–2 h), follow-up 800 kr (30 min), medication extra. Sees people and animals. In-person near Mellerud, or online/phone.
- Life coaching — 600 kr/session (60 min).
- Leather craft (made-to-order, Tärnsjö leather) — rifle sling with motif + name 1 250 kr, coloured back +200 kr, custom motif from +400 kr. Long and variable lead times; contact before ordering.

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Static build to dist/
npm run preview   # Preview the production build locally
```

No linter or test suite is configured.

## Architecture

### Content-driven pages

All page content lives in `src/content/pages/*.json`. Each file maps to a URL route:
- `hem.json` → `/` (handled by `src/pages/index.astro`)
- Any other `<slug>.json` → `/<slug>` (handled by `src/pages/[slug].astro` via `import.meta.glob`)

Adding a new page requires only dropping a new JSON file into `src/content/pages/` — no code changes needed.

### Section / block system

Each page JSON has a `sections` array. Every section has a `type` field. `PageRenderer.astro` maps types to block components:

```
src/components/blocks/
  HeroSplit, HeroOverlay, HeroPortrait  — hero variants
  PageHeader, TextSection               — text content
  ServicesGrid, MethodCards, InfoCard   — card layouts
  AboutBand, Gallery                    — image+text
  BookingGrid, ContactCard, InquiryForm — contact/booking
  CTA, Quote                            — callouts
```

To add a new section type: create the block component, import it in `PageRenderer.astro`, and add a `case` to the switch.

### Site-wide settings

`src/content/settings/` contains JSON files consumed across components:
- `navigation.json` — header and footer links
- `seo.json` — default title, description, OG image
- `banner.json` — optional sitewide banner (`enabled: false` to hide)
- `contact.json` — email, phone, location, confidentiality note

### Layout

`src/layouts/Base.astro` is the single layout. It wires up `<head>` (SEO, OG tags, canonical URL, Google Fonts), the optional banner, header, main slot, and footer. The canonical URL is built from `Astro.site` (set in `astro.config.*` as `https://marieuhrbom.se`).

### Styling

Tailwind CSS v4 via `@tailwindcss/vite`. All custom design tokens are CSS custom properties defined in `src/styles/global.css` under `@theme inline` and `:root`. The brand palette is warm/natural: cream, leather (cognac), sage green, clay — all in `oklch`.

Key utility classes defined in `@layer components`:
- `.container-prose` — max-width centered container
- `.eyebrow` — small-caps label style
- `.prose-warm` — markdown prose styling (used with `set:html` from `marked`)

`font-display` = Cormorant Garamond (headings), `font-body` = Inter (body).

### Markdown rendering

Body fields in JSON that contain markdown are parsed with `marked` and rendered via `set:html`. The `TextSection` block handles this; the `.prose-warm` CSS class styles the output.

### Path alias

`@/` resolves to `src/` (configured in `tsconfig.json`).
