# Design Brief — "The Threshold"

**Aesthetic.** A nocturnal field guide to the borderland between waking and sleep. The page *is* the dark behind closed eyelids: a deep ink-indigo ground scattered with slow-drifting **phosphene** lights. The whole identity rests on one duality that encodes the course thesis (*authentic + grounded*): a literary mystic serif against a clinical sleep-lab mono. Calm, legible, made for long study at night. Dark is default; a warm parchment "daybook" light theme exists for daytime. Never kitschy, never generic-AI (no Inter-on-white, no purple-gradient hero).

**Type roles.** `--font-display` **Fraunces** (titles, hero — the experiential voice). `--font-body` **Spectral** (all running text — calm night reading). `--font-mono` **IBM Plex Mono** (eyebrows, labels, timers, data — the grounded/clinical voice). Eyebrows are mono, uppercase, letter-spaced.

**Color (CSS vars, do not hardcode hex).** `--bg --bg-raised --surface --surface-2 --border` for structure; `--text --text-soft --text-faint` for ink; **`--accent`** = phosphene gold (primary), **`--accent-2`** = vibrational cyan (secondary, interactive highlight), **`--accent-3`** = deep-state violet (sparingly), `--danger` (safety/coral), `--good`. Both themes define all of these — always use the variable.

## Page contract (every module page)

```html
<!doctype html><html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>NN · Title — Astral Projection</title>
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body data-module="NN-slug">           <!-- exact id from the manifest in main.js -->
  <div class="skyfield"></div>           <!-- ambient phosphene field -->
  <a class="skip-link" href="#main">Skip to content</a>
  <!-- HEADER (identical on every page; see below) -->
  <!-- NAVSHEET (identical on every page) -->
  <main id="main" class="wrap">
    <div class="layout">                  <!-- enables the desktop TOC rail -->
      <article class="content"> … </article>
      <nav class="toc" data-toc><h4>On this page</h4><div data-toc-list></div></nav>
    </div>
  </main>
  <!-- FOOTER -->
  <script src="assets/js/main.js"></script>
</body></html>
```

The JS **auto-initializes everything from the DOM** — module builders emit markup only, never write bespoke script. `main.js` holds the canonical module **manifest** (order, titles, files) and the **glossary** dictionary; do not duplicate them.

### Header (copy verbatim on every page)
```html
<header class="site-header"><div class="site-header__bar">
  <a class="brand" href="index.html"><span class="brand__mark"><!-- moon SVG --></span>
    <span>Astral Projection<small>Zero → Hero</small></span></a>
  <span class="header-spring"></span>
  <span class="header-progress"><span class="label" data-mini-pct>0%</span>
    <span class="mini-track"><span class="mini-fill" data-mini-fill></span></span></span>
  <button class="icon-btn" data-search-open aria-label="Search">⌕</button>
  <button class="icon-btn" data-theme-toggle aria-label="Toggle theme"><span data-theme-icon>☼</span></button>
  <button class="icon-btn" data-nav-open aria-label="Open menu">☰</button>
</div></header>
```
The **navsheet** (`.navsheet > .navsheet__scrim + .navsheet__panel`) lists every module as `<a data-module="NN-slug" href="...">` with `<span class="num"><span>NN</span></span>` — JS adds completion ✓. Include a `[data-nav-close]` button. The **searchbox** (`.searchbox > .search-panel > input + .search-results`) is also copied verbatim. Just paste these blocks; index.html is the reference.

## Pedagogical structure (in `<article class="content">`, in order)

1. **Module header** — `<header class="module-header">` with `.kicker` (`.module-no` "MODULE NN", `.module-rung`), `<h1>`, `<p class="module-promise">`, then the objectives box:
   ```html
   <div class="objectives"><h2>By the end you can</h2><ul><li>…</li></ul></div>
   <p class="prereq-row">Prerequisites: <a class="chip" href="...">00 · Orientation</a> …</p>
   ```
