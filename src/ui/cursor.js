import { gsap } from 'gsap';

export function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  function bindExpandCursor() {
    document.querySelectorAll('[data-cursor="expand"]:not([data-cursor-bound])').forEach((el) => {
      el.dataset.cursorBound = 'true';
      el.addEventListener('mouseenter', () => {
        gsap.to(ring, { scale: 2.5, borderColor: '#6e3fff', duration: 0.3 });
        gsap.to(dot, { scale: 0, duration: 0.3 });
        ring.classList.remove('is-crosshair');
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(ring, { scale: 1, borderColor: '#a855f7', duration: 0.3 });
        gsap.to(dot, { scale: 1, duration: 0.3 });
      });
    });
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dist = Math.hypot(mouseX - cx, mouseY - cy);
    const nearRift = dist < Math.min(window.innerWidth, window.innerHeight) * 0.18;

    if (nearRift && !ring.classList.contains('is-crosshair')) {
      ring.classList.add('is-crosshair');
      gsap.to(ring, { scale: 1.2, duration: 0.25 });
    } else if (!nearRift && ring.classList.contains('is-crosshair')) {
      ring.classList.remove('is-crosshair');
      gsap.to(ring, { scale: 1, borderColor: '#a855f7', duration: 0.25 });
    }
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    gsap.set(ring, { x: ringX, y: ringY });
  });

  bindExpandCursor();

  const observer = new MutationObserver(bindExpandCursor);
  observer.observe(document.body, { childList: true, subtree: true });

  const canvasContainer = document.querySelector('#canvas-container');
  if (canvasContainer) {
    canvasContainer.addEventListener('mouseenter', () => {
      if (!ring.classList.contains('is-crosshair')) {
        gsap.to(ring, { borderColor: '#7c3aed', opacity: 0.8, duration: 0.3 });
      }
    });
    canvasContainer.addEventListener('mouseleave', () => {
      ring.classList.remove('is-crosshair');
      gsap.to(ring, { borderColor: '#a855f7', opacity: 0.6, duration: 0.3 });
    });
  }
}
