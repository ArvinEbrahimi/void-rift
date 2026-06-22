import './style.css';
import { createScene } from './webgl/scene.js';
import { createParticles } from './webgl/particles.js';
import { createNebula } from './webgl/nebula.js';
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

const { scene, camera, renderer } = createScene();
const rift = createRift(scene);
const particles = createParticles(scene, rift.group);
const nebula = createNebula(scene);
const pp = createPostprocessing(renderer, scene, camera);
const parallax = createMouseParallax(camera);

const overlay = createOverlay();
createSections();
initCursor();

const loadingBar = document.createElement('div');
loadingBar.className = 'loading-bar';
document.body.appendChild(loadingBar);

createResizeHandler({ camera, renderer, composer: pp.composer });
createScrollController({ rift, overlay });

window.addEventListener('load', () => {
  playIntro(() => rift.reveal());
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
    particles.update(time);
    nebula.update(time);
    rift.update(time, proximity);
    pp.setChromaticIntensity(target.x, target.y);
    pp.composer.render();
  },
]);
