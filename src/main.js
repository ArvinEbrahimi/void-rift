import './style.css';
import { createScene } from './webgl/scene.js';
import { createCameraRig } from './webgl/scene/camera-rig.js';
import { createLightingRig } from './webgl/scene/lighting-rig.js';
import { createParticles } from './webgl/particles.js';
import { createNebulaVolume } from './webgl/environment/nebula-volume.js';
import { createRift } from './webgl/rift.js';
import { createRiftParticles } from './webgl/rift/rift-particles.js';
import { createPostprocessing } from './webgl/postprocessing.js';
import { createBloomTargetList } from './webgl/post/bloom-selective.js';
import { createMouseParallax } from './webgl/mouse-parallax.js';
import { createOverlay } from './ui/overlay.js';
import { createSections } from './ui/sections.js';
import { initMagnetic } from './ui/components/magnetic.js';
import { initSmoothNav } from './ui/nav.js';
import { playIntro } from './ui/intro-anim.js';
import { initCursor } from './ui/cursor.js';
import { createRAF } from './utils/raf.js';
import { createResizeHandler } from './utils/resize.js';
import { createScrollController } from './utils/scroll.js';
import { detectQualityTier, getTierConfig } from './utils/quality-tier.js';
import { createShell } from './ui/shell/shell.js';
import { createRiftEnvMap } from './webgl/environment/pmrem-env.js';
import { warmupShaders } from './utils/shader-warmup.js';
import { gsap } from 'gsap';

const tier = detectQualityTier();
const tierConfig = getTierConfig(tier);

const { scene, camera, renderer } = createScene();
const cameraRig = createCameraRig(camera);
const rift = createRift(scene, tierConfig);
const lightingRig = createLightingRig(scene, rift.group);
rift.bindLighting(lightingRig.uniforms);

const riftParticles = createRiftParticles(rift.group, tierConfig, camera);
const particles = createParticles(scene, tierConfig);
const nebula = createNebulaVolume(scene);

const envMap = createRiftEnvMap(renderer);
rift.applyEnvMap(envMap);

const bloomRoots = createBloomTargetList({ rift, riftParticles, particles, lightingRig });
const pp = createPostprocessing(renderer, scene, camera, tierConfig, bloomRoots);
const parallax = createMouseParallax();
const shell = createShell();

const fogDensity = scene.fog?.density ?? 0.032;
particles.setFogDensity(fogDensity * 0.012, fogDensity * 0.0001);
riftParticles.setFogDensity(fogDensity * 0.0008);

const overlay = createOverlay();
const { workUi } = createSections({
  starCount: tierConfig.starCount,
  dustCount: tierConfig.dustCount,
  riftCount: tierConfig.riftCount,
});
initCursor();
initMagnetic(document.querySelectorAll('.magnetic-target'));

const loadingBar = document.createElement('div');
loadingBar.className = 'loading-bar';
document.body.appendChild(loadingBar);

createResizeHandler({ camera, renderer, composer: pp.composer });

const parallaxState = { x: 0, y: 0 };
let scrollVelocity = 0;

const scroll = createScrollController({
  rift,
  overlay,
  onProgress(progress) {
    cameraRig.setScrollProgress(progress);
    lightingRig.setScrollProgress(progress);
    nebula.setParallax(parallaxState.x, progress);
    pp.setScrollProgress(progress);
  },
  onVelocity(vel) {
    scrollVelocity = vel;
  },
});

warmupShaders(renderer, scene, camera).catch(() => {});

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

const sections = ['work', 'stack', 'lab', 'about', 'contact'];
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

    const edgeFactor = Math.min(1, Math.hypot(target.x, target.y) * 1.2);

    cameraRig.setParallax(target.x, target.y);
    cameraRig.update(time);

    lightingRig.setMouseTarget(target.x, target.y);
    lightingRig.update(time, proximity);

    particles.setScrollVelocity(scrollVelocity);
    particles.update(time);
    nebula.setParallax(target.x, scroll.getProgress());
    nebula.update(time);
    rift.update(time, proximity);
    riftParticles.setScrollVelocity(scrollVelocity);
    riftParticles.update(time, rift.uniforms.uReveal.value);
    shell.telemetry.tickFrame();
    workUi.updateLiveStats(() => shell.telemetry.getFps());
    shell.setCursorCoords(
      (target.x + 1) * 0.5 * window.innerWidth,
      (1 - target.y) * 0.5 * window.innerHeight
    );
    pp.setChromaticIntensity(target.x, target.y, edgeFactor);
    pp.composer.render();
  },
]);
