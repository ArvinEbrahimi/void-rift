# TASKS-UI — Portfolio UI Overhaul (Next-Gen)

> **Owner:** Arvin Ebrahimi  
> **Scope:** Everything above and below the WebGL canvas — layout, typography, sections, motion, micro-interactions, content strategy  
> **Standard:** Must NOT look like a 2020 developer template. Unique, editorial, technically confident — the UI itself proves full-stack + creative engineering skill.

---

## 0. Brutal Honest Audit (Current UI)

| Element | Current state | Problem |
|---------|---------------|---------|
| **Overlay hero** | Centered name + typewriter | Generic "developer portfolio" — seen 10,000 times |
| **Nav** | 3 text links top-right | No personality, no status, no command-palette energy |
| **Typography** | Syne + DM Sans + JetBrains | Good fonts, bad hierarchy and rhythm |
| **Sections** | 3 basic blocks (Work, About, Contact) | Thin content, card grid looks like Bootstrap |
| **Color** | CSS vars, purple void | Under-used — 90% dark gray text on dark bg |
| **Motion** | GSAP intro + scroll fade | No scroll-triggered storytelling, no section choreography |
| **Cursor** | Dot + ring | Functional but not integrated with UI states |
| **Mobile** | Nav hidden, smaller type | Feels like desktop afterthought |
| **Proof of skill** | Tags on cards | No live demos, no code snippets, no metrics, no process |

### Target feeling

> *"An interface that feels like a control panel from the future — precise, alive, and unmistakably built by someone who cares about every pixel."*

---

## 1. Design Direction — "Void Command"

### Concept

The site is a **mission control interface** for a creative engineer. The WebGL rift is the "viewport into the void." UI elements feel like HUD panels, telemetry, and editorial magazine layout had a child.

### Unique signatures (must implement)

| Signature | Description |
|-----------|-------------|
| **Telemetry strip** | Live-feeling data: build version, local time, WebGL FPS counter, cursor coords |
| **Magnetic UI** | Buttons and links subtly pull toward cursor (GSAP quickSetter) |
| **Section indexing** | `// 01 — WORK` monospace index + progress rail on left edge |
| **Glass void panels** | `backdrop-filter` + 1px violet border + inner glow — not generic glassmorphism |
| **Text reveal** | Split-line, word, and char reveals on scroll (ScrollTrigger) |
| **Code as design** | Syntax-highlighted snippets inline — proves backend + frontend |
| **Bento grid** | Work section uses asymmetric bento, not equal cards |
| **Status pill** | "Available for hire" / "Open to freelance" with pulsing dot |

### Anti-patterns (never do)

- Hero with gradient text only
- Generic "My Skills" progress bars
- Font Awesome icons
- Stock illustrations
- Equal-width 3-column card grid
- Lorem ipsum anywhere

---

## 2. Information Architecture (Target Site Map)

