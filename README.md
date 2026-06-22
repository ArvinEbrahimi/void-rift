# void-rift

A cinematic, space-themed hero section built with **Three.js** and **GSAP** — no frameworks, pure WebGL.

## What's inside

- Procedural nebula via GLSL FBM noise shader
- 9,800-particle triple-layer field (stars, nebula dust, rift emitters)
- Animated geometric rift with vertex displacement ShaderMaterial
- Full post-processing pipeline: Bloom + Chromatic Aberration + Vignette
- Mouse-reactive camera parallax and cursor-to-rift interaction
- Orchestrated GSAP intro timeline with per-character text animation
- Typewriter cycling through tech stack
- Coordinate display, scroll hint, and animated nav

## Tech Stack

- **Three.js r165** — WebGL rendering
- **GSAP 3** — intro animation and cursor
- **postprocessing** — bloom, chromatic aberration, vignette
- **Vite** — build tool
- Zero UI frameworks — Vanilla JS / HTML / CSS

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Live

[arvinebrahimi.dev](https://arvinebrahimi.dev)
