# Layout Plan — Marie Uhrbom

Each page has a **goal**, a **proposed section order**, and a list of **tasks** to complete.
Tasks are grouped into: content-only changes (JSON), component changes (code), and new components to build.

SEO notes are included per page but full SEO implementation is a separate phase.

---

## Global / shared work

Before touching individual pages, a few things affect everything:

- [ ] **Fix InfoCard markdown** — `InfoCard.astro` renders `body` as a plain `<p>`, but several pages pass markdown (bold, bullets). Add `marked` parsing so pricing lists and bold text actually render.
- [ ] **Add CTA support to AboutBand** — add optional `linkLabel` / `linkHref` props so the about section can link somewhere.
- [ ] **Fix home canonical bug** — `hem.json` has `"slug": "hem"` but the page lives at `/`. Change to `"slug": ""` (or remove the slug field entirely so `Base.astro` falls back to `/`).
- [ ] **Fix OG image URL** — `Base.astro` outputs a relative `/images/og-default.jpg`. Social crawlers need an absolute URL. Prefix with `Astro.site` (only when it's not already absolute).

---

## 1. Hem (startsida) `/`

**Goal:** Warm, personal, immediately clear what Marie does and who she is. Visitors should feel welcomed and curious — not like they've landed on a services brochure. Three services should feel connected, not siloed. One strong CTA toward contact.

**SEO intent:** Homepage for brand name + location. "Marie Uhrbom", "homeopat Mellerud", "läderhantverk Sverige", "livscoach Västra Götaland".

### Proposed section order

1. `hero-split` — improved (see tasks)
2. `about-band` — moved up from position 3: introduce Marie early, build connection before listing services
3. `services-grid` — with images, more personal descriptions, craft card wider
4. `quote` — one sentence from Marie that bridges the three areas, her voice
5. `cta` — improved copy

### Tasks

**Content (JSON):**
- [ ] Swap hero CTAs: make "Kom i kontakt" the primary (left) and "Läs om mig" secondary
- [ ] Rewrite hero subtitle — more specific and personal, e.g. *"Jag gör gevärremmar för hand, hjälper din kropp att läka, och lyssnar när livet behöver ett samtal."*
- [ ] Move `about-band` to section 2 (before services-grid) and add `linkLabel: "Läs mer om mig"` + `linkHref: "/om-marie"` once the component supports it
- [ ] Improve `about-band` body copy — more personality, less résumé. First-person, warm, specific.
- [ ] Add images to all three `services-grid` items (use existing images where available)
- [ ] Set the craft services-grid item to `"size": "wide"` or `"large"` — make it visually dominant since it's the most visual service
- [ ] Rewrite services-grid item bodies — currently generic, make each one specific and inviting
- [ ] Add a `quote` section after services-grid with a short line from Marie that connects the three areas
- [ ] Rewrite `cta` copy — warmer and more specific than "Har du frågor?"
- [ ] Fix `"slug": ""` (remove or empty) so canonical URL resolves to `/`

**Component work:**
- [ ] Add `linkLabel` / `linkHref` props to `AboutBand.astro` (see global tasks)

**SEO:**
- [ ] Home page meta description — lead with what she offers and where, not "Välkommen till". E.g. *"Klassisk homeopati, livscoachning och handgjort läderhantverk. Marie Uhrbom tar emot nära Mellerud, online och via telefon."*

---

## 2. Hantverk `/hantverk`

**Goal:** A visual, craft-forward page that makes you *want* to own one of these objects. Images first, then story, then ordering. The gevärrem is the hero product — it should feel like a beautiful piece of craft that's made just for you.

**SEO intent:** "handgjord gevärrem", "läderrem jakt", "sadelmakare Mellerud", "Tärnsjö läder gevärrem", "hundkoppel läder Sverige".

### Proposed section order

1. `hero-portrait` — keep, it's the right hero style for craft
2. `gallery` — **move up to position 2**, immediately after the hero. Show the work before explaining it. Let images do the selling.
3. New `process-steps` block (3 steps: Kontakta → Vi stämmer av → Du får din rem) — quick visual "how it works" before the dense text
4. `text` — the gevärrem description, but split into visually manageable chunks
5. `info-card` for pricing — once markdown is fixed, this works well
6. `services-grid` with images — show the full product range visually
7. `inquiry-form` — keep the anchor `#bestall`

### Tasks

**Content (JSON):**
- [ ] Move `gallery` section to position 2 (right after hero)
- [ ] Fix footnote typo: `"Levenstid"` → `"Leveranstid"`
- [ ] Add images to all four `services-grid` items (gevärremmar, hundkoppel, sadelmakeri, bälten)
- [ ] Add more images to `gallery` — ideally 6–9 images showing process, close-ups, finished products
- [ ] Add `alt` text to gallery images that includes keywords (e.g. "Handgjord gevärrem i Tärnsjö-läder med älgmotiv")
- [ ] Split the long `text` section body into subsections using `##` headings so it's easier to scan

**Component work:**
- [ ] Fix `InfoCard.astro` markdown rendering (see global tasks) — pricing bullets and bold text are broken without this
- [ ] Build new `ProcessSteps` block — displays 3–5 numbered steps horizontally. Props: `eyebrow`, `title`, `steps[]` (each with `number`, `title`, `body`). Clean, minimal, left-to-right flow on desktop, stacked on mobile.

**SEO:**
- [ ] Add keyword-rich `alt` text to all images (already noted above)
- [ ] Meta description is good — keep as-is

---

## 3. Homeopati `/homeopati`

**Goal:** Calm, credible, reassuring. Visitors may be skeptical or trying homeopathy for the first time. The page should answer the "is this legitimate / safe?" question early, and make booking feel easy and low-stakes.

**SEO intent:** "klassisk homeopat", "homeopat Mellerud", "homeopat djur häst", "homeopati bokning Västra Götaland".

### Proposed section order

1. `hero-overlay` — keep, the atmospheric image works well
2. `text` about what homeopathy is — keep
3. `method-cards` — restyle to feel like numbered steps (1. Första mötet → 2. Ditt medel → 3. Uppföljning), not just feature bullets
4. `quote` — add a short patient-voice quote or Marie's own words about the practice, creates warmth
5. `info-card` for legal/tystnadsplikt — keep but position it clearly as a "practical info" note, not the emotional core
6. `booking-grid` with pricing info + form — keep structure, improve copy

### Tasks

**Content (JSON):**
- [ ] Rename `method-cards` items to feel like a journey: "1. Vi ses" / "2. Ditt medel" / "3. Vi följer upp" with warmer, first-person bodies
- [ ] Add a `quote` section between method-cards and info-card — one sentence from Marie about why she does this work
- [ ] Improve `booking-grid` intro — lead with the cost and the "no-risk" angle (no commitment for first contact)
- [ ] Consider adding a `"cta2Label": "Läs om mig"` or similar secondary note to direct skeptics toward the about page

**Component work:**
- [ ] Add optional numbered step display to `MethodCards.astro` — when items have a `step` number field, show it as a large numeral. Optional, falls back to icon if no step.

**SEO:**
- [ ] Meta description is good — keep

---

## 4. Vägledning `/vagledning`

**Goal:** Intimate, personal, hopeful. Coaching is a decision of trust — this page needs more emotional warmth than any other. The current `page-header` start is too cold/corporate. Visitors are often in some kind of transition or difficulty; the tone should meet them there.

**SEO intent:** "livscoach Västra Götaland", "livscoachning online", "coaching välmående Sverige", "hälsocoach Mellerud".

### Proposed section order

1. Replace `page-header` with `hero-portrait` — with an image of Marie or a calm, warm scene. Warmth before information.
2. `text` about life coaching — keep, good content. Maybe add a brief personal opener before the "Vad är livscoachning?" heading.
3. `quote` — move up, right after the intro text. It's a good emotional hook.
4. `two-cards` (individual sessions + process) — keep but improve body copy to feel less like feature descriptions
5. `info-card` for pricing — keep, styling is clear
6. `inquiry-form` — keep

### Tasks

**Content (JSON):**
- [ ] Replace `page-header` with `hero-portrait`: add an `image` field (use `om-marie.jpg` or a calm nature image), keep existing `eyebrow`/`title`/`subtitle`, add a personal `body` paragraph (1–2 sentences in Marie's voice)
- [ ] Move `quote` section to position 3 (after intro text, before two-cards)
- [ ] Rewrite `two-cards` bodies to be warmer — less like a product spec, more like a conversation
- [ ] Add a `cta1Label`/`cta1Href` to hero-portrait pointing to `#boka`
- [ ] Add a brief "Vad händer sen?" (what happens next) note in the booking form intro, so the step from form → call feels clear

**Component work:**
- [ ] None required

**SEO:**
- [ ] Meta description is good — keep

---

## 5. Om Marie `/om-marie`

**Goal:** The page where a potential client decides whether to trust Marie. Should feel personal, genuine, and specific — not like a CV. Long credential text should be broken up visually. The three areas of work should each get a brief "portrait moment".

**SEO intent:** "Marie Uhrbom", "homeopat utbildning", "sadelmakare erfarenhet", "livscoach utbildning Sverige".

### Proposed section order

1. `hero-portrait` — keep, it's the right format
2. NEW `about-trio` band — three small visual cards, one per area (Hantverk since 1996 / Homeopat examen 2024 / Coach sedan 2006), each with a 1-line credential and a link to the service page. Short, scannable, builds credibility quickly.
3. `text` background/education — keep content but break it into visually distinct sections. Consider splitting into three separate `about-band` sections, one per speciality, alternating image side (image-left / image-right / image-left). This avoids the wall-of-text feel.
4. `info-card` for tystnadsplikt — keep
5. `cta` — improve copy to be more personal ("Välkommen att höra av dig" is fine but the body can be warmer)

### Tasks

**Content (JSON):**
- [ ] Add `cta1Label` + `cta1Href` to `hero-portrait` pointing to `/kontakt`
- [ ] Consider splitting the single long `text` section into 3 separate `about-band` sections (one per area), each with a relevant image and shorter body. This requires having per-speciality images.
- [ ] Alternatively: add `## ` subheading structure to the text and ensure TextSection renders h2 anchor IDs so the sections can be linked (already has prose-warm h2 styling)
- [ ] Add a credential summary — a short high-impact line early: *"Sadelmakare sedan 1996. Coach sedan 2006. Homeopat med examen 2024."*
- [ ] Improve `cta` body copy — make it invite a specific action rather than generic contact

**Component work:**
- [ ] Build new `CredentialStrip` block — a horizontal row of 3 simple stat-like cards. Each card has a `label` (e.g. "Sadelmakare"), `since` (e.g. "sedan 1996"), and optional `href`. Minimal, typographic, fits between hero and long text.

**SEO:**
- [ ] TextSection already has good h2 structure — ensure page title and first paragraph include her name and location
- [ ] Meta description is good — keep

---

## 6. Kontakt `/kontakt`

**Goal:** Warm landing point, not a bureaucratic form. The visitor arriving here has already decided to reach out — the job is to make it feel easy and low-stakes, not formal. Show the human behind the contact details.

**SEO intent:** "kontakta Marie Uhrbom", "boka homeopat", "beställa läderrem".

### Proposed section order

1. `page-header` — improve: warmer title ("Hör av dig") and subtitle that sets a friendly, low-commitment tone. Maybe a brief note: "Jag svarar inom ett par dagar."
2. `contact-card` — keep, good info layout
3. `inquiry-form` — keep, but improve the intro text to be welcoming and personal, not just instructional

### Tasks

**Content (JSON):**
- [ ] Improve `page-header` subtitle — e.g. *"Oavsett om du vill beställa en gevärrem, boka ett samtal eller bara undrar något — hör av dig. Jag svarar inom ett par dagar."*
- [ ] Add `intro` text to the `inquiry-form` section — a short warm sentence above the form
- [ ] Consider adding a simple `quote` or `about-band` section between the contact-card and form — a brief human touch before the form. Something like: "Jag ser fram emot att höra från dig." with a small photo.

**Component work:**
- [ ] None required

**SEO:**
- [ ] Meta description is good — keep

---

## New components to build (summary)

| Component | Used on | Priority |
|---|---|---|
| `ProcessSteps` | Hantverk | High |
| `CredentialStrip` | Om Marie | Medium |
| Updated `InfoCard` (markdown body) | Hantverk, Homeopati, Om Marie | High |
| Updated `AboutBand` (CTA link) | Hem, Om Marie | High |
| Optional numbered steps in `MethodCards` | Homeopati | Low |

---

## Component changes (summary)

| Component | Change |
|---|---|
| `InfoCard.astro` | Parse `body` with `marked` |
| `AboutBand.astro` | Add optional `linkLabel` + `linkHref` props |
| `MethodCards.astro` | Optional: add `step` number display |

---

## Content changes by page (quick ref)

| Page | Type | Key changes |
|---|---|---|
| Hem | JSON | Swap CTAs, move about-band up, add images to grid, fix slug |
| Hantverk | JSON | Move gallery up, add product images, fix footnote typo |
| Homeopati | JSON | Reframe method-cards as steps, add quote |
| Vägledning | JSON | Replace page-header with hero-portrait, move quote up |
| Om Marie | JSON | Add hero CTA, split or structure long text, credential summary |
| Kontakt | JSON | Warmer subtitle, better form intro |
