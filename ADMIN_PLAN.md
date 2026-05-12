# Admin UI Plan — Marie Uhrbom

## What it is

A single `admin.html` file that lives on **Marie's desktop** (or any folder on her computer).
She double-clicks it, it opens in her browser, and she can edit the site.

No server. No login service. No subscription. Just a plain HTML file that talks directly
to the GitHub REST API using a Personal Access Token (PAT) stored in her browser's localStorage.

When she saves, it commits the changed JSON file to GitHub → GitHub Action rebuilds the site
→ live in ~2 minutes.

---

## How it works (overview)

```
Marie's browser (admin.html)
  └─ reads/writes JSON files via GitHub REST API
       └─ git commit triggered on the repo
            └─ GitHub Action: npm run build
                 └─ GitHub Pages: site updated live
```

Authentication: a GitHub Fine-Grained PAT scoped to only this one repo with `contents: write`.
Stored in `localStorage` — never leaves her machine except as an Authorization header to api.github.com.

---

## File to create

```
admin.html          ← single self-contained file, lives on Marie's desktop
```

No build step. No npm. No framework. Pure HTML + vanilla JS (~700 lines).
Can also be committed to the repo root (but excluded from `dist/` via `.gitignore`) so it's versioned.

---

## Screens / Views

### 1. Setup screen (first time only)
Shown when no PAT is in localStorage.
- Input: GitHub Personal Access Token (you paste it in for her once)
- Input: Repo owner (e.g. `emesan`)
- Input: Repo name (e.g. `marie-uhrbom`)
- Input: Branch (default: `main`)
- "Spara & fortsätt" button → stores in localStorage → goes to Page List

### 2. Page List
- Shows all pages from `src/content/pages/*.json` (fetches file tree from GitHub API)
- Each page: title, slug, Edit button
- "+ Ny sida" button → New Page screen
- "Inställningar" button → Settings screen

### 3. Page Editor
- Top: page meta fields (title, description)
- Middle: list of current sections with drag handles (reorder via up/down arrows)
- Each section shows its type name + a collapsed preview of its title
- Click section → expand inline section editor (see Section Editors below)
- "+ Lägg till sektion" → dropdown of all section types → appends new section with empty fields
- "Radera" on each section
- "Publicera" button → commits to GitHub

### 4. New Page screen
- Input: Slug (URL-friendly, lowercase, hyphens only — validated client-side)
- Input: Sidtitel
- Input: Meta-beskrivning
- "Skapa" → creates empty page JSON, goes to Page Editor

### 5. Settings screen
Three tabs:
- **Kontakt** — edit `src/content/settings/contact.json` (email, phone, location, confidentiality)
- **Navigation** — edit `src/content/settings/navigation.json` (header/footer link lists)
- **Banner** — edit `src/content/settings/banner.json` (enabled toggle, message, link)

---

## Section Editors (per type)

Each section type maps to a set of labeled form fields. The schema object below drives
what fields are rendered. No separate schema file needed — it lives in the JS.

