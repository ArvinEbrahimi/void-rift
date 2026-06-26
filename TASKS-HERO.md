# TASKS-HERO — Cinematic WebGL Hero (Expert-Level)

> **Owner:** Arvin Ebrahimi  
> **Scope:** Full-viewport hero — Three.js scene, rift portal, particles, nebula, post-processing, scroll choreography  
> **Standard:** Must feel like it was art-directed and engineered by a senior Three.js / WebGL specialist — not a tutorial project.

---

## 0. Current State vs Target

### What exists today (Phase 1–3 baseline)

| Area | Status | Gap |
|------|--------|-----|
| Rift geometry | Multi-layer (shell, facets, tunnel, hex frame, rings, shards) | Layers feel stacked, not unified; no true material cohesion |
| Shaders | FBM, ridged noise, fresnel, veins | No PBR-adjacent lighting model; additive-only reads flat at times |
| Lighting | 2 point lights + ambient | No light rig, no shadows, no volumetric feel, no HDR environment |
| Particles | 9.8K total, hex-edge emit | No depth sorting finesse; stars/dust/rift don't feel depth-layered |
| Nebula | Procedural FBM plane | Reads as flat wallpaper; needs parallax depth + color grading |
| Post-FX | Bloom, CA, vignette | Missing film grain, depth of field, selective bloom mask |
| Camera | Static Z + mouse parallax | No dolly, no scroll-coupled focal length, no intro camera path |
| Performance | ~60fps desktop | No LOD, no mobile degradation strategy |
| Scroll | Rift shrink + overlay fade | No cinematic handoff to content; scroll velocity not used |

### Target feeling (one sentence)

> *"A living violet singularity — soft, deep, impossibly detailed — that breathes with the visitor before dissolving into the portfolio."*

---

## 1. Art Direction Pillars

| Pillar | Meaning | Anti-pattern |
|--------|---------|--------------|
| **Depth** | Clear foreground / mid / background separation | Everything glowing equally |
| **Softness** | Falloff, fog, smooth normals, no harsh clip | Hard polygon edges, over-sharpened bloom |
| **Restraint** | 3-second rule — awe, not overwhelm | Particle spam, rainbow colors |
| **Craft** | Every uniform has purpose | Copy-paste shader noise |
| **Motion** | Slow, intentional, physics-aware easing | Linear spins, jitter |

### Reference mood board (internal)

- Interstellar tesseract — geometric but organic
- Playstation Dreams menu — soft volumetric purple
- Bruno Simon portfolio — technical credibility
- Active Theory — cinematic pacing

---

## 2. Technical Architecture (Target)

```
src/webgl/
├── scene/
│   ├── setup.js              # renderer, tone mapping, color space, shadow map
│   ├── camera-rig.js         # intro path, scroll dolly, mouse parallax blend
│   └── lighting-rig.js       # key/fill/rim, animated probes, env map
├── environment/
│   ├── nebula-volume.js      # layered nebula planes or raymarched volume
│   ├── star-field.js         # octree / LOD star layers
│   └── dust-field.js         # curl-noise drift particles
├── rift/
│   ├── geometry.js           # (existing) + SDF-based hex portal refinement
│   ├── shaders/
│   │   ├── shell.glsl        # split vert/frag files
│   │   ├── tunnel.glsl
│   │   ├── filaments.glsl
│   │   └── uniforms.js       # shared uniform pool
│   ├── rift-composer.js      # assembles all rift layers + sorting
│   └── rift-particles.js     # emitters tied to portal edges (move from particles.js)
├── post/
│   ├── composer.js           # effect chain orchestration
│   ├── bloom-selective.js    # mask bloom to rift + bright stars only
│   ├── dof.js                # depth of field (optional Phase H-4)
│   └── color-grade.js        # LUT / lift-gamma-gain
└── scroll/
    ├── hero-scroll.js        # scroll progress → uniforms (unified)
    └── handoff.js            # hero → first section transition
```

---

## 3. Expert-Level Requirements by Domain

### 3.1 Geometry & Form

- [x] **H-GEO-01** Refine hex portal frame: beveled inner/outer radii, micro-gaps between frame and shell
- [x] **H-GEO-02** Replace tunnel cylinder with custom lathe profile — funnel into void, not straight pipe
- [x] **H-GEO-03** Shell: blend icosahedron → hex-prism via vertex shader morph (`uHexMorph` 0–1)
- [x] **H-GEO-04** Inner void: inverted hemisphere + black hole disc (accretion shader)
- [x] **H-GEO-05** Orbital shards: vary geometry (tetra / octa / custom) per instance, not identical
- [x] **H-GEO-06** Add thin energy ribbons (Catmull-Rom curves) orbiting portal on 3 axes
- [ ] **H-GEO-07** LOD: far = merged mesh + simplified shader; near = full detail

