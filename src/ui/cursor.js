import { gsap } from 'gsap';

export function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    gsap.set(ring, { x: ringX, y: ringY });
  });

  document.querySelectorAll('[data-cursor="expand"]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(ring, { scale: 2.5, borderColor: '#6e3fff', duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(ring, { scale: 1, borderColor: '#a855f7', duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    });
  });

  const canvasContainer = document.querySelector('#canvas-container');
  if (canvasContainer) {
    canvasContainer.addEventListener('mouseenter', () => {
      gsap.to(ring, { borderColor: '#7c3aed', opacity: 0.8, duration: 0.3 });
    });
    canvasContainer.addEventListener('mouseleave', () => {
      gsap.to(ring, { borderColor: '#a855f7', opacity: 0.6, duration: 0.3 });
    });
  }
}
