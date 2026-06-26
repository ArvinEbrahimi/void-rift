export function createScrollController({ rift, overlay, onProgress, onVelocity }) {
  let progress = 0;
  let velocity = 0;
  let lastY = window.scrollY;
  let lastT = performance.now();

  function update() {
    const now = performance.now();
    const dt = Math.max(8, now - lastT);
    const dy = window.scrollY - lastY;
    velocity += (dy / dt - velocity) * 0.22;
    lastY = window.scrollY;
    lastT = now;

    const heroHeight = window.innerHeight;
    const maxScroll = heroHeight * 0.85;
    progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

    rift.setScrollProgress(progress);

    if (overlay) {
      overlay.style.setProperty('--scroll-progress', progress.toFixed(3));
      overlay.classList.toggle('overlay--scrolled', progress > 0.15);
    }

    if (onProgress) onProgress(progress);
    if (onVelocity) onVelocity(velocity);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  return {
    getProgress: () => progress,
    getVelocity: () => velocity,
    destroy() {
      window.removeEventListener('scroll', update);
    },
  };
}