- [ ] **H-MAT-01** Split monolithic `shaders.js` into `.glsl` files with Vite `?raw` import
- [x] **H-MAT-02** Shell shader v2 (partial — key/rim wrap lighting, 6-octave FBM, thickness absorption):
  - 6-octave FBM displacement
  - Ridged multifractal for crystal facets
  - Hex-domain repetition for panel lines
  - Thickness-aware fresnel (view-dependent absorption)
  - Subsurface scatter fake (wrap lighting term)
- [x] **H-MAT-03** Tunnel shader v2: logarithmic spiral UV, depth fog inside tunnel, event horizon darkening
- [x] **H-MAT-04** Unified `uQuality` uniform — degrades octaves on mobile
- [ ] **H-MAT-05** Temporal stability — no shader flicker at grazing angles (clamp derivatives)
- [ ] **H-MAT-06** Normal reconstruction from displacement for accurate fresnel

### 3.3 Lighting (Critical — highest impact)

- [x] **H-LGT-01** **Lighting rig** module with named roles:
  | Light | Type | Role |
  |-------|------|------|
  | Key | Spot / Point | Main violet highlight on rift upper-left |
  | Fill | Hemisphere | Cool deep purple ambient fill |
  | Rim | Point (animated) | Orbits slowly — edge separation |
  | Core | Point (pulse) | Inner void illumination |
  | Accent | 6× micro points | Hex corner highlights |
- [x] **H-LGT-02** Light color temps: key `#c4a0ff`, fill `#0a0520`, rim `#7c3aed`
- [x] **H-LGT-03** Mouse influences key light position (subtle, lerped)
- [x] **H-LGT-04** Scroll dims key / brightens fill (hero → content handoff)
- [x] **H-LGT-05** Optional: PMREM env map from procedural cube render for hex frame metalness
- [x] **H-LGT-06** Fake volumetric: additive cone meshes or god-ray shader aligned to key light

### 3.4 Softness & Atmosphere

- [x] **H-ATM-01** Layered fog: near `FogExp2` + far custom shader fog on particles
- [x] **H-ATM-02** Nebula → 3 parallax planes at Z = -2, -5, -9 with different scroll factors
- [x] **H-ATM-03** Depth-based particle opacity (fade with distance from camera)
- [x] **H-ATM-04** Soft particle edges: gaussian falloff in fragment, not hard `discard` circle
- [x] **H-ATM-05** Vignette driven by scroll (opens up as user scrolls down)
- [x] **H-ATM-06** Subtle film grain post-pass (animated, low opacity)

### 3.5 Motion & Choreography

- [x] **H-MOT-01** Intro camera path (GSAP + custom curve): start Z=8 → settle Z=5 over 3s
- [x] **H-MOT-02** Rift reveal: scale + `uReveal` + light intensity — single orchestrated timeline
- [x] **H-MOT-03** Breathing: multi-frequency sine stack (not single `sin(time)`)
- [x] **H-MOT-04** Scroll-linked: rift scale, Y offset, tunnel twist, particle emit rate (partial)
- [x] **H-MOT-05** Velocity-aware scroll: fast scroll stretches particle size (motion blur hint)
- [x] **H-MOT-06** Idle state: after 8s no input, subtle autonomous camera drift
- [x] **H-MOT-07** `prefers-reduced-motion`: freeze displacement, instant reveal, no camera path

### 3.6 Post-Processing (Cinematic)

- [x] **H-POST-01** Selective bloom — luminance mask from rift + stars only
- [x] **H-POST-02** Bloom levels: mipmap chain tuning (levels 7–9, radius 0.68)
- [x] **H-POST-03** Chromatic aberration: radial, stronger at viewport edges, mouse-offset
- [x] **H-POST-04** Color grading pass (partial — BrightnessContrast + scroll vignette)
- [ ] **H-POST-05** Optional DOF: focus on rift, blur nebula background (Performance Tier B+)
- [x] **H-POST-06** Anti-banding: subtle dither in final composite (NoiseEffect overlay)

### 3.7 Particles (Expert tier)

