# Void Rift — Project Specification & Task Board

> **Portfolio Hero for Arvin Ebrahimi**  
> A cinematic, space-themed WebGL experience built with pure Three.js — no React, no R3F, no UI frameworks.

---

## 1. Vision & Success Criteria

### 1.1 One-Line Pitch

A full-viewport hero that communicates *"this developer operates at a different level"* within the first 3 seconds — through depth, restraint, motion, and cinematic silence. Not particle spam. Not template aesthetics.

### 1.2 Primary Goals

| Goal | Metric |
|------|--------|
| **First impression** | Visitor understands name + role within 3s of load |
| **Visual signature** | Central violet geometric rift is instantly memorable |
| **Technical credibility** | Custom GLSL shaders, post-processing, 60fps on mid-tier GPU |
| **Performance** | LCP < 2.5s, no jank on 1080p @ 60fps |
| **Accessibility** | `prefers-reduced-motion` respected, keyboard-navigable links |

### 1.3 Non-Goals (Explicit)

- No React / Vue / Svelte
- No React Three Fiber
- No Tailwind / Bootstrap / component libraries
- No stock space textures — everything procedural via GLSL

---

## Phase 2 — Scroll Portfolio (Completed)

- [x] Rift `uReveal` intro animation wired to GSAP timeline
- [x] Scroll-driven rift shrink + upward drift
- [x] Hero overlay fade on scroll
- [x] Work / About / Contact sections with reveal animations
- [x] Smooth nav scroll + active section highlighting
- [x] Visual polish: stronger nebula, bloom, rift glow, outer ring
- [x] Crosshair cursor near rift center

## Phase 3 — Premium Rift 3D (Completed)

- [x] Multi-layer portal geometry: shell, facets, tunnel, hex frame, void core
- [x] Advanced GLSL: FBM + ridged noise, hex-fold displacement, energy veins
- [x] Chromatic fresnel edges, scan-line pulses, mouse-reactive intensity
- [x] Three energy rings with animated dash shaders
- [x] Hex filament LineSegments with phase pulse shader
- [x] 18 orbital crystal shards (instanced mesh)
- [x] Dual point lights (rim + core) with mouse modulation
- [x] 1400 rift particles emitted from hex edges, parented to rift group
- [x] Modular `src/webgl/rift/` shaders + geometry architecture

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Build | **Vite 5** | Fast HMR, minimal config, ESM-native |
| Rendering | **Three.js r165** | Industry standard, raw WebGL control |
| Animation | **GSAP 3** | Timeline orchestration, cursor lag, intro sequence |
| Post-FX | **postprocessing** (pmndrs) | Better perf than three/examples postprocessing |
| Language | **Vanilla JS (ESM)** | Zero framework overhead |

### Dependencies

```json
{
  "dependencies": {
    "three": "^0.165.0",
    "gsap": "^3.12.5",
    "postprocessing": "^6.36.3"
  },
  "devDependencies": {
    "vite": "^5.2.0"
  }
}
```

---

## 3. Architecture

```
void-rift/
├── index.html                 # Shell: meta, fonts preload, canvas container, cursor elements
├── vite.config.js             # Dev server, build, path aliases
├── package.json
├── .gitignore
├── README.md
├── TASKS.md                   # Master project board
├── TASKS-HERO.md              # Expert-level WebGL hero roadmap
├── TASKS-UI.md                # Next-gen UI / sections overhaul roadmap
├── public/
│   └── (reserved for local woff2 if self-hosting fonts later)
└── src/
    ├── main.js                # Bootstrap: init all modules, RAF loop, resize
    ├── style.css              # Design tokens, overlay UI, cursor, responsive
    ├── webgl/
    │   ├── scene.js           # Scene, camera, renderer, fog
    │   ├── particles.js       # Star field + nebula dust + rift emitters
    │   ├── nebula.js          # Procedural nebula plane (FBM shader)
    │   ├── rift.js            # Signature icosahedron portal
    │   ├── postprocessing.js  # Bloom + CA + vignette pipeline
    │   └── mouse-parallax.js  # Camera lerp + rift proximity
    ├── ui/
    │   ├── overlay.js         # DOM injection: nav, name, coords, CTA
    │   ├── intro-anim.js      # GSAP timeline: load bar → reveal → typewriter
    │   └── cursor.js          # Custom dot + ring cursor
    └── utils/
        ├── raf.js             # Unified animation loop with elapsed time
        └── resize.js          # Debounced resize → camera, renderer, composer
```