2. **Lessons** — each is `<section id="kebab-id" data-track-section="kebab-id">` with optional `<p class="lesson-eyebrow">Lesson N</p>` then `<h2>`. **Every lesson section needs `id` + `data-track-section`** — the id feeds the TOC scroll-spy, the data attr feeds per-page progress. Build one concept at a time.
3. **Two-lens blocks** (use liberally — this is the course's signature content move): `<div class="lenses"><div class="lens lens-tradition"><h4>The tradition holds</h4>…</div><div class="lens lens-grounded"><h4>The grounded view</h4>…</div></div>`.
4. **Claim tags** inline: `<span class="tag tag-experiential">experiential</span>`, `tag-evidenced`, `tag-interpretive`. Use them whenever you mark an epistemic category.
5. **Worked examples** — `<div class="worked-example"> … </div>` (auto "Worked example" ribbon).
6. **Exercises with progressive hints** — one block per exercise:
   ```html
   <div class="exercise" data-hints>
     <div class="exercise-head"><span class="exercise-no">Exercise N</span><span class="exercise-diff">Warm-up</span></div>
     <p class="exercise-q">…the task…</p>
     <div class="hint-step" data-step="hint">…a nudge…</div>
     <div class="hint-step" data-step="hint">…a bigger hint…</div>
     <div class="hint-step" data-step="solution">…full solution + <em>why</em>…</div>
   </div>
   ```
   JS hides the steps, adds the reveal button ("Need a nudge?" → "Bigger hint" → "Show full solution"), and the step labels. You may write 1–3 `hint` steps; always end with exactly one `solution` step.
7. **Common mistakes** — `<div class="callout callout-mistakes"><p class="callout-title">⚠ Common mistakes</p> … </div>`. Other callouts: `callout-safety`, `callout-note`, `callout-tradition`, `callout-science`.
8. **Checkpoint quiz** — `<div class="quiz" data-quiz="NN-slug">` with `<div class="quiz-head"><p class="eyebrow">Checkpoint</p></div>` and one `.question` per item. **Passing (≥70%) auto-marks the module complete and fires a badge.** Question types:
   - MCQ / true-false: `<div class="question" data-type="mcq" data-answer="b"><p class="q-text">…</p><ul class="options"><li><button class="option" data-value="a">…</button></li>…</ul><div class="q-feedback" hidden><p>Why: …</p></div></div>` (true-false = two options a/b).
   - Fill-in / predict-the-output: `data-type="fill" data-answer="hypnagogia|hypnagogic"` (pipe = accepted variants) with `<input class="fill-input" placeholder="type your answer">`.
   - Drag-to-order: `data-type="order" data-answer="k1,k2,k3"` with `<ul class="order-list"><li class="order-item" data-key="k1">…</li>…</ul>` — JS adds up/down buttons (tap-friendly) and drag.
   Every question MUST have a `.q-feedback` explaining *why* the answer is right. Don't add a submit button — JS injects one.
9. **Confidence + mark-complete + notes** (near the end):
   ```html
   <div class="confidence" data-confidence><span class="c-label">How solid do you feel?</span></div>
   <div class="mark-complete" data-mark-complete><span class="mc-label" data-mc-text>Not yet complete</span><button class="btn btn-ghost">Mark module complete</button></div>
   <div class="notes-box" data-notes="NN-slug"><label>Your notes for this module</label><textarea placeholder="Jot what worked, questions, what to try next…"></textarea></div>
   ```
10. **"You can now…" recap** — a `<div class="callout callout-note"><p class="callout-title">✦ You can now</p><ul>…</ul></div>` mapping back to objectives.
11. **Prev/next nav** — `<nav class="module-nav"><a class="prev" href="…"><span class="dir">← Previous</span><span class="ttl">…</span></a><a class="next" href="…"><span class="dir">Next →</span><span class="ttl">…</span></a></nav>`.

## Signature element — the Guided Session Player
Drop it where a module wants a guided practice: `<div data-session-player="relaxation"></div>` (presets: `relaxation`, `threshold`, `full`). The JS builds the whole player: breathing orb that paces in/out, phase name + description, countdown, a five-stage **descent meter** (Awake→Relaxed→Threshold→Vibrational→Exit) whose colour migrates gold→cyan→violet with depth, transport controls, preset switcher, and an optional soft chime. Add `data-presets="false"` to lock it to one preset. Fully tap-operable; respects reduced motion (orb stops pulsing, everything still works).

## Components for index/reference
- **Curriculum map**: `<a class="map-item" data-module="NN-slug" href="…"><span class="rail"><span class="dot"></span></span><span class="mno">NN</span><span class="mbody"><span class="mttl">…</span><span class="mprom">…</span></span><span class="mrung">Rung</span></a>` — JS marks `.done`.
- **Overall progress**: elements with `data-overall-fill`, `data-overall-pct`, `data-overall-count`, `data-overall-total`; a `.big-track > .big-fill[data-overall-fill]`.
- **Resume**: `<a data-resume href="#"><span data-resume-title></span></a>` — JS points it at the next incomplete module.
- **Flashcards**: `<div class="flashdeck" data-flashdeck><div class="flashcard"><div class="flashcard__inner"><div class="flashcard__face flashcard__front"><span class="term-word">…</span></div><div class="flashcard__face flashcard__back"><span class="def">…</span></div></div></div>…</div>`.
- **Badges**: `<div class="badge-grid" data-badge-grid></div>` (JS fills it).
- **Certificate**: `<div class="certificate" data-certificate>…<span data-cert-name>Astral Traveller</span>…<button data-cert-edit>…</button><button data-cert-print>…</button><span data-cert-lock>…</span></div>` — unlocks when all modules complete.
- **Glossary terms** anywhere: `<span class="term" data-term="hypnagogia">hypnagogia</span>` (definitions live in `main.js`; keys are lowercase).

## Quality floor (non-negotiable)
Mobile-first: single column ~390px, enhance up at 680/1080px. Tap targets ≥44px. No horizontal scroll; long `<pre>` scrolls internally. `<meta viewport … viewport-fit=cover>` + safe-area padding (already in CSS). Visible keyboard focus, ARIA labels, reduced-motion respected, works with JS off (content is all in the HTML; interactivity degrades gracefully). Zero placeholders, zero TODO, every instruction correct and runnable.