- [x] **H-PRT-01** Move rift particles to `rift/rift-particles.js`, sync emit with `uReveal`
- [x] **H-PRT-02** Star field: color temperature variation (blue giant → white dwarf)
- [x] **H-PRT-03** Dust: curl noise velocity field (GPU-friendly simplified version)
- [x] **H-PRT-04** Comet trails on 1% of rift particles (short line segment history)
- [x] **H-PRT-05** Sort particles back-to-front within rift group (custom sort every N frames)
- [x] **H-PRT-06** Mobile: 6K → 2K stars, 1.4K → 400 rift particles

### 3.8 Performance & Quality Tiers

| Tier | Device | Particles | Shader octaves | Post-FX |
|------|--------|-----------|----------------|---------|
| A | Desktop discrete GPU | Full | 6 | All |
| B | Laptop integrated | 70% | 4 | No DOF |
| C | Mobile | 30% | 3 | Bloom only |

- [x] **H-PERF-01** `detectTier()` on init, expose `window.__VOID_TIER` for debug
- [x] **H-PERF-02** Pause RAF when tab hidden (`document.visibilityState`)
- [x] **H-PERF-03** Shader compile cache warm-up during loading bar
- [ ] **H-PERF-04** Target: 60fps @ 1080p Tier A, 45fps Tier B

---

## 4. Implementation Phases & Branches

| Phase | Branch | Tasks | Est. |
|-------|--------|-------|------|
| **H-1** | `feat/hero-lighting-rig` | H-LGT-01 → 06, scene ambient overhaul | 1 PR |
| **H-2** | `feat/hero-shader-v2` | H-MAT-01 → 06, GLSL file split | 1 PR |
| **H-3** | `feat/hero-geometry-refine` | H-GEO-01 → 07 | 1 PR |
| **H-4** | `feat/hero-atmosphere` | H-ATM-01 → 06, nebula parallax layers | 1 PR |
| **H-5** | `feat/hero-camera-motion` | H-MOT-01 → 07, scroll handoff | 1 PR |
| **H-6** | `feat/hero-post-cinematic` | H-POST-01 → 06 | 1 PR |
| **H-7** | `feat/hero-particles-v2` | H-PRT-01 → 06 | 1 PR |
| **H-8** | `feat/hero-perf-tiers` | H-PERF-01 → 04, mobile LOD | 1 PR |

> **Rule:** Each branch → commit (Arvin author) → push → PR → merge `main`

---

## 5. Acceptance Criteria (Hero Done)

```
□ First 3 seconds: loading → rift birth → name reveal feels cinematic, not rushed
□ Rift reads as single cohesive object, not floating parts
□ Lighting creates clear volume — dark center, bright edges, soft falloff
□ Nebula has perceived depth (parallax on mouse + scroll)
□ Mouse interaction feels responsive but weighted (lerp ≥ 0.03)
□ Scroll 0→100vh: rift shrinks, camera dollies, overlay fades — no pop
□ No visible shader flicker, z-fighting, or particle clipping through shell
□ Bloom never blows out entire screen — selective, controlled
□ 60fps on RTX 2060 / M1 Pro equivalent at 1080p
□ Mobile Tier C: graceful, still beautiful, no crash
□ prefers-reduced-motion: fully functional static hero
□ Code: GLSL in separate files, lighting rig documented, uniforms named consistently
```

---

## 6. Debug & Review Checklist

Before marking any hero phase complete, verify:

- [ ] Screenshot at T=0s, 1s, 3s, 5s of intro
- [ ] Screen recording: mouse orbit + scroll full hero exit
- [ ] Chrome DevTools Performance: no long tasks > 50ms
- [ ] Firefox + Safari smoke test
- [ ] Compare against mood board — does it feel *expensive*?

---

## 7. Task Index (Quick Reference)

| ID | Task | Priority |
|----|------|----------|
| H-LGT-01 | Lighting rig module | P0 |
| H-MAT-02 | Shell shader v2 | P0 |
| H-ATM-02 | Nebula parallax layers | P0 |
| H-MOT-01 | Intro camera path | P0 |
| H-POST-01 | Selective bloom | P0 |
| H-GEO-03 | Hex morph shell | P1 |
| H-PRT-03 | Curl noise dust | P1 |
| H-POST-05 | Depth of field | P2 |
| H-PERF-01 | Quality tiers | P1 |

---

*Created: 2026-06-22 — Hero expert overhaul roadmap*