### Data Flow

```
index.html
    └── main.js
          ├── createScene()          → { scene, camera, renderer }
          ├── createParticles(scene) → update(time)
          ├── createNebula(scene)    → update(time)
          ├── createRift(scene)      → update(time, proximity)
          ├── createPostprocessing() → composer.render()
          ├── createMouseParallax()  → { target, proximity }
          ├── createOverlay()        → DOM
          ├── playIntro()            → GSAP timeline
          ├── initCursor()           → pointer UX
          └── createRAF([...callbacks])
```

---

## 4. Design System — "Deep Void"

### 4.1 Color Palette

```css
:root {
  --void:         #03030a;   /* Primary background — near-black with blue undertone */
  --deep:         #07071a;   /* Secondary space layer */
  --nebula-a:     #1a0a3d;   /* Dark purple — left nebula blob */
  --nebula-b:     #0d1f3c;   /* Midnight blue — right nebula blob */
  --dust:         #b8a0e8;   /* Lavender dust particles */
  --star:         #e8e4f0;   /* Off-white lilac stars */
  --rift:         #6e3fff;   /* Electric violet — primary accent */
  --rift-glow:    #a855f7;   /* Outer rift glow */
  --text-primary: #f4f0ff;   /* Primary text — white-lilac */
  --text-dim:     #6b6880;   /* Muted secondary text */
  --accent:       #7c3aed;   /* Hover / CTA accent */
}
```

**Design rule:** Purple-blue only. No acid green, no orange, no cyan spam. The rift is the visual anchor.

### 4.2 Typography

| Role | Family | Weight | Usage |
|------|--------|--------|-------|
| Display | Syne | 800 | Hero name "ARVIN EBRAHIMI" |
| Body | DM Sans | 300–500 | Eyebrow, general copy |
| Mono | JetBrains Mono | 300–400 | Nav links, coords, typewriter, CTA |

```css
--text-hero:  clamp(5rem, 12vw, 13rem);
--text-title: clamp(1.1rem, 2vw, 1.5rem);
--text-label: clamp(0.7rem, 1vw, 0.85rem);
```

Loaded via Google Fonts CDN in `style.css`.

### 4.3 Z-Index Stack

| Layer | z-index | Element |
|-------|---------|---------|
| WebGL canvas | 0 | `#canvas-container` |
| HTML overlay | 10 | `.overlay` |
| Custom cursor | 9998 | `.cursor-dot`, `.cursor-ring` |
| Loading bar | 9999 | `.loading-bar` |

### 4.4 Signature Element — The Rift

A deformed icosahedron at scene center:

- **Geometry:** `IcosahedronGeometry(1.2, 8)` — high subdivision for smooth displacement
- **Material:** Custom `ShaderMaterial` with 3D noise vertex displacement
- **Visual:** Fresnel edge glow, dark inner void, electric violet pulse
- **Interaction:** Mouse proximity amplifies displacement; camera parallax on move
- **Satellites:** Inner dark core mesh + outer torus ring (wireframe glow)
- **Particles:** 800 violet particles emitted from center, drifting outward

---

## 5. WebGL Module Specifications

### 5.1 `scene.js`

- `FogExp2(0x03030a, 0.035)` for depth
- `PerspectiveCamera(60, aspect, 0.1, 1000)` at `(0, 0, 5)`
- `WebGLRenderer` with `ACESFilmicToneMapping`, exposure `1.2`
- `setPixelRatio(Math.min(dpr, 2))` — cap for performance
- Append canvas to `#canvas-container`

### 5.2 `particles.js` — Three Layers

| Layer | Count | Distribution | Color | Motion |
|-------|-------|--------------|-------|--------|
| Star Field | 6,000 | Spherical r=50–200 | `#e8e4f0` | Slow Y/X rotation + twinkle shader |
| Nebula Dust | 3,000 | Gaussian cloud r≈3–15 | `#1a0a3d` → `#b8a0e8` | Per-vertex drift via sin/cos |
| Rift Particles | 800 | Emit from origin | `#6e3fff` → `#a855f7` | Radial velocity + fade |

