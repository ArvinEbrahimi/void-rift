export function createSmoothScroll() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 768px)').matches;

  if (reduced || mobile) {
    return {
      scrollTo(y) {
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      },
      destroy() {},
    };
  }

  document.documentElement.classList.add('smooth-scroll-active');

  let target = window.scrollY;
  let current = window.scrollY;
  let rafId = 0;
  const ease = 0.11;

  function maxY() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clampY(y) {
    return Math.max(0, Math.min(maxY(), y));
  }

  function tick() {
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.6) {
      current = target;
      rafId = 0;
    } else {
      rafId = requestAnimationFrame(tick);
    }
    window.scrollTo(0, current);
  }

  function start() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function onWheel(e) {
    if (e.ctrlKey) return;
    e.preventDefault();
    target = clampY(target + e.deltaY);
    start();
  }

  function syncFromNative() {
    if (!rafId) {
      target = current = window.scrollY;
    }
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', syncFromNative, { passive: true });

  return {
    scrollTo(y) {
      target = clampY(y);
      start();
    },
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', syncFromNative);
      document.documentElement.classList.remove('smooth-scroll-active');
    },
  };
}
