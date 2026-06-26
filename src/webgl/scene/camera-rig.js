import { gsap } from 'gsap';

export function createCameraRig(camera) {
  const base = { x: 0, y: 0, z: 5 };
  const parallax = { x: 0, y: 0 };
  let scrollProgress = 0;
  let introComplete = false;
  let lastInput = performance.now();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    camera.position.set(base.x, base.y, base.z);
    introComplete = true;
  } else {
    camera.position.set(base.x, base.y, 8);
  }
  camera.lookAt(0, 0, 0);

  const onInput = () => {
    lastInput = performance.now();
  };
  window.addEventListener('mousemove', onInput, { passive: true });
  window.addEventListener('scroll', onInput, { passive: true });

  return {
    playIntro() {
      if (reducedMotion) {
        introComplete = true;
        return null;
      }
      return gsap.to(camera.position, {
        z: base.z,
        duration: 2.8,
        ease: 'power3.out',
        onComplete: () => {
          introComplete = true;
        },
      });
    },
    setParallax(x, y) {
      parallax.x = x;
      parallax.y = y;
    },
    setScrollProgress(progress) {
      scrollProgress = progress;
    },
    update(time) {
      if (!introComplete) return;

      const scrollDolly = scrollProgress * 1.8;
      let px = parallax.x * 0.5;
      let py = parallax.y * 0.3;

      const idle = (performance.now() - lastInput) / 1000;
      if (!reducedMotion && idle > 8) {
        px += Math.sin(time * 0.12) * 0.08;
        py += Math.cos(time * 0.1) * 0.05;
      }

      camera.position.x = px;
      camera.position.y = py - scrollProgress * 0.4;
      camera.position.z = base.z + scrollDolly;
      camera.lookAt(px * 0.3, py * 0.2 - scrollProgress * 0.2, 0);
    },
  };
}