All layers use `ShaderMaterial` with `AdditiveBlending`, `depthWrite: false`.

### 5.3 `nebula.js`

- `PlaneGeometry(20, 12)` at `z = -3`
- Fragment shader: 5-octave FBM noise
- Two blob masks (left `-0.3`, right `+0.3`) blended with palette colors
- Slow time-based animation (`uTime * 0.03`)
- Alpha max ~0.18 — subtle, never overpowering

### 5.4 `rift.js`

**Vertex shader:**
- 3D hash noise displacement on normals
- Breathing: `sin(uTime * 0.8) * 0.08`
- Mouse boost: `uMouse * noise * 0.2`

**Fragment shader:**
- Fresnel `pow(1 - dot(n, v), 2.5)` for edge glow
- Core dark void via `smoothstep` on position length
- Pulse: `0.85 + 0.15 * sin(uTime * 1.2)`

**Children:**
- Core: `IcosahedronGeometry(0.85, 4)`, `MeshBasicMaterial` dark
- Ring: `TorusGeometry(1.6, 0.02)`, slow Z rotation + scale pulse

### 5.5 `postprocessing.js`

Uses `postprocessing` package (NOT three/examples):

| Effect | Settings |
|--------|----------|
| Bloom | intensity 1.8, threshold 0.2, mipmapBlur |
| Chromatic Aberration | offset 0.0008, radialModulation true |
| Vignette | offset 0.35, darkness 0.7 |

`setChromaticIntensity(x, y)` — dynamic offset from mouse parallax target.

### 5.6 `mouse-parallax.js`

- Normalize mouse to `[-1, 1]` range
- Lerp factor `0.04` for smooth follow
- Camera offset: `x * 0.5`, `y * 0.3`, always `lookAt(0,0,0)`
- Return `proximity = max(0, 1 - dist(mouse))` for rift shader

---

## 6. UI Module Specifications

### 6.1 `overlay.js`

Inject fixed full-viewport overlay with:

- **Nav:** Logo "AE" + links (Work, About, Contact) with `data-cursor="expand"`
- **Center:** Eyebrow with pulsing dot, split-line hero name with per-char spans, typewriter subtitle
- **Bottom:** Tehran coords (35.6892° N, 51.3890° E), GitHub CTA, scroll hint

`pointer-events: none` on overlay; `pointer-events: all` on interactive children.

### 6.2 `intro-anim.js`

GSAP timeline sequence:

1. Loading bar scaleX 0→1 (1.2s)
2. Loading bar fade out (0.3s)
3. Name chars stagger from bottom (0.5s total stagger)
4. Eyebrow fade in
5. Nav slide down
6. Bottom bar slide up
7. Typewriter loop through: Three.js & WebGL, React & Next.js, Django & DRF, GSAP & Motion

Export `playIntro(onRiftReveal?)` for optional rift uniform callback.

### 6.3 `cursor.js`

- Dot (6px) follows mouse instantly via `gsap.set`
- Ring (36px) follows with lag via `gsap.ticker` lerp 0.1
- Hover `[data-cursor="expand"]`: ring scale 2.5, dot scale 0
- Canvas hover: ring color shift to `#7c3aed`

Hidden on mobile (`max-width: 768px`). `cursor: none` on body.

---

## 7. Utilities

### 7.1 `raf.js`

```js
createRAF(callbacks) → { stop }
```

- Single `requestAnimationFrame` loop
- Passes `elapsed` seconds since start to all callbacks
- Avoids multiple competing RAF loops

### 7.2 `resize.js`

```js
createResizeHandler({ camera, renderer, composer }) → { destroy }
```

- Debounced resize (150ms)
- Updates camera aspect, renderer size, composer size
- Re-applies `setPixelRatio(Math.min(dpr, 2))`

---

## 8. Performance & Quality

| Concern | Strategy |
|---------|----------|
| GPU fill rate | Cap DPR at 2 |
| Draw calls | Instanced particles via BufferGeometry |
| Shader cost | FBM limited to 5 octaves |
| Memory | No texture assets — all procedural |
| Mobile | Hide cursor + nav links, smaller hero type |
| Reduced motion | CSS `prefers-reduced-motion` kills animations |