```
┌─────────────────────────────────────────────────────────┐
│  [HUD Nav]  AE · Work · Stack · Lab · About · Contact  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ▓▓▓ WEBGL HERO (full viewport) ▓▓▓        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  01 / WORK        — Bento project showcase              │
│  02 / STACK       — Interactive tech constellation      │
│  03 / LAB         — Experiments + WebGL mini-demos      │
│  04 / PROCESS     — How I build (timeline)              │
│  05 / ABOUT       — Editorial bio + philosophy          │
│  06 / METRICS     — GitHub stats, commits, languages    │
│  07 / TESTIMONIALS— Quotes (or "Colleagues say")        │
│  08 / CONTACT     — Form + social + downloadable CV     │
├─────────────────────────────────────────────────────────┤
│  [Footer] — coordinates · copyright · back-to-void      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Section Specifications

### 3.1 Global Shell (`ui/shell/`)

- [x] **U-SHELL-01** Fixed left **progress rail** — vertical line, fill on scroll, section dots
- [x] **U-SHELL-02** Top **telemetry bar** — FPS, time Tehran, scroll %, `v1.0.0`
- [x] **U-SHELL-03** Bottom **status bar** — coords, "SYS.ONLINE", GitHub link
- [x] **U-SHELL-04** Persistent nav redesign — logo monogram, magnetic links, active section
- [x] **U-SHELL-05** `ScrollTrigger` integration (GSAP plugin) — register once in `scroll-animations.js`
- [x] **U-SHELL-06** Smooth scroll: Lenis or custom spring scroll (match WebGL scroll progress)
- [x] **U-SHELL-07** Page transition: hero → content crossfade with rift position sync

### 3.2 Hero Overlay v2 (`ui/hero-overlay/`)

- [x] **U-HERO-01** Split layout option: name left-aligned, rift visual center-right (asymmetric)
- [x] **U-HERO-02** Role line: animated word cycle with 3D flip or scramble decode effect
- [x] **U-HERO-03** CTA pair: `View Work ↓` primary + `GitHub` ghost — not single button
- [x] **U-HERO-04** Scroll indicator: custom SVG chevron with progress ring
- [x] **U-HERO-05** Easter egg: Konami or typed `void` triggers rift pulse
- [x] **U-HERO-06** Accessibility: skip-to-content link, focus trap off, `aria-live` on typewriter

### 3.3 Section 01 — Work (`ui/sections/work/`)

- [x] **U-WORK-01** **Bento grid** layout:
  ```
  ┌──────────────┬─────┐
  │   Featured   │  2  │
  │   (2×2)      ├─────┤
  │              │  3  │
  ├──────┬───────┴─────┤
  │  4   │      5      │
  └──────┴─────────────┘
  ```
- [x] **U-WORK-02** Each project card:
  - Hover: video loop or WebGL thumbnail canvas
  - Tags as monospace chips
  - Year + role (e.g. "2025 · Lead Frontend")
  - Arrow link with magnetic pull
- [x] **U-WORK-03** Featured project (Void Rift): embedded mini stats — shaders, particles, fps
- [x] **U-WORK-04** Filter chips: All / WebGL / Full-Stack / Motion — CSS + JS filter
- [x] **U-WORK-05** Case study modal or slide-over panel on click (no new page yet)

### 3.4 Section 02 — Stack (`ui/sections/stack/`)

- [x] **U-STACK-01** **Tech constellation** — orbiting nodes (CSS or light Canvas 2D):
  - Core: Three.js, React, Django
  - Satellites: GSAP, PostgreSQL, Docker, etc.
  - Hover node → expand description tooltip
- [x] **U-STACK-02** **Proficiency as context**, not bars — "Production experience since 20XX"
- [x] **U-STACK-03** Code snippet panel — real Django view or React hook example (Prism.js highlight)
- [x] **U-STACK-04** Architecture diagram — SVG animated data flow (client → API → DB)

### 3.5 Section 03 — Lab (`ui/sections/lab/`)

- [x] **U-LAB-01** Experiments grid — shader toys, motion studies, WIP
- [x] **U-LAB-02** Each item: GIF preview + "View source" GitHub link
- [x] **U-LAB-03** One live embed: mini canvas demo (e.g. noise visualizer) — proves JS skill
- [x] **U-LAB-04** "Building next" teaser card with pulsing border

### 3.6 Section 04 — Process (`ui/sections/process/`)

- [x] **U-PROC-01** Horizontal timeline: Discover → Design → Build → Ship → Iterate
- [x] **U-PROC-02** Each step: icon (custom SVG), title, 2-line description
- [x] **U-PROC-03** Scroll-driven line draw animation (SVG `stroke-dashoffset`)
- [x] **U-PROC-04** Quote block: engineering philosophy — 1 sentence, large Syne type

### 3.7 Section 05 — About (`ui/sections/about/`)

- [x] **U-ABOUT-01** Editorial layout: large pull quote + body columns (magazine style)
- [x] **U-ABOUT-02** Photo or abstract avatar frame — hex clip-path matching rift brand
- [x] **U-ABOUT-03** Timeline: career milestones (year + company + role)
- [x] **U-ABOUT-04** Values row: 3 pillars with custom icons (Performance, Craft, Clarity)
- [x] **U-ABOUT-05** Download CV button with file size + format hint

### 3.8 Section 06 — Metrics (`ui/sections/metrics/`)

- [x] **U-MET-01** GitHub API integration (public repos, languages, contributions) — or static fallback
- [x] **U-MET-02** Animated counters on scroll into view (GSAP snap)
- [x] **U-MET-03** Language breakdown — CSS bar or donut (violet palette only)
- [x] **U-MET-04** "Lines of craft" stats: projects shipped, years exp, technologies

### 3.9 Section 07 — Testimonials (`ui/sections/testimonials/`)

- [x] **U-TEST-01** Carousel or stacked cards — quote + name + role
- [x] **U-TEST-02** Auto-advance with pause on hover
- [x] **U-TEST-03** Placeholder structure if no real quotes yet — clearly marked template

### 3.10 Section 08 — Contact (`ui/sections/contact/`)

- [x] **U-CONT-01** Split: left = message form, right = direct links + availability calendar hint
- [x] **U-CONT-02** Form: name, email, message — vanilla JS validation, no backend (Formspree or mailto fallback)
- [x] **U-CONT-03** Social row: GitHub, LinkedIn, Email, Telegram — custom SVG icons
- [x] **U-CONT-04** "Response time: ~24h" trust signal
- [x] **U-CONT-05** Footer merge: back-to-top flies rift scale up (sync with WebGL)

### 3.11 Footer (`ui/footer/`)

- [x] **U-FOOT-01** Minimal — monogram, year, "Built with Three.js + Vanilla JS"
- [x] **U-FOOT-02** Hidden credit: shader compile time on first load (dev easter egg)

---

## 4. Design System v2

### 4.1 Typography scale

```css
--text-display: clamp(4rem, 11vw, 12rem);   /* hero name */
--text-h1:      clamp(2.5rem, 5vw, 4.5rem);   /* section titles */
--text-h2:      clamp(1.5rem, 3vw, 2.25rem);  /* card titles */
--text-body:    clamp(1rem, 1.2vw, 1.125rem);
--text-caption: 0.75rem;                        /* telemetry */
--text-code:    0.85rem;                       /* snippets */
```

### 4.2 New tokens

```css
--glass-bg:      rgba(7, 7, 26, 0.55);
--glass-border:  rgba(110, 63, 255, 0.25);
--glass-glow:    0 0 40px rgba(110, 63, 255, 0.08);
--panel-radius:  2px;  /* sharp — not 12px generic */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--rail-width:    2px;
```

### 4.3 Motion tokens

| Token | Value | Use |
|-------|-------|-----|
| `--dur-fast` | 200ms | Hovers |
| `--dur-med` | 600ms | Panel reveals |
| `--dur-slow` | 1200ms | Section entrances |
| `--stagger` | 80ms | List items |

### 4.4 Component library (vanilla, no framework)

```
src/ui/components/
├── panel.js          # glass void panel factory
├── magnetic.js       # cursor magnetic pull
├── text-reveal.js    # split text scroll reveal
├── counter.js        # animated number
├── tooltip.js        # stack constellation
├── modal.js          # project case study
└── telemetry.js      # FPS + time strip
```

---

## 5. Technical Requirements

### Dependencies to add (UI only)

```json
{
  "gsap": "^3.12.5",           // + ScrollTrigger (Club or CDN)
  "lenis": "^1.1.0",           // smooth scroll (optional)
  "prismjs": "^1.29.0"         // code highlighting (lightweight)
}
```

> ScrollTrigger: use GSAP CDN with club plugin OR implement lightweight IntersectionObserver alternative to avoid license issues.

### File structure (target)

```
src/
├── style/
│   ├── tokens.css
│   ├── typography.css
│   ├── components/
│   │   ├── panel.css
│   │   ├── bento.css
│   │   ├── rail.css
│   │   └── telemetry.css
│   └── sections/
│       ├── work.css
│       ├── stack.css
│       └── ...
├── ui/
│   ├── shell/
│   ├── hero-overlay/
│   ├── sections/
│   ├── components/
│   └── animations/
└── ...
```

### Performance

- [x] **U-PERF-01** CSS `content-visibility: auto` on below-fold sections
- [x] **U-PERF-02** Lazy-load Prism only when Stack section near viewport (N/A — CSS token highlighting)
- [x] **U-PERF-03** No layout shift — reserve space for bento grid
- [ ] **U-PERF-04** Lighthouse: Accessibility ≥ 90, Best Practices ≥ 95

---

## 6. Implementation Phases & Branches

| Phase | Branch | Focus |
|-------|--------|-------|
| **U-1** | `feat/ui-design-system-v2` | tokens, typography, panel component, CSS split |
| **U-2** | `feat/ui-shell-hud` | progress rail, telemetry, nav redesign |
| **U-3** | `feat/ui-hero-overlay-v2` | asymmetric layout, CTAs, scroll ring |
| **U-4** | `feat/ui-section-work-bento` | bento grid, project cards, hover states |
| **U-5** | `feat/ui-section-stack` | constellation, code snippet, diagram |
| **U-6** | `feat/ui-section-lab-process` | lab grid + process timeline |
| **U-7** | `feat/ui-section-about-metrics` | editorial about + GitHub stats |
| **U-8** | `feat/ui-section-contact-footer` | form, social, footer |
| **U-9** | `feat/ui-scroll-animations` | ScrollTrigger, magnetic, text reveals |
| **U-10** | `feat/ui-mobile-polish` | responsive pass every section |

---

## 7. Acceptance Criteria (UI Done)

```
□ Site does NOT resemble a generic dev template on first impression
□ 8 sections live with real content (no lorem ipsum)
□ Progress rail accurately tracks scroll position
□ Every section has unique layout — no copy-paste blocks
□ Work bento showcases ≥ 5 projects with distinct visual weight
□ Stack section proves full-stack (code + diagram visible)
□ Lab section has ≥ 1 interactive or live demo element
□ Scroll animations fire once, respect reduced-motion
□ Mobile: usable nav (drawer or bottom bar), readable type, no horizontal scroll
□ Custom cursor integrates with all interactive states
□ Contact form validates and gives clear feedback
□ Lighthouse a11y ≥ 90
□ A senior designer would ask "who built this?" not "which template is this?"
```

---

## 8. Content Checklist (Arvin to provide)

| Item | Needed for |
|------|------------|
| 5+ project descriptions + links | Work bento |
| 1 featured case study write-up | Work modal |
| Career timeline dates | About |
| Real testimonial quotes (or skip section) | Testimonials |
| CV PDF | About download |
| Social URLs | Contact |
| Professional photo (optional) | About |

---

## 9. Priority Matrix

| Priority | Tasks |
|----------|-------|
| **P0 — Must ship** | U-SHELL-01–04, U-WORK-01–02, U-STACK-01, U-CONT-01–03, U-9 scroll animations |
| **P1 — High impact** | U-HERO-01–03, U-LAB-01, U-PROC-01, U-ABOUT-01, U-MET-02 |
| **P2 — Polish** | U-HERO-05, U-MET-01 GitHub API, U-TEST-01, magnetic UI everywhere |
| **P3 — Future** | Case study pages, blog section, i18n FA/EN toggle |

---

## 10. Cross-reference

| Doc | Relationship |
|-----|--------------|
| `TASKS.md` | Master project board — phases 0–3 complete |
| `TASKS-HERO.md` | WebGL / Three.js hero expert pass |
| `TASKS-UI.md` | This file — HTML/CSS/UX overhaul |

> **Recommended order:** Ship UI shell + Work bento (U-1 → U-4) in parallel with Hero lighting rig (H-1) — visual impact on both layers simultaneously.

---

*Created: 2026-06-22 — UI next-gen overhaul roadmap*
