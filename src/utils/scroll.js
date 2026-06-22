export function createScrollController({ rift, overlay, onProgress }) {
  let progress = 0;

  function update() {
    const heroHeight = window.innerHeight;
    const maxScroll = heroHeight * 0.85;
    progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

    rift.setScrollProgress(progress);

    if (overlay) {
      overlay.style.setProperty('--scroll-progress', progress.toFixed(3));
      overlay.classList.toggle('overlay--scrolled', progress > 0.15);
    }

    if (onProgress) onProgress(progress);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  return {
    getProgress: () => progress,
    destroy() {
      window.removeEventListener('scroll', update);
    },
  };
}