### Target FPS

- Desktop 1080p: **60fps**
- Laptop integrated GPU: **45fps+**
- Mobile: degrade gracefully (future: reduce particle count)

---

## 9. Git Workflow Rules

> **Contributor identity:** All commits authored as `Arvin <ebrahimiarvin.official@gmail.com>`.  
> **Branch-per-task:** Each task below gets its own branch → commit → push → PR → merge to `main`.

| Branch | Scope | PR Title |
|--------|-------|----------|
| `docs/project-spec-and-tasks` | TASKS.md | docs: add project specification and task board |
| `feat/project-scaffold` | package.json, vite, index.html, .gitignore | feat: project scaffold with Vite and dependencies |
| `feat/webgl-core` | scene, particles, nebula, rift | feat: WebGL core — scene, particles, nebula, rift |
| `feat/webgl-effects` | postprocessing, mouse-parallax, utils | feat: post-processing pipeline and interaction utils |
| `feat/ui-layer` | overlay, intro-anim, cursor, style.css | feat: HTML overlay, GSAP intro, custom cursor |
| `feat/integration` | main.js, README | feat: wire all modules and update README |

---

## 10. Task Checklist

### Phase 0 — Documentation
- [x] **T-000** Create TASKS.md with full specification
- [x] **T-001** PR: `docs/project-spec-and-tasks` → `main`

### Phase 1 — Scaffold (`feat/project-scaffold`)
- [x] **T-100** `package.json` with three, gsap, postprocessing, vite
- [x] **T-101** `vite.config.js` with dev server config
- [x] **T-102** `index.html` — meta, `#canvas-container`, cursor elements
- [x] **T-103** `.gitignore` — node_modules, dist, .DS_Store, .env
- [x] **T-104** PR → merge

### Phase 2 — WebGL Core (`feat/webgl-core`)
- [x] **T-200** `scene.js` — fog, camera, ACES renderer
- [x] **T-201** `particles.js` — stars (6K) + dust (3K) + rift particles (800)
- [x] **T-202** `nebula.js` — FBM procedural nebula plane
- [x] **T-203** `rift.js` — displaced icosahedron + core + ring
- [x] **T-204** PR → merge

### Phase 3 — Effects & Utils (`feat/webgl-effects`)
- [x] **T-300** `postprocessing.js` — bloom, CA, vignette
- [x] **T-301** `mouse-parallax.js` — camera lerp + proximity
- [x] **T-302** `raf.js` — unified animation loop
- [x] **T-303** `resize.js` — debounced responsive handler
- [x] **T-304** PR → merge

### Phase 4 — UI Layer (`feat/ui-layer`)
- [x] **T-400** `style.css` — full design system, overlay, cursor, responsive
- [x] **T-401** `overlay.js` — nav, name, coords, CTA DOM
- [x] **T-402** `intro-anim.js` — GSAP timeline + typewriter
- [x] **T-403** `cursor.js` — dot + ring with expand states
- [x] **T-404** PR → merge

### Phase 5 — Integration (`feat/integration`)
- [x] **T-500** `main.js` — bootstrap all modules, RAF, resize
- [x] **T-501** `README.md` — install, build, feature list
- [x] **T-502** Verify `npm run dev` renders full experience
- [x] **T-503** Verify `npm run build` succeeds
- [x] **T-504** PR → merge

---

## 11. Acceptance Criteria (Final)

```
✓ Vite dev server starts without errors
✓ Canvas fills viewport at z-index 0
✓ 9,800 total particles render with twinkle + drift
✓ Nebula visible as subtle purple-blue clouds
✓ Rift pulses, reacts to mouse proximity
✓ Bloom makes rift and stars glow
✓ Chromatic aberration shifts with mouse
✓ Overlay text animates on load (GSAP intro)
✓ Typewriter cycles through 4 tech labels
✓ Custom cursor works on desktop, hidden on mobile
✓ prefers-reduced-motion disables animations
✓ npm run build produces dist/ without errors
✓ No framework dependencies in package.json
```

---

*Last updated: 2026-06-22 — Phase 3 complete · See TASKS-HERO.md & TASKS-UI.md for next phases*
