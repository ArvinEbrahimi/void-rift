import './style.css';
import { createScene } from './webgl/scene.js';
import { createParticles } from './webgl/particles.js';
import { createNebula } from './webgl/nebula.js';
import { createRift } from './webgl/rift.js';
import { createPostprocessing } from './webgl/postprocessing.js';
import { createMouseParallax } from './webgl/mouse-parallax.js';
import { createOverlay } from './ui/overlay.js';
import { playIntro } from './ui/intro-anim.js';
import { initCursor } from './ui/cursor.js';
import { createRAF } from './utils/raf.js';
import { createResizeHandler } from './utils/resize.js';

const { scene, camera, renderer } = createScene();
const particles = createParticles(scene);
const nebula = createNebula(scene);
const rift = createRift(scene);
const pp = createPostprocessing(renderer, scene, camera);
const parallax = createMouseParallax(camera);

createOverlay();
initCursor();

const loadingBar = document.createElement('div');
loadingBar.className = 'loading-bar';
document.body.appendChild(loadingBar);

createResizeHandler({ camera, renderer, composer: pp.composer });

window.addEventListener('load', () => playIntro());

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
