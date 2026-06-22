import { gsap } from 'gsap';

export function createCameraRig(camera) {
  const base = { x: 0, y: 0, z: 5 };
  const parallax = { x: 0, y: 0 };
  let scrollProgress = 0;
  let introComplete = false;

  camera.position.set(base.x, base.y, 8);
  camera.lookAt(0, 0, 0);

  return {
    playIntro() {
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
    update() {
      const scrollDolly = scrollProgress * 1.8;
      const px = parallax.x * 0.5;
      const py = parallax.y * 0.3;

      if (introComplete) {
        camera.position.x = px;
        camera.position.y = py - scrollProgress * 0.4;
        camera.position.z = base.z + scrollDolly;
      }

      camera.lookAt(px * 0.3, py * 0.2 - scrollProgress * 0.2, 0);
    },
  };
}
