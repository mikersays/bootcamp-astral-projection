/* ============================================================================
   ASTRAL PROJECTION — "The Threshold" interaction layer
   Vanilla JS. Idempotent. Auto-initializes from the DOM. Offline-first.
   Public surface: window.AP.init(), window.AP.store, window.AP.manifest
   ============================================================================ */
(function () {
  'use strict';

  /* ---- module manifest (single source of truth for progress math) -------- */
  var MANIFEST = [
    { id: '00-orientation', n: '00', title: 'Orientation', file: '00-orientation.html', rung: 'Orientation' },
    { id: '01-relaxation-and-body-awareness', n: '01', title: 'Deep Relaxation & Body Awareness', file: '01-relaxation-and-body-awareness.html', rung: 'Foundation' },
    { id: '02-threshold-and-sleep-timing', n: '02', title: 'The Hypnagogic Threshold & Timing', file: '02-threshold-and-sleep-timing.html', rung: 'Building' },
    { id: '03-energy-and-vibrational-state', n: '03', title: 'Energy & the Vibrational State', file: '03-energy-and-vibrational-state.html', rung: 'Building' },
    { id: '04-focus-and-quieting-the-mind', n: '04', title: 'Focus & Quieting the Mind', file: '04-focus-and-quieting-the-mind.html', rung: 'Threshold' },
    { id: '05-separation-and-exit-techniques', n: '05', title: 'The Exit Techniques', file: '05-separation-and-exit-techniques.html', rung: 'Exit' },
    { id: '06-stabilizing-and-fear-management', n: '06', title: 'Stabilization & Fear Management', file: '06-stabilizing-and-fear-management.html', rung: 'Stabilization' },
    { id: '07-navigation-and-the-environment', n: '07', title: 'Navigation & the Environment', file: '07-navigation-and-the-environment.html', rung: 'Navigation' },
    { id: '08-return-grounding-and-journaling', n: '08', title: 'Return, Grounding & Journaling', file: '08-return-grounding-and-journaling.html', rung: 'Mastery' },
    { id: '09-troubleshooting-and-reliable-practice', n: '09', title: 'Troubleshooting & Reliable Practice', file: '09-troubleshooting-and-reliable-practice.html', rung: 'Mastery' },
    { id: '10-advanced-practice-tradition-and-science', n: '10', title: 'Advanced Practice, Tradition & Science', file: '10-advanced-practice-tradition-and-science.html', rung: 'Integration' },
    { id: 'capstone', n: '★', title: 'Capstone: The 30-Day Practice', file: 'capstone.html', rung: 'Capstone' }
  ];

  /* ---- glossary (auto-wired via <span class="term" data-term="..">) ------- */
  var GLOSSARY = {
    'astral projection': 'The practice, as the tradition frames it, of experiencing awareness as if it has separated from the physical body. In this course we treat the experience as real-to-the-practitioner without asserting that anything literally travels.',
    'obe': 'Out-of-body experience — the felt sense of perceiving the world from a location outside the physical body. Grounded research links it to multisensory integration in the temporoparietal junction.',
    'hypnagogia': 'The borderland state at sleep onset, full of drifting imagery, sounds, and thoughts. The launch-pad for most projection attempts.',
    'hypnagogic': 'Belonging to hypnagogia — the threshold between waking and sleep where imagery and sensations drift up on their own.',
    'wbtb': 'Wake Back To Bed — waking after roughly 4–6 hours of sleep, staying up briefly, then returning to sleep with intention. It places you near REM, where the threshold is easiest to reach consciously.',
    'rem': 'Rapid Eye Movement sleep — the dreaming stage, weighted toward the later part of the night. The body is naturally paralysed (atonia) during it.',
    'atonia': 'The natural muscle paralysis of REM sleep that stops you acting out dreams. Awareness arriving while atonia persists is what we experience as sleep paralysis.',
    'rem atonia': 'The natural muscle paralysis of REM sleep that stops you acting out dreams.',
    'sleep paralysis': 'Waking awareness while the body is still held in REM atonia — often with a sensed presence, chest pressure, or floating. Unpleasant but harmless, and it passes.',
    'vibrational state': 'A buzzing, electrical, or wave-like full-body sensation many practitioners report just before separation. Reliably reportable and tied to the threshold/REM state; not dangerous.',
    'focus 10': "Robert Monroe's term for the state of 'mind awake, body asleep' — the foundational target state for projection.",
    'focus 12': "Monroe's term for a state of 'expanded awareness' reached beyond Focus 10.",
    'tactile imaging': "Robert Bruce's technique of moving felt attention (not visual pictures) through zones of the body to raise sensation and energy.",
    'new energy ways': "Robert Bruce's system of energy-body work built on tactile imaging.",
    'rope technique': "Robert Bruce's exit method: reaching with imagined hands and climbing, hand over hand, up an imagined rope above you to create a single point of pull.",
    'silver cord': 'In the tradition, the cord said to tether the astral body to the physical so you can always return. Grounded view: a reassuring felt anchor, useful regardless of mechanism.',
    'tpj': 'Temporoparietal junction — a brain region that integrates vision, balance, and body sense. Disrupting it can produce out-of-body sensations, which is central to the grounded account of OBEs.',
    'temporoparietal junction': 'A brain region that integrates vision, balance, and body sense; central to the neuroscience of out-of-body experiences.',
    'hemi-sync': "Monroe's proprietary audio method using binaural beats plus guided sound to encourage target states. Evidence for binaural beats is mixed.",
    'binaural beats': 'An audio illusion: two slightly different tones, one per ear, perceived as a third pulsing beat. Used as a relaxation/entrainment tool; evidence is mixed.',
    'lucid dream': 'A dream in which you know you are dreaming. Treated in this course as the legitimate grounded equivalent of a navigated OBE.',
    'reality check': 'A small test done in waking life (and in dreams) — like pinching your nose and trying to breathe — to discover whether you are dreaming.',
    'grounding': 'A short routine after a session — re-engaging the senses, moving, water, a snack — that dispels lingering dissociation and returns you fully to ordinary awareness.'
  };

  /* ---- session-player presets (the signature element) -------------------- */
  // depth: 0 awake · 1 relaxed · 2 threshold · 3 vibrational · 4 exit-ready
  var SESSIONS = {
    relaxation: {
      label: 'Relaxation', total: '~6 min',
      phases: [
        { name: 'Settle', depth: 0, secs: 30, desc: 'Lie still. Let the bed take your full weight. Nowhere to be.', breath: { in: 4, hold: 0, out: 6 } },
        { name: 'Slow the breath', depth: 0, secs: 60, desc: 'Breathe low into the belly. Make the out-breath longer than the in.', breath: { in: 4, hold: 0, out: 6 } },
        { name: 'Release — upper body', depth: 1, secs: 75, desc: 'Soften the face, jaw, shoulders, arms, hands. Let each go heavy.', breath: { in: 4, hold: 0, out: 6 } },
        { name: 'Release — lower body', depth: 1, secs: 75, desc: 'Soften the chest, belly, hips, legs, feet. The whole body, heavy.', breath: { in: 4, hold: 0, out: 7 } },
        { name: 'Body scan', depth: 1, secs: 90, desc: 'Move attention slowly head to toe. Notice heaviness, warmth, tingling — without reacting.', breath: { in: 5, hold: 0, out: 7 } },
        { name: 'Rest at the edge', depth: 2, secs: 30, desc: 'Stay here, calm and aware. This stillness is the platform for everything else.', breath: { in: 5, hold: 0, out: 7 } }
      ]
    },
    threshold: {
      label: 'Threshold hold', total: '~7 min',
      phases: [
        { name: 'Settle', depth: 0, secs: 30, desc: 'Still the body. One slow breath at a time.', breath: { in: 4, hold: 0, out: 6 } },
        { name: 'Deep relaxation', depth: 1, secs: 90, desc: 'Run a quick head-to-toe softening. Let the body begin to sleep.', breath: { in: 4, hold: 0, out: 7 } },
        { name: 'Mind awake, body asleep', depth: 2, secs: 90, desc: 'Keep a thin thread of awareness alive as the body fades. This is Focus 10.', breath: { in: 5, hold: 0, out: 7 } },
        { name: 'Watch the imagery', depth: 2, secs: 90, desc: 'Drifting colours, shapes, sounds may rise. Notice without grabbing — let them come.', breath: { in: 5, hold: 2, out: 7 } },
        { name: 'Count anchor', depth: 2, secs: 90, desc: 'Silently count "1, I am awake … 2, I am awake …" to hold the thread without tipping into sleep.', breath: { in: 5, hold: 2, out: 7 } },
        { name: 'Hold the edge', depth: 3, secs: 30, desc: 'Stay poised on the border. Calm, alert, doing almost nothing.', breath: { in: 5, hold: 2, out: 8 } }
      ]
    },
    full: {
      label: 'Full attempt', total: '~10 min',
      phases: [
        { name: 'Settle', depth: 0, secs: 30, desc: 'Lie supine. Still the body. Set a calm intention.', breath: { in: 4, hold: 0, out: 6 } },
        { name: 'Deep relaxation', depth: 1, secs: 105, desc: 'Soften head to toe. Let the body grow heavy and distant.', breath: { in: 4, hold: 0, out: 7 } },
        { name: 'Reach the threshold', depth: 2, secs: 105, desc: 'Mind awake, body asleep. Let imagery drift. Keep the thread of awareness.', breath: { in: 5, hold: 0, out: 7 } },
        { name: 'Raise the vibrations', depth: 3, secs: 105, desc: 'Move felt attention head to toe. Invite the buzzing wave. Welcome it — it is harmless.', breath: { in: 5, hold: 2, out: 7 } },
        { name: 'Hold & focus', depth: 3, secs: 90, desc: 'Steady the state. Calm but alert. Do not get excited — excitement ends it.', breath: { in: 5, hold: 2, out: 8 } },
        { name: 'Exit', depth: 4, secs: 75, desc: 'Imagine climbing the rope, or rolling out, or floating up. No physical muscles — only imagined movement.', breath: { in: 6, hold: 0, out: 8 } },
        { name: 'Return & ground', depth: 0, secs: 30, desc: 'Whatever happened, return gently. Wiggle fingers and toes, open your eyes, and ground.', breath: { in: 4, hold: 0, out: 6 } }
      ]
    }
  };
  var DEPTHS = ['Awake', 'Relaxed', 'Threshold', 'Vibrational', 'Exit'];

  /* ---- store (localStorage with safe fallback) --------------------------- */
  var KEY = 'ap:v1';
  var mem = {};
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return mem; }
  }
  function write(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); }
    catch (e) { mem = o; }
  }
  var Store = {
    all: function () { return read(); },
    mod: function (id) { var s = read(); return s.modules && s.modules[id] || {}; },
    setMod: function (id, patch) {
      var s = read(); s.modules = s.modules || {};
      s.modules[id] = Object.assign({}, s.modules[id], patch);
      write(s); return s.modules[id];
    },
    get: function (k, d) { var s = read(); return (k in s) ? s[k] : d; },
    set: function (k, v) { var s = read(); s[k] = v; write(s); },
    earned: function () { var s = read(); return s.badges || {}; }
  };

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ======================================================================= */
  /* THEME                                                                    */
  /* ======================================================================= */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    $all('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', t === 'light');
      var s = b.querySelector('[data-theme-icon]'); if (s) s.textContent = t === 'light' ? '☾' : '☼';
    });
  }
  function initTheme() {
    applyTheme(Store.get('theme', 'dark'));
    $all('[data-theme-toggle]').forEach(function (b) {
      if (b.__wired) return; b.__wired = true;
      b.addEventListener('click', function () {
        var t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        Store.set('theme', t); applyTheme(t);
      });
    });
  }

  /* ======================================================================= */
  /* PROGRESS                                                                 */
  /* ======================================================================= */
  function moduleComplete(id) { var m = Store.mod(id); return !!(m.complete || m.quizPassed); }
  function overallPercent() {
    var done = 0;
    MANIFEST.forEach(function (m) { if (moduleComplete(m.id)) done++; });
    return Math.round((done / MANIFEST.length) * 100);
  }
  function sectionPercent(id, total) {
    var m = Store.mod(id); var secs = m.sections || {};
    var n = Object.keys(secs).filter(function (k) { return secs[k]; }).length;
    if (moduleComplete(id)) return 100;
    if (!total) return 0;
    return Math.min(99, Math.round((n / total) * 100));
  }
  function refreshProgressUI() {
    var pct = overallPercent();
    $all('[data-overall-fill]').forEach(function (e) { e.style.width = pct + '%'; });
    $all('[data-overall-pct]').forEach(function (e) { e.textContent = pct + '%'; });
    var done = MANIFEST.filter(function (m) { return moduleComplete(m.id); }).length;
    $all('[data-overall-count]').forEach(function (e) { e.textContent = done; });
    $all('[data-overall-total]').forEach(function (e) { e.textContent = MANIFEST.length; });
    // header mini
    $all('[data-mini-fill]').forEach(function (e) { e.style.width = pct + '%'; });
    $all('[data-mini-pct]').forEach(function (e) { e.textContent = pct + '%'; });
    // curriculum map + nav sheet completion marks
    $all('.map-item[data-module]').forEach(function (a) {
      a.classList.toggle('done', moduleComplete(a.getAttribute('data-module')));
    });
    $all('.navsheet a[data-module]').forEach(function (a) {
      a.classList.toggle('done', moduleComplete(a.getAttribute('data-module')));
    });
    // resume link
    var next = MANIFEST.filter(function (m) { return !moduleComplete(m.id); })[0] || MANIFEST[MANIFEST.length - 1];
    $all('[data-resume]').forEach(function (a) {
      a.setAttribute('href', next.file);
      var t = a.querySelector('[data-resume-title]'); if (t) t.textContent = next.n + ' · ' + next.title;
    });
  }

  function initProgress() {
    var body = document.body, id = body.getAttribute('data-module');
    // per-page section completion via [data-track-section]
    var sections = $all('[data-track-section]');
    if (id && sections.length) {
      var total = sections.length;
      var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isReferenced) {}
          if (en.intersectionRatio > 0 && en.boundingClientRect.top < window.innerHeight * 0.6) {
            var key = en.target.getAttribute('data-track-section');
            var m = Store.mod(id); var secs = m.sections || {};
            if (!secs[key]) { secs[key] = true; Store.setMod(id, { sections: secs }); updatePagePct(); }
          }
        });
      }, { threshold: [0, 0.4] }) : null;
      sections.forEach(function (s) { if (io) io.observe(s); });
      updatePagePct();
      function updatePagePct() {
        var p = sectionPercent(id, total);
        $all('[data-page-fill]').forEach(function (e) { e.style.width = p + '%'; });
        $all('[data-page-pct]').forEach(function (e) { e.textContent = p + '%'; });
      }
      window.AP._updatePagePct = updatePagePct;
    }
    // mark-complete control
    $all('[data-mark-complete]').forEach(function (box) {
      if (box.__wired) return; box.__wired = true;
      var btn = box.querySelector('button') || box;
      function render() {
        var done = moduleComplete(id);
        box.classList.toggle('done', done);
        var lbl = box.querySelector('[data-mc-text]');
        if (lbl) lbl.textContent = done ? 'Module complete' : 'Not yet complete';
        if (btn.tagName === 'BUTTON') btn.textContent = done ? 'Mark incomplete' : 'Mark module complete';
      }
      btn.addEventListener('click', function () {
        var done = moduleComplete(id);
        Store.setMod(id, { complete: !done });
        if (!done) { award('module', id); }
        render(); refreshProgressUI(); if (window.AP._updatePagePct) window.AP._updatePagePct();
      });
      render();
    });
    refreshProgressUI();
  }

  /* ======================================================================= */
  /* HEADER · NAV SHEET · SEARCH                                              */
  /* ======================================================================= */
  function initNavSheet() {
    var sheet = $('.navsheet'); if (!sheet) return;
    var openers = $all('[data-nav-open]'), scrim = sheet.querySelector('.navsheet__scrim');
    function open() { sheet.setAttribute('data-open', ''); sheet.removeAttribute('aria-hidden'); openers.forEach(function(o){o.setAttribute('aria-expanded','true')}); document.documentElement.style.overflowY = 'clip'; }
    function close() { sheet.removeAttribute('data-open'); sheet.setAttribute('aria-hidden','true'); openers.forEach(function(o){o.setAttribute('aria-expanded','false')}); document.documentElement.style.overflowY = ''; }
    openers.forEach(function (o) { if (!o.__w) { o.__w = 1; o.addEventListener('click', open); } });
    if (scrim && !scrim.__w) { scrim.__w = 1; scrim.addEventListener('click', close); }
    $all('[data-nav-close]', sheet).forEach(function (c) { if (!c.__w) { c.__w = 1; c.addEventListener('click', close); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function initSearch() {
    var box = $('.searchbox'); if (!box) return;
    var input = box.querySelector('input'), results = box.querySelector('.search-results');
    var idx = MANIFEST.map(function (m) { return { mod: m.n + ' · ' + m.rung, title: m.title, file: m.file }; });
    // add current page sections
    $all('main section[id] > h2, main section[id] > .lesson-eyebrow + h2').forEach(function () {});
    function open() { box.setAttribute('data-open', ''); input.value = ''; render(''); setTimeout(function () { input.focus(); }, 30); }
    function close() { box.removeAttribute('data-open'); }
    function render(q) {
      q = q.trim().toLowerCase();
      var hits = idx.filter(function (r) { return !q || (r.title + ' ' + r.mod).toLowerCase().indexOf(q) > -1; });
      results.innerHTML = '';
      if (!hits.length) { results.appendChild(el('div', 'search-empty', 'Nothing matches “' + q + '”.')); return; }
      hits.forEach(function (r, i) {
        var a = el('a', i === 0 ? 'sel' : '', '<span class="sr-mod">' + r.mod + '</span>' + r.title);
        a.href = r.file; results.appendChild(a);
      });
    }
    input.addEventListener('input', function () { render(input.value); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName)) { e.preventDefault(); open(); }
      if (e.key === 'Escape') close();
      if (box.hasAttribute('data-open') && e.key === 'Enter') { var s = results.querySelector('a.sel') || results.querySelector('a'); if (s) location.href = s.href; }
    });
    $all('[data-search-open]').forEach(function (b) { if (!b.__w) { b.__w = 1; b.addEventListener('click', open); } });
    $all('[data-search-close]').forEach(function (b) { if (!b.__w) { b.__w = 1; b.addEventListener('click', close); } });
  }

  /* ======================================================================= */
  /* TOC SCROLL-SPY                                                            */
  /* ======================================================================= */
  function initTOC() {
    var toc = $('[data-toc]'); if (!toc) return;
    var heads = $all('main section[id]').map(function (s) {
      var h = s.querySelector('h2'); return h ? { id: s.id, text: h.textContent } : null;
    }).filter(Boolean);
    if (!heads.length) { toc.style.display = 'none'; return; }
    var list = el('ul');
    heads.forEach(function (h) {
      var li = el('li'); var a = el('a', '', h.text); a.href = '#' + h.id;
      a.addEventListener('click', function (e) { e.preventDefault(); var t = document.getElementById(h.id); if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); history.replaceState(null, '', '#' + h.id); });
      li.appendChild(a); list.appendChild(li);
    });
    var inner = toc.querySelector('[data-toc-list]') || toc; inner.appendChild(list);
    var links = $all('a', list);
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      heads.forEach(function (h) { var s = document.getElementById(h.id); if (s) spy.observe(s); });
    }
  }

  /* ======================================================================= */
  /* COPY-CODE                                                                 */
  /* ======================================================================= */
  function initCopy() {
    $all('pre').forEach(function (pre) {
      if (pre.__copy) return; pre.__copy = 1;
      var btn = el('button', 'copy-btn', 'Copy'); btn.type = 'button'; btn.setAttribute('aria-label', 'Copy code');
      btn.addEventListener('click', function () {
        var code = (pre.querySelector('code') || pre).innerText;
        var done = function () { btn.textContent = 'Copied'; btn.classList.add('copied'); setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1600); };
        if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, fallback); else fallback();
        function fallback() { var t = el('textarea'); t.value = code; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} document.body.removeChild(t); }
      });
      pre.appendChild(btn);
    });
  }

  /* ======================================================================= */
  /* EXERCISES — progressive hints                                            */
  /* ======================================================================= */
  function initExercises() {
    $all('[data-hints]').forEach(function (ex) {
      if (ex.__wired) return; ex.__wired = 1;
      var steps = $all('.hint-step', ex);
      steps.forEach(function (s) { s.hidden = true; var lab = s.getAttribute('data-step') === 'solution' ? 'Solution' : 'Hint'; if (!s.querySelector('.step-label')) s.insertBefore(el('span', 'step-label', lab), s.firstChild); });
      var btn = ex.querySelector('[data-reveal]') || el('button', 'reveal-btn');
      if (!btn.parentNode) { btn.setAttribute('data-reveal', ''); ex.appendChild(btn); }
      btn.type = 'button';
      var i = 0;
      function label() {
        var next = steps[i];
        if (!next) return null;
        if (next.getAttribute('data-step') === 'solution') { btn.textContent = 'Show full solution'; btn.setAttribute('data-stage', 'solution'); }
        else { btn.textContent = i === 0 ? 'Need a nudge?' : 'Bigger hint'; btn.removeAttribute('data-stage'); }
      }
      label();
      btn.addEventListener('click', function () {
        if (i < steps.length) { steps[i].hidden = false; i++; if (i >= steps.length) btn.hidden = true; else label(); }
      });
    });
  }

  /* ======================================================================= */
  /* QUIZZES                                                                   */
  /* ======================================================================= */
  function norm(s) { return (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim(); }

  function initQuizzes() {
    $all('[data-quiz]').forEach(function (quiz) {
      if (quiz.__wired) return; quiz.__wired = 1;
      var qid = quiz.getAttribute('data-quiz') || (document.body.getAttribute('data-module') + '-quiz');
      var questions = $all('.question', quiz);
      // number questions + wire option selection
      questions.forEach(function (q, qi) {
        var qt = q.querySelector('.q-text'); if (qt && !qt.querySelector('.qn')) qt.insertBefore(el('span', 'qn', 'Q' + (qi + 1)), qt.firstChild);
        var type = q.getAttribute('data-type') || 'mcq';
        if (type === 'order') { wireOrder(q); return; }
        if (type === 'fill' || type === 'predict-text') {
          var inp = q.querySelector('.fill-input');
          if (inp) { var qtEl = q.querySelector('.q-text'); inp.setAttribute('aria-label', qtEl ? qtEl.textContent.trim() : 'Your answer'); }
          return;
        }
        // option-based
        var opts = $all('.option', q);
        opts.forEach(function (o, oi) {
          if (!o.querySelector('.opt-key')) o.insertBefore(el('span', 'opt-key', String.fromCharCode(97 + oi)), o.firstChild);
          o.setAttribute('type', 'button'); o.setAttribute('aria-pressed', 'false');
          o.addEventListener('click', function () {
            if (q.__locked) return;
            opts.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
            o.setAttribute('aria-pressed', 'true');
          });
        });
      });
      function wireOrder(q) {
        var list = q.querySelector('.order-list'); if (!list) return;
        var items = $all('.order-item', list);
        items.forEach(function (it) {
          if (!it.querySelector('.grip')) it.insertBefore(el('span', 'grip', '⋮⋮'), it.firstChild);
          if (!it.querySelector('.order-move')) {
            var mv = el('div', 'order-move'); var up = el('button', '', '▲'), dn = el('button', '', '▼');
            up.type = dn.type = 'button'; up.setAttribute('aria-label', 'Move up'); dn.setAttribute('aria-label', 'Move down');
            up.addEventListener('click', function () { if (q.__locked) return; var p = it.previousElementSibling; if (p) list.insertBefore(it, p); });
            dn.addEventListener('click', function () { if (q.__locked) return; var n = it.nextElementSibling; if (n) list.insertBefore(n, it); });
            mv.appendChild(up); mv.appendChild(dn); it.appendChild(mv);
          }
          // drag
          it.setAttribute('draggable', 'true');
          it.addEventListener('dragstart', function () { if (q.__locked) return; it.classList.add('dragging'); });
          it.addEventListener('dragend', function () { it.classList.remove('dragging'); });
          list.addEventListener('dragover', function (e) {
            e.preventDefault(); var dragging = list.querySelector('.dragging'); if (!dragging) return;
            var after = null, els = $all('.order-item:not(.dragging)', list);
            for (var k = 0; k < els.length; k++) { var r = els[k].getBoundingClientRect(); if (e.clientY < r.top + r.height / 2) { after = els[k]; break; } }
            if (after) list.insertBefore(dragging, after); else list.appendChild(dragging);
          });
        });
      }

      // submit
      var actions = quiz.querySelector('.quiz-actions') || (function () { var a = el('div', 'quiz-actions'); quiz.appendChild(a); return a; })();
      var submit = actions.querySelector('[data-quiz-submit]');
      if (!submit) { submit = el('button', 'btn btn-cyan'); submit.setAttribute('data-quiz-submit', ''); submit.type = 'button'; submit.textContent = 'Check answers'; actions.appendChild(submit); }
      var scoreEl = actions.querySelector('.quiz-score') || (function () { var s = el('span', 'quiz-score'); s.hidden = true; actions.appendChild(s); return s; })();
      var resultEl = quiz.querySelector('.quiz-result') || (function () { var r = el('div', 'quiz-result'); quiz.appendChild(r); return r; })();

      submit.addEventListener('click', function () {
        var correct = 0;
        questions.forEach(function (q) {
          q.__locked = true;
          var type = q.getAttribute('data-type') || 'mcq', ok = false;
          var fb = q.querySelector('.q-feedback');
          if (type === 'fill' || type === 'predict-text') {
            var inp = q.querySelector('.fill-input'); var ans = (q.getAttribute('data-answer') || '').split('|').map(norm);
            ok = inp && ans.indexOf(norm(inp.value)) > -1;
            if (inp) { inp.classList.add(ok ? 'correct' : 'wrong'); inp.disabled = true; }
          } else if (type === 'order') {
            var items = $all('.order-item', q); var want = (q.getAttribute('data-answer') || '').split(',');
            ok = items.every(function (it, k) { return it.getAttribute('data-key') === want[k]; });
            items.forEach(function (it, k) { it.classList.add(it.getAttribute('data-key') === want[k] ? 'correct' : 'wrong'); });
          } else {
            var sel = q.querySelector('.option[aria-pressed="true"]'); var want2 = q.getAttribute('data-answer');
            $all('.option', q).forEach(function (o) {
              o.disabled = true;
              var v = o.getAttribute('data-value');
              if (v === want2) o.classList.add('correct');
              if (o.getAttribute('aria-pressed') === 'true' && v !== want2) o.classList.add('wrong');
            });
            ok = sel && sel.getAttribute('data-value') === want2;
          }
          if (ok) correct++;
          if (fb) { fb.hidden = false; fb.classList.add(ok ? 'is-right' : 'is-wrong'); if (!fb.querySelector('.verdict')) fb.insertBefore(el('span', 'verdict', ok ? 'Correct' : 'Not quite'), fb.firstChild); }
        });
        var pct = Math.round((correct / questions.length) * 100);
        var pass = pct >= 70;
        scoreEl.hidden = false; scoreEl.innerHTML = '<span class="pct">' + pct + '%</span> · ' + correct + '/' + questions.length;
        resultEl.className = 'quiz-result show ' + (pass ? 'pass' : 'fail');
        resultEl.innerHTML = pass
          ? '<h4>Checkpoint cleared ✦</h4><p class="muted">You got ' + correct + ' of ' + questions.length + '. This module is marked complete — carry on when you’re ready.</p>'
          : '<h4>Not yet — and that’s fine</h4><p class="muted">You got ' + correct + ' of ' + questions.length + '. Review the explanations above, then run it again. You can reset below.</p>';
        var reset = el('button', 'btn btn-ghost', 'Reset quiz'); reset.type = 'button'; reset.style.marginTop = '.9rem';
        reset.addEventListener('click', function () { location.reload(); });
        resultEl.appendChild(reset);
        submit.hidden = true;
        var mid = document.body.getAttribute('data-module');
        Store.setMod(mid, { quizScore: pct, quizPassed: pass || Store.mod(mid).quizPassed });
        if (pass) { award('checkpoint', mid); award('module', mid); }
        refreshProgressUI(); if (window.AP._updatePagePct) window.AP._updatePagePct();
        resultEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      });
    });
  }

  /* ======================================================================= */
  /* GLOSSARY TOOLTIPS                                                         */
  /* ======================================================================= */
  function initGlossary() {
    var pop = $('.glosspop'); if (!pop) { pop = el('div', 'glosspop'); pop.setAttribute('role', 'tooltip'); document.body.appendChild(pop); }
    var active = null;
    function show(term, x, y) {
      var key = (term.getAttribute('data-term') || term.textContent).toLowerCase();
      var def = GLOSSARY[key]; if (!def) return;
      pop.innerHTML = '<span class="gterm">' + (term.getAttribute('data-term') || term.textContent) + '</span>' + def;
      pop.classList.add('show');
      var r = pop.getBoundingClientRect();
      var px = Math.min(Math.max(8, x - r.width / 2), window.innerWidth - r.width - 8);
      var py = y - r.height - 12; if (py < 8) py = y + 22;
      pop.style.left = px + 'px'; pop.style.top = py + 'px';
    }
    function hide() { pop.classList.remove('show'); active = null; }
    $all('.term').forEach(function (t) {
      if (t.__w) return; t.__w = 1;
      t.setAttribute('tabindex', '0');
      var key = (t.getAttribute('data-term') || t.textContent).toLowerCase();
      if (GLOSSARY[key]) t.setAttribute('aria-label', GLOSSARY[key]);
      t.addEventListener('mouseenter', function () { var r = t.getBoundingClientRect(); show(t, r.left + r.width / 2, r.top); });
      t.addEventListener('mouseleave', hide);
      t.addEventListener('focus', function () { var r = t.getBoundingClientRect(); show(t, r.left + r.width / 2, r.top); });
      t.addEventListener('blur', hide);
      t.addEventListener('click', function (e) {
        e.stopPropagation();
        if (active === t) { hide(); return; }
        active = t; var r = t.getBoundingClientRect(); show(t, r.left + r.width / 2, r.top);
      });
    });
    document.addEventListener('click', function (e) { if (active && !e.target.classList.contains('term')) hide(); });
    window.addEventListener('scroll', function () { if (active) hide(); }, { passive: true });
  }

  /* ======================================================================= */
  /* FLASHCARDS                                                                */
  /* ======================================================================= */
  function initFlashcards() {
    $all('[data-flashdeck]').forEach(function (deck) {
      if (deck.__w) return; deck.__w = 1;
      var cards = $all('.flashcard', deck); if (!cards.length) return;
      var i = 0;
      var nav = deck.querySelector('.flash-controls') || (function () { var c = el('div', 'flash-controls'); deck.appendChild(c); return c; })();
      nav.innerHTML = '';
      var prev = el('button', 'icon-btn', '‹'), counter = el('span', '', ''), next = el('button', 'icon-btn', '›');
      prev.type = next.type = 'button'; prev.setAttribute('aria-label', 'Previous card'); next.setAttribute('aria-label', 'Next card');
      nav.appendChild(prev); nav.appendChild(counter); nav.appendChild(next);
      cards.forEach(function (c, ci) {
        c.setAttribute('tabindex', '0'); c.setAttribute('role', 'button');
        if (!c.querySelector('.hint')) { $all('.flashcard__face', c).forEach(function (f, fi) { f.appendChild(el('span', 'hint', fi === 0 ? 'Tap to reveal' : 'Tap to hide')); }); }
        function flip() { c.classList.toggle('flipped'); }
        c.addEventListener('click', flip);
        c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
      });
      function show() { cards.forEach(function (c, ci) { c.hidden = ci !== i; c.classList.remove('flipped'); }); counter.textContent = (i + 1) + ' / ' + cards.length; }
      prev.addEventListener('click', function () { i = (i - 1 + cards.length) % cards.length; show(); });
      next.addEventListener('click', function () { i = (i + 1) % cards.length; show(); });
      show();
    });
  }

  /* ======================================================================= */
  /* LEARNER NOTES                                                             */
  /* ======================================================================= */
  function initNotes() {
    $all('[data-notes]').forEach(function (box) {
      if (box.__w) return; box.__w = 1;
      var k = 'notes:' + (box.getAttribute('data-notes') || document.body.getAttribute('data-module') || location.pathname);
      var ta = box.querySelector('textarea') || (function () { var t = el('textarea'); box.appendChild(t); return t; })();
      var tag = box.querySelector('.saved-tag') || (function () { var s = el('span', 'saved-tag', ''); box.appendChild(s); return s; })();
      ta.value = Store.get(k, '');
      var t;
      ta.addEventListener('input', function () {
        clearTimeout(t); tag.textContent = 'Saving…';
        t = setTimeout(function () { Store.set(k, ta.value); tag.textContent = 'Saved to this device · ' + ta.value.length + ' chars'; }, 400);
      });
      if (ta.value) tag.textContent = 'Saved to this device · ' + ta.value.length + ' chars';
    });
  }

  /* ======================================================================= */
  /* CONFIDENCE CHECK                                                          */
  /* ======================================================================= */
  function initConfidence() {
    $all('[data-confidence]').forEach(function (box) {
      if (box.__w) return; box.__w = 1;
      var id = document.body.getAttribute('data-module'); var cur = Store.mod(id).confidence || 0;
      var dots = box.querySelector('.dots') || (function () { var d = el('div', 'dots'); box.appendChild(d); return d; })();
      dots.innerHTML = '';
      for (var v = 1; v <= 5; v++) (function (v) {
        var b = el('button', 'conf-dot', String(v)); b.type = 'button'; b.setAttribute('aria-label', 'Confidence ' + v + ' of 5');
        if (v <= cur) b.classList.add('active');
        b.addEventListener('click', function () { Store.setMod(id, { confidence: v }); $all('.conf-dot', dots).forEach(function (x, xi) { x.classList.toggle('active', xi < v); }); });
        dots.appendChild(b);
      })(v);
    });
  }

  /* ======================================================================= */
  /* ACHIEVEMENTS                                                              */
  /* ======================================================================= */
  var BADGES = {
    'first-step': { ico: '✦', name: 'First Step' },
    'checkpoint': { ico: '◎', name: 'Checkpoint' },
    'halfway': { ico: '☽', name: 'Halfway' },
    'exit': { ico: '➶', name: 'First Exit Module' },
    'all-modules': { ico: '★', name: 'All Modules' },
    'capstone': { ico: '⚝', name: 'Capstone' }
  };
  function toast(ico, title, desc) {
    var stack = $('.toast-stack') || (function () { var s = el('div', 'toast-stack'); document.body.appendChild(s); return s; })();
    var t = el('div', 'toast', '<span class="tico">' + ico + '</span><div><span class="tt">' + title + '</span><div class="td">' + desc + '</div></div>');
    stack.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .4s, transform .4s'; t.style.opacity = '0'; t.style.transform = 'translateY(12px)'; setTimeout(function () { t.remove(); }, 420); }, 3200);
  }
  function earn(key) {
    var s = Store.all(); s.badges = s.badges || {};
    if (s.badges[key]) return false;
    s.badges[key] = Date.now(); write(s);
    var b = BADGES[key]; if (b) toast(b.ico, 'Badge earned', b.name);
    renderBadges();
    return true;
  }
  function award(kind, modId) {
    if (kind === 'module' || kind === 'checkpoint') {
      earn('first-step');
      if (kind === 'checkpoint') earn('checkpoint');
      if (modId === '05-separation-and-exit-techniques') earn('exit');
      if (modId === 'capstone') earn('capstone');
      var done = MANIFEST.filter(function (m) { return moduleComplete(m.id); }).length;
      if (done >= Math.ceil(MANIFEST.length / 2)) earn('halfway');
      var modulesOnly = MANIFEST.filter(function (m) { return m.id !== 'capstone'; });
      if (modulesOnly.every(function (m) { return moduleComplete(m.id); })) earn('all-modules');
    }
  }
  function renderBadges() {
    $all('[data-badge-grid]').forEach(function (grid) {
      grid.innerHTML = '';
      var earned = Store.earned();
      Object.keys(BADGES).forEach(function (k) {
        var b = BADGES[k]; var got = !!earned[k];
        var badgeEl = el('div', 'badge' + (got ? ' earned' : ''), '<div class="bico">' + b.ico + '</div><div class="bname">' + b.name + '</div>');
        badgeEl.setAttribute('role', 'listitem');
        grid.appendChild(badgeEl);
      });
    });
  }
  // expose for index/reference pages
  window.AP_award = award;

  /* ======================================================================= */
  /* CERTIFICATE                                                              */
  /* ======================================================================= */
  function initCertificate() {
    $all('[data-certificate]').forEach(function (cert) {
      if (cert.__w) return; cert.__w = 1;
      var nameEl = cert.querySelector('[data-cert-name]');
      var nameBtn = cert.querySelector('[data-cert-edit]');
      var printBtn = cert.querySelector('[data-cert-print]');
      var saved = Store.get('certName', '');
      if (nameEl && saved) nameEl.textContent = saved;
      function unlocked() { return MANIFEST.every(function (m) { return moduleComplete(m.id); }); }
      function render() {
        var ok = unlocked();
        cert.classList.toggle('cert-locked', !ok);
        var lock = cert.querySelector('[data-cert-lock]'); if (lock) lock.hidden = ok;
        if (printBtn) printBtn.disabled = !ok;
      }
      if (nameBtn) nameBtn.addEventListener('click', function () {
        var v = prompt('Name for your certificate:', Store.get('certName', '')); if (v != null) { Store.set('certName', v); if (nameEl) nameEl.textContent = v || 'Astral Traveller'; }
      });
      if (printBtn) printBtn.addEventListener('click', function () { if (unlocked()) window.print(); });
      render();
    });
  }

  /* ======================================================================= */
  /* SIGNATURE — GUIDED SESSION PLAYER                                        */
  /* ======================================================================= */
  function initSessionPlayers() {
    $all('[data-session-player]').forEach(function (root) {
      if (root.__w) return; root.__w = 1;
      buildSessionPlayer(root);
    });
  }
  function buildSessionPlayer(root) {
    var presetKey = root.getAttribute('data-session-player') || 'relaxation';
    if (!SESSIONS[presetKey]) presetKey = 'relaxation';
    var showPresets = root.getAttribute('data-presets') !== 'false';
    root.classList.add('session-player');

    root.innerHTML =
      '<div class="sp-stage"><div class="sp-orb" data-orb><div class="sp-orb__halo"></div><div class="sp-orb__core"></div><span class="sp-orb__cue" data-cue></span></div></div>' +
      '<div class="sp-phase"><div class="sp-phase__name" data-phase>Ready when you are</div>' +
      '<div class="sp-phase__desc" data-desc>A calm, steppable guide through a practice session. Find a quiet place, lie back, and press play. Read each phase, then close your eyes and follow the breathing orb.</div>' +
      '<div class="sp-timer" data-timer>—</div></div>' +
      '<div class="sp-descent" data-descent></div>' +
      '<div class="sp-controls">' +
        '<button class="sp-btn" data-prev aria-label="Previous phase">' + icon('prev') + '</button>' +
        '<button class="sp-btn sp-btn--play" data-play aria-label="Play session">' + icon('play') + '</button>' +
        '<button class="sp-btn" data-next aria-label="Next phase">' + icon('next') + '</button>' +
      '</div>' +
      (showPresets ? '<div class="sp-presets" data-presets></div>' : '') +
      '<div class="sp-sound"><label><input type="checkbox" data-chime> Soft chime between phases</label></div>';

    var orb = $('[data-orb]', root), cue = $('[data-cue]', root), phaseEl = $('[data-phase]', root),
        descEl = $('[data-desc]', root), timerEl = $('[data-timer]', root), descentEl = $('[data-descent]', root),
        playBtn = $('[data-play]', root), prevBtn = $('[data-prev]', root), nextBtn = $('[data-next]', root),
        chime = $('[data-chime]', root);

    var session = SESSIONS[presetKey], idx = 0, playing = false, remaining = 0, tick = null, breathTimer = null;
    var orbColors = ['var(--accent)', 'color-mix(in srgb,var(--accent) 65%,var(--accent-2))', 'color-mix(in srgb,var(--accent) 35%,var(--accent-2))', 'var(--accent-2)', 'color-mix(in srgb,var(--accent-2) 55%,var(--accent-3))'];

    function buildDescent() {
      descentEl.innerHTML = '';
      DEPTHS.forEach(function (d, di) { var s = el('span', 'sp-depth', d); s.setAttribute('data-d', di); descentEl.appendChild(s); });
    }
    function paintDescent(depth) {
      $all('.sp-depth', descentEl).forEach(function (s, di) {
        s.classList.toggle('active', di === depth);
        s.classList.toggle('done', di < depth);
      });
    }
    function buildPresets() {
      var box = $('[data-presets]', root); if (!box) return; box.innerHTML = '';
      Object.keys(SESSIONS).forEach(function (k) {
        var b = el('button', 'sp-preset' + (k === presetKey ? ' active' : ''), SESSIONS[k].label + ' · ' + SESSIONS[k].total);
        b.type = 'button';
        b.addEventListener('click', function () { stop(); presetKey = k; session = SESSIONS[k]; idx = 0; $all('.sp-preset', box).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); loadPhase(true); });
        box.appendChild(b);
      });
    }
    function setOrbColor(depth) { orb.style.setProperty('--orb', orbColors[depth] || orbColors[0]); }

    function loadPhase(reset) {
      var p = session.phases[idx];
      phaseEl.textContent = p.name; descEl.textContent = p.desc;
      remaining = p.secs; setOrbColor(p.depth); paintDescent(p.depth);
      timerEl.textContent = fmt(remaining) + (p.breath ? '  ·  breathe ' + p.breath.in + ' in / ' + p.breath.out + ' out' : '');
      prevBtn.disabled = idx === 0;
      if (reset) { playing = false; setPlayIcon(); cue.textContent = ''; orb.className = 'sp-orb'; }
    }
    function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
    function setPlayIcon() { playBtn.innerHTML = playing ? icon('pause') : icon('play'); playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play'); }

    function runBreath() {
      var p = session.phases[idx]; if (!p.breath || reduceMotion) { orb.className = 'sp-orb'; cue.textContent = reduceMotion ? '' : ''; return; }
      clearTimeout(breathTimer);
      var b = p.breath;
      function inhale() { if (!playing) return; orb.className = 'sp-orb breathe-in'; cue.textContent = 'in'; breathTimer = setTimeout(hold, b.in * 1000); }
      function hold() { if (!playing) return; if (b.hold) { cue.textContent = 'hold'; breathTimer = setTimeout(exhale, b.hold * 1000); } else exhale(); }
      function exhale() { if (!playing) return; orb.className = 'sp-orb breathe-out'; cue.textContent = 'out'; breathTimer = setTimeout(inhale, b.out * 1000); }
      inhale();
    }
    function play() {
      playing = true; setPlayIcon(); runBreath();
      clearInterval(tick);
      tick = setInterval(function () {
        remaining--;
        var p = session.phases[idx];
        timerEl.textContent = fmt(Math.max(0, remaining)) + (p.breath ? '  ·  breathe ' + p.breath.in + ' in / ' + p.breath.out + ' out' : '');
        if (remaining <= 0) {
          if (idx < session.phases.length - 1) { if (chime && chime.checked) ding(); idx++; loadPhase(false); runBreath(); }
          else { finish(); }
        }
      }, 1000);
    }
    function pause() { playing = false; setPlayIcon(); clearInterval(tick); clearTimeout(breathTimer); orb.className = 'sp-orb'; cue.textContent = ''; }
    function stop() { pause(); }
    function finish() {
      pause(); cue.textContent = ''; orb.className = 'sp-orb';
      phaseEl.textContent = 'Session complete'; descEl.textContent = 'Gently return: wiggle fingers and toes, open your eyes, and take a moment before getting up. However far you got, you trained the skill. Note it in your journal.';
      timerEl.textContent = '✦'; paintDescent(-1);
      try { if (window.AP_award) { /* noop hook */ } } catch (e) {}
    }
    function ding() {
      try {
        var ctx = buildSessionPlayer._ctx || (buildSessionPlayer._ctx = new (window.AudioContext || window.webkitAudioContext)());
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = 528; o.type = 'sine'; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
        o.start(); o.stop(ctx.currentTime + 1.4);
      } catch (e) {}
    }

    playBtn.addEventListener('click', function () { if (idx === session.phases.length - 1 && remaining <= 0) { idx = 0; loadPhase(true); } playing ? pause() : play(); });
    prevBtn.addEventListener('click', function () { if (idx > 0) { idx--; loadPhase(!playing); if (playing) { play(); } } });
    nextBtn.addEventListener('click', function () { if (idx < session.phases.length - 1) { idx++; loadPhase(!playing); if (playing) play(); } else finish(); });

    buildDescent(); buildPresets(); loadPhase(true);
  }

  function icon(name) {
    var p = {
      play: '<path d="M5 3.5v17l14-8.5z"/>',
      pause: '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>',
      prev: '<path d="M7 5v14M19 5l-9 7 9 7z"/>',
      next: '<path d="M17 5v14M5 5l9 7-9 7z"/>'
    }[name] || '';
    return '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" aria-hidden="true">' + p + '</svg>';
  }

  /* ======================================================================= */
  /* INIT                                                                     */
  /* ======================================================================= */
  function init() {
    initTheme(); initNavSheet(); initSearch(); initProgress(); initTOC();
    initCopy(); initExercises(); initQuizzes(); initGlossary();
    initFlashcards(); initNotes(); initConfidence(); renderBadges(); initCertificate();
    initSessionPlayers();
  }

  window.AP = { init: init, Store: Store, manifest: MANIFEST, glossary: GLOSSARY, sessions: SESSIONS, toast: toast, award: award };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
