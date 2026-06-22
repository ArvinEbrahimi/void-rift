import './style.css';
import { createScene } from './webgl/scene.js';
import { createCameraRig } from './webgl/scene/camera-rig.js';
import { createLightingRig } from './webgl/scene/lighting-rig.js';
import { createParticles } from './webgl/particles.js';
import { createNebulaVolume } from './webgl/environment/nebula-volume.js';
import { createRift } from './webgl/rift.js';
import { createPostprocessing } from './webgl/postprocessing.js';
import { createMouseParallax } from './webgl/mouse-parallax.js';
import { createOverlay } from './ui/overlay.js';
import { createSections } from './ui/sections.js';
import { initSmoothNav } from './ui/nav.js';
import { playIntro } from './ui/intro-anim.js';
import { initCursor } from './ui/cursor.js';
import { createRAF } from './utils/raf.js';
import { createResizeHandler } from './utils/resize.js';
import { createScrollController } from './utils/scroll.js';
import { gsap } from 'gsap';

const { scene, camera, renderer } = createScene();
const cameraRig = createCameraRig(camera);
const rift = createRift(scene);
const lightingRig = createLightingRig(scene, rift.group);
rift.bindLighting(lightingRig.uniforms);

const particles = createParticles(scene, rift.group);
const nebula = createNebulaVolume(scene);
const pp = createPostprocessing(renderer, scene, camera);
const parallax = createMouseParallax();

const overlay = createOverlay();
createSections();
initCursor();

const loadingBar = document.createElement('div');
loadingBar.className = 'loading-bar';
document.body.appendChild(loadingBar);

createResizeHandler({ camera, renderer, composer: pp.composer });

const parallaxState = { x: 0, y: 0 };

const scroll = createScrollController({
  rift,
  overlay,
  onProgress(progress) {
    cameraRig.setScrollProgress(progress);
    lightingRig.setScrollProgress(progress);
    nebula.setParallax(parallaxState.x, progress);
    pp.setScrollProgress(progress);
  },
});

window.addEventListener('load', () => {
  playIntro(() => {
    rift.reveal();
    cameraRig.playIntro();
    gsap.to(lightingRig.godRayMat.uniforms.uReveal, {
      value: 1,
      duration: 2.4,
      ease: 'power2.inOut',
    });
  });
  initSmoothNav();
});

const sections = ['work', 'about', 'contact'];
const navLinks = document.querySelectorAll('.overlay__links a');

function updateActiveNav() {
  const scrollPos = window.scrollY + window.innerHeight * 0.35;

  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    const link = navLinks[i];
    if (!el || !link) return;

    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    link.classList.toggle('is-active', scrollPos >= top && scrollPos < bottom);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

createRAF([
  (time) => {
    const { target, proximity } = parallax.update();
    parallaxState.x = target.x;
    parallaxState.y = target.y;

    cameraRig.setParallax(target.x, target.y);
    cameraRig.update();

    lightingRig.setMouseTarget(target.x, target.y);
    lightingRig.update(time, proximity);

    particles.update(time);
    nebula.setParallax(target.x, scroll.getProgress());
    nebula.update(time);
    rift.update(time, proximity);
    pp.setChromaticIntensity(target.x, target.y);
    pp.composer.render();
  },
]);