```js
const SECTION_SCHEMA = {
  'hero-split': [
    { key: 'eyebrow',    label: 'Ögonbrynstext',  type: 'text' },
    { key: 'title',      label: 'Rubrik',          type: 'text',     required: true },
    { key: 'subtitle',   label: 'Underrubrik',     type: 'text' },
    { key: 'image',      label: 'Bild',            type: 'image' },
    { key: 'alt',        label: 'Bildbeskrivning', type: 'text' },
    { key: 'cta1Label',  label: 'Knapp 1 text',    type: 'text' },
    { key: 'cta1Href',   label: 'Knapp 1 länk',    type: 'text' },
    { key: 'cta2Label',  label: 'Knapp 2 text',    type: 'text' },
    { key: 'cta2Href',   label: 'Knapp 2 länk',    type: 'text' },
    { key: 'footnote',   label: 'Fotnot',          type: 'text' },
  ],
  'hero-overlay': [
    { key: 'eyebrow',    label: 'Ögonbrynstext',  type: 'text' },
    { key: 'title',      label: 'Rubrik',          type: 'text',     required: true },
    { key: 'subtitle',   label: 'Underrubrik',     type: 'text' },
    { key: 'image',      label: 'Bakgrundsbild',   type: 'image' },
    { key: 'alt',        label: 'Bildbeskrivning', type: 'text' },
    { key: 'cta1Label',  label: 'Knapp 1 text',    type: 'text' },
    { key: 'cta1Href',   label: 'Knapp 1 länk',    type: 'text' },
    { key: 'cta2Label',  label: 'Knapp 2 text',    type: 'text' },
    { key: 'cta2Href',   label: 'Knapp 2 länk',    type: 'text' },
  ],
  'hero-portrait': [
    { key: 'eyebrow',    label: 'Ögonbrynstext',  type: 'text' },
    { key: 'title',      label: 'Rubrik',          type: 'text',     required: true },
    { key: 'subtitle',   label: 'Underrubrik',     type: 'text' },
    { key: 'body',       label: 'Brödtext',        type: 'textarea' },
    { key: 'image',      label: 'Porträttbild',    type: 'image' },
    { key: 'alt',        label: 'Bildbeskrivning', type: 'text' },
    { key: 'cta1Label',  label: 'Knapptext',       type: 'text' },
    { key: 'cta1Href',   label: 'Knappens länk',   type: 'text' },
    { key: 'footnote',   label: 'Fotnot',          type: 'text' },
  ],
  'page-header': [
    { key: 'eyebrow',    label: 'Ögonbrynstext',  type: 'text' },
    { key: 'title',      label: 'Rubrik (H1)',     type: 'text',     required: true },
    { key: 'subtitle',   label: 'Underrubrik',     type: 'text' },
  ],
  'text': [
    { key: 'title',      label: 'Rubrik (H2)',     type: 'text' },
    { key: 'body',       label: 'Brödtext (markdown)', type: 'textarea', required: true },
  ],
  'gallery': [
    { key: 'eyebrow',    label: 'Ögonbrynstext',  type: 'text' },
    { key: 'title',      label: 'Rubrik',          type: 'text' },
    { key: 'images',     label: 'Bilder',          type: 'image-list' },
    // image-list: repeatable rows of { url (image upload), alt (text) }
  ],
  'services-grid': [
    { key: 'eyebrow',    label: 'Ögonbrynstext',  type: 'text' },
    { key: 'title',      label: 'Rubrik',          type: 'text' },
    { key: 'subtitle',   label: 'Underrubrik',     type: 'text' },
    { key: 'items',      label: 'Kort',            type: 'service-list' },
    // service-list: repeatable rows of { eyebrow, title, body, linkLabel, href, size(select) }
  ],
  'about-band': [
    { key: 'eyebrow',    label: 'Ögonbrynstext',  type: 'text' },
    { key: 'title',      label: 'Rubrik',          type: 'text',     required: true },
    { key: 'body',       label: 'Brödtext (markdown)', type: 'textarea' },
    { key: 'image',      label: 'Bild',            type: 'image' },
    { key: 'alt',        label: 'Bildbeskrivning', type: 'text' },
  ],
  'method-cards': [
    { key: 'items',      label: 'Kort (3-kolumn)', type: 'card-list' },
    // card-list: repeatable rows of { icon(select: info/sparkles/shield), title, body }
  ],
  'two-cards': [
    { key: 'items',      label: 'Kort (2-kolumn)', type: 'card-list' },
  ],
  'booking-grid': [
    { key: 'id',         label: 'Ankar-ID (valfritt)', type: 'text' },
    { key: 'body',       label: 'Text (markdown)',  type: 'textarea', required: true },
  ],
  'contact-card': [
    { key: 'showConfidentiality', label: 'Visa tystnadsplikt-text', type: 'checkbox' },
  ],
  'inquiry-form': [
    { key: 'id',               label: 'Ankar-ID',          type: 'text' },
    { key: 'eyebrow',          label: 'Ögonbrynstext',     type: 'text' },
    { key: 'title',            label: 'Rubrik',            type: 'text' },
    { key: 'intro',            label: 'Inledande text',    type: 'text' },
    { key: 'area',             label: 'Område',            type: 'select',
      options: ['hantverk','homeopati','coachning','general'] },
    { key: 'subjectLabel',     label: 'Ämnets etikett',   type: 'text' },
    { key: 'messagePlaceholder', label: 'Meddelandets platshållare', type: 'text' },
    { key: 'submitLabel',      label: 'Knapptext',         type: 'text' },
  ],
  'cta': [
    { key: 'title',       label: 'Rubrik',            type: 'text',  required: true },
    { key: 'body',        label: 'Brödtext',          type: 'text' },
    { key: 'buttonLabel', label: 'Knapptext',         type: 'text' },
    { key: 'buttonHref',  label: 'Knappens länk',    type: 'text' },
  ],
  'quote': [
    { key: 'quote',       label: 'Citat',             type: 'textarea', required: true },
    { key: 'attribution', label: 'Av',                type: 'text' },
  ],
  'info-card': [
    { key: 'title',       label: 'Rubrik',            type: 'text',  required: true },
    { key: 'body',        label: 'Text',              type: 'textarea', required: true },
    { key: 'tone',        label: 'Ton',               type: 'select', options: ['soft','warm'] },
  ],
};
```

