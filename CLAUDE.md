# Astral Projection · Zero → Hero

An interactive zero-to-hero **course site** (not an essay): 11 modules + a 30-day capstone + a reference page, built to be *worked through* (objectives → lessons → worked examples → exercises with hint reveals → checkpoint quiz). Topic taught **authentic + grounded**: faithful to the tradition (Monroe/Buhlman/Bruce) and held alongside the science (hypnagogia, REM atonia, sleep paralysis, the TPJ/multisensory account of OBEs), keeping *experiential / evidenced / interpretive* claims explicitly distinct. Safety is woven in (contraindications, sleep-paralysis calm, stop conditions). No metaphysics asserted as fact; no medical or verified-travel claims.

## Deploy model — important
- **Live:** https://mikersays.github.io/bootcamp-astral-projection/
- GitHub Pages serves from **`/docs` on `main`**. There is **no build step** — `docs/` *is* the site. **Any edit to `docs/` redeploys on push to `main`** (build takes ~1–3 min; first build was slow). Don't add a bundler/framework.
- Repo is public (required for free-tier Pages). Repo homepage + description point at the live URL.

## Layout
```
docs/                     # the deployed site (plain HTML/CSS/JS, no deps, offline-first)
  index.html              # home: hero + curriculum map + global progress (I hand-built this)
  00-orientation.html … 10-*.html   # the 11 module pages
  capstone.html  reference.html
  assets/css/main.css     # the whole design system ("The Threshold")
  assets/js/main.js       # the whole interaction layer — auto-inits from the DOM
_course/                  # source of truth, NOT deployed
  curriculum.md           # authoritative syllabus (module order, objectives, capstone)
  design_brief.md         # the BINDING markup/class contract every page follows — READ FIRST
  modules/<slug>.md       # one teaching dossier per module (content lives here first)
  screenshots/            # QA artifacts
```

## How it works (before editing, read `_course/design_brief.md`)
- **`main.js` is the single source of truth** for two things: the ordered **module manifest** (`MANIFEST`) and the **glossary** (`GLOSSARY`). Progress %, nav completion marks, search, and resume all derive from `MANIFEST`. Glossary tooltips read `GLOSSARY` (keys are lowercase).
- The JS **auto-initializes from `data-*` attributes** — pages emit markup only, never bespoke `<script>`. Components: `[data-quiz]`, `[data-hints]` (hint ladder), `[data-session-player]`, `[data-mark-complete]`, `[data-confidence]`, `[data-notes]`, `[data-flashdeck]`, `[data-certificate]`, `[data-toc]`, `.term[data-term]`, `[data-theme-toggle]`. It's idempotent and degrades gracefully with JS off.
- **Progress/state** persists to `localStorage` under key **`ap:v1`**. A passing checkpoint quiz (≥70%) auto-marks a module complete and fires a badge; the certificate unlocks when every `MANIFEST` entry is complete.
- **Signature element:** the Guided Session Player (`<div data-session-player="relaxation|threshold|full">`) — a breathing orb + gold→cyan descent meter. Presets defined in `SESSIONS` in `main.js`.

### To add or change a module
1. Edit/author the dossier in `_course/modules/<slug>.md`.
2. Build/edit `docs/<NN>-<slug>.html` following `_course/design_brief.md` (copy header/navsheet/searchbox verbatim from another page; set `data-module="<slug>"`; give every lesson `<section>` a unique `id` + `data-track-section`).
3. **Add the module to `MANIFEST` in `main.js`** and to the navsheet/curriculum-map lists — progress math and nav depend on it.

## CSS/JS gotchas (learned the hard way in QA — don't regress these)
- **`html { overflow-x: clip }`** is what prevents horizontal scroll from the off-canvas nav drawer. Do **not** put `overflow-x:hidden` on `body` — it turns `body` into a scroll container and **breaks `position:sticky`** (the desktop TOC rail and the header). This combination was the bug.
- **The nav-drawer JS open/close must use `document.documentElement.style.overflowY`**, not `document.body.style.overflow`. Setting overflow on body triggers the same scroll-container bug as above and breaks sticky. Already fixed in `main.js`; don't revert.
- **`.objectives li` uses an absolutely-positioned `::before` bullet, not `display:flex`.** Flex on a list item containing inline elements (`.term`, `<em>`, `<strong>`) shatters the text into one-word columns. Same caution applies anywhere you'd flex a container of rich inline text.
- **The session player container gets its `.session-player` class added by JS** (`buildSessionPlayer`), not in the markup — that's what applies the card styling + "Guided session" ribbon. The hero instance is deliberately **orb-only**: CSS hides `.sp-phase`, `.sp-descent`, `.sp-controls`, `.sp-presets`, `.sp-sound` inside `.orb-wrap`, and zeroes `.sp-stage` padding. Do not remove those rules or the full player UI will overflow the 220px orb container and overlap the hero heading.
- **Wide tables must sit inside `.table-wrap`** — this is a **global CSS utility class** in `main.css` (no per-page `<style>` block needed). Just wrap: `<div class="table-wrap"><table>…</table></div>`. Pages that predate this (05, 09, capstone, reference) have their own local `<style>` blocks — that's fine but `.table-wrap` is preferred going forward.
- **Favicon lives at `docs/favicon.svg`** (the moon SVG). Reference it as `href="favicon.svg"` — **not** `href="assets/favicon.svg"` (wrong subdirectory). All 14 pages already have the correct link.
- Header is tight on phones: mini-progress is hidden `<560px` and the brand tagline `<420px` so the menu button never clips. Keep header content minimal.

## QA
No test framework. QA = drive the real site in a browser via the Playwright MCP at **393×852 (phone, primary target)** and **1440×900 (desktop)**: check no horizontal scroll, quiz scoring + persistence across reload, hint ladders, the session player, flashcards, certificate lock state, theme toggle. Serve locally with `cd docs && python3 -m http.server <port>`.

## Conventions
- Mobile-first (most learners are on a phone, often at night). Tap targets ≥44px, safe-area aware, reduced-motion respected.
- Type thesis: **Fraunces** (mystic serif) × **IBM Plex Mono** (clinical readout) = the authentic+grounded duality. Ink-indigo ground, phosphene-gold + vibrational-cyan accents; dark default, parchment "daybook" light theme. Use CSS vars, never hardcode hex.
- Zero placeholders/TODO in shipped pages; every instruction must be correct and runnable.
