export const LAB_EXPERIMENTS = [
  {
    id: 'noise-viz',
    title: 'Noise Visualizer',
    type: 'live',
    desc: 'Real-time 2D FBM — the same math family behind the nebula shaders.',
    tags: ['Canvas', 'FBM', 'Live'],
    github: 'https://github.com/ArvinEbrahimi/void-rift',
    visual: 'noise',
  },
  {
    id: 'shader-toy',
    title: 'Rift Shell Shader',
    type: 'study',
    desc: 'Hex morph + ridged multifractal displacement on portal geometry.',
    tags: ['GLSL', 'Three.js'],
    github: 'https://github.com/ArvinEbrahimi/void-rift',
    visual: 'hex',
  },
  {
    id: 'scroll-motion',
    title: 'Scroll Choreography',
    type: 'study',
    desc: 'Unified scroll progress driving WebGL uniforms and UI fade.',
    tags: ['GSAP', 'Motion'],
    github: 'https://github.com/ArvinEbrahimi/void-rift',
    visual: 'scroll',
  },
  {
    id: 'particle-field',
    title: 'Particle Emitter',
    type: 'study',
    desc: 'Hex-edge emission, comet trails, and depth-sorted point clouds.',
    tags: ['WebGL', 'Particles'],
    github: 'https://github.com/ArvinEbrahimi/void-rift',
    visual: 'particles',
  },
];

export const BUILDING_NEXT = {
  title: 'Building Next',
  desc: 'Selective DOF pass, GLSL file split, and Lenis scroll sync — shipping in the next void cycle.',
  tags: ['WIP', 'Hero', 'Post-FX'],
};
