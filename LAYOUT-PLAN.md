# Layout Plan — Marie Uhrbom

**Design principle:** As few sections as possible per page. Each section must have a clear, unique job. If two sections say the same thing, cut one.

---

## Global fixes — DONE

- [x] Fix InfoCard markdown rendering (`marked` parse)
- [x] Add `linkLabel` / `linkHref` props to AboutBand
- [x] Fix home page canonical slug (`"slug": ""`)
- [x] Fix OG image to absolute URL in Base.astro

---

## New components — DONE

- [x] `ProcessSteps` — numbered steps with connecting line (used on Hantverk)
- [x] `CredentialStrip` — stat bar: label + year + link (used on Om Marie)
- [x] `Quote` — added `variant: "hero"` (full-bleed dark bg, large centered text, used on Vägledning)
- [x] Register both in PageRenderer

---

## Page structures — current state

Each page now has a distinct visual entry point. No two pages open the same way.

### Hem `/`
`hero-split` → `about-band` (with CTA link) → `services-grid` (images, craft card large) → `quote` → `cta`

### Hantverk `/hantverk`
`gallery` (with title — acts as hero) → `process-steps` → `text` → `info-card` → `inquiry-form`
*Feel: editorial, image-led, no portrait layout*

### Homeopati `/homeopati`
`hero-overlay` → `text` → `method-cards` (framed as 1-2-3 journey) → `quote` → `info-card` → `booking-grid`
*Feel: atmospheric, calm, trust-building*

### Vägledning `/vagledning`
`quote` (hero variant) → `page-header` → `text` → `info-card` → `inquiry-form`
*Feel: reflective, starts with philosophy, no image hero*

### Om Marie `/om-marie`
`hero-overlay` (Marie's photo) → `credential-strip` → `text` → `info-card` → `cta`
*Feel: face-to-face, full-bleed personal, then credentials and story*

### Kontakt `/kontakt`
`page-header` → `contact-card` → `inquiry-form`
*Feel: simple, functional, warm copy*

---

## SEO — next phase

- [ ] Add JSON-LD LocalBusiness structured data to Base.astro (powers Google knowledge panel)
- [ ] Verify all page `<title>` tags include location where relevant
- [ ] Verify all images have descriptive, keyword-rich `alt` text
- [ ] Check sitemap is generating correctly at `/sitemap-index.xml`
- [ ] Add `<meta name="robots">` if any pages should be excluded

---

## Remaining layout ideas (not yet prioritised)

- Testimonials block — content not yet written, component exists but unused
- Newsletter signup block — component exists, not wired to any service yet
- Hantverk: more gallery images needed (currently 4, ideally 6–9 showing process + close-ups)
- Gallery component could benefit from a `columns` prop (2-col for fewer images, 3-col for 6+)