---

## Field type renderers

| Type | HTML rendered |
|------|--------------|
| `text` | `<input type="text">` |
| `textarea` | `<textarea rows="5">` with note "Stöder markdown: **fetstil**, *kursiv*, - listor" |
| `image` | Current image preview + "Välj bild"-button → `<input type="file" accept="image/*">` → upload on select |
| `checkbox` | `<input type="checkbox">` |
| `select` | `<select>` with options |
| `image-list` | Repeatable rows: [image upload] [alt text input] [Ta bort] + Lägg till-button |
| `service-list` | Repeatable rows: [eyebrow] [title] [body textarea] [linkLabel] [href] [size select] + reorder |
| `card-list` | Repeatable rows: [icon select] [title] [body textarea] + reorder |

---

## Image upload flow

```
1. User clicks "Välj bild"
2. FileReader.readAsDataURL(file) → base64 string
3. Strip the data:image/...;base64, prefix
4. Sanitise filename: lowercase, spaces→hyphens, keep extension
5. PUT https://api.github.com/repos/{owner}/{repo}/contents/public/images/{filename}
   Body: { message: "Laddar upp {filename}", content: base64, branch: "main" }
   If file exists: include sha from prior GET
6. Store returned URL as /images/{filename} in the section's image field
7. Show thumbnail in the form immediately
```

---

## Save / commit flow

```
1. Serialise current page state → JSON.stringify(page, null, 2)
2. Base64-encode the JSON string (btoa + TextEncoder for UTF-8 safety)
3. GET current file SHA from GitHub API (needed to update existing file)
   GET /repos/{owner}/{repo}/contents/src/content/pages/{slug}.json
4. PUT /repos/{owner}/{repo}/contents/src/content/pages/{slug}.json
   Body: { message: "Uppdaterar {slug}", content: base64, sha: currentSha, branch: "main" }
5. Show "Publicerat! Sidan är live om ~2 minuter." toast
6. If 404 on GET (new page): omit sha field in PUT → creates the file
```

---

## GitHub PAT setup (done once by developer)

1. github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Repository access: only `marie-uhrbom` repo
3. Permissions: **Contents: Read and write**
4. No other permissions needed
5. Copy token → paste into admin.html setup screen → stored in localStorage
6. Token never expires unless manually revoked

---

## Styling

- Inline CSS only (no external dependencies)
- Match the site's design tokens: cream background, leather-deep for primary buttons, Cormorant Garamond for headings, Inter for body
- Simple, clean, uncluttered — Marie should find it calming, not overwhelming
- Mobile-friendly (she may use it on a tablet)

---

## Implementation order

1. **Setup screen** — PAT + repo inputs, localStorage save/clear
2. **GitHub API module** — `getFile()`, `putFile()`, `getTree()` helper functions
3. **Page list** — fetch file tree, list pages, link to editor
4. **Page meta editor** — title + description fields
5. **Section list** — render existing sections, reorder (up/down), delete
6. **Simple field types** — text, textarea, checkbox, select
7. **Image upload** — FileReader → GitHub API → field update
8. **Repeatable lists** — image-list, card-list, service-list
9. **Add section** — dropdown of SECTION_SCHEMA keys → append empty section
10. **Commit flow** — save button → GitHub PUT with SHA handling
11. **New page** — slug/title/description → empty sections → create file
12. **Settings editor** — contact, navigation, banner tabs
13. **Polish** — loading states, error messages, success toasts, confirm before delete

---

## Files to create

```
admin.html                   ← the entire admin (self-contained)
```

Optional: commit to repo root, add to `.gitignore` patterns so it's NOT copied to dist:

```
# .gitignore addition
/admin.html
```

Wait — actually admin.html should NOT be in `public/` (it would be served publicly).
It should live on Marie's desktop only, OR in the repo root (not in public/) which Astro
does not serve. Either approach is fine.

---

## What Marie can do with the finished admin

- Edit any text on any page (headings, body copy, captions)
- Swap any image (upload from her computer, goes live automatically)
- Reorder sections on a page (move up/down)
- Add a new section to an existing page (from the list of available types)
- Remove a section
- Change page meta title and SEO description
- Create a brand new page (new slug → auto-generates the URL)
- Update contact details (email, phone, location)
- Update footer navigation links
- Toggle / edit the top banner

## What Marie cannot do (intentionally)

- Change the visual design or layout of a section type (only the developer can)
- Add a new section type (only the developer can)
- Break the site (the JSON schema is enforced by the form fields — she can't enter invalid values)
- Access anyone else's data (the PAT is scoped to this one repo only)
