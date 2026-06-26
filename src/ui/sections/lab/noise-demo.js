export function initNoiseDemo(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return { destroy() {} };

  let time = 0;
  let rafId = 0;
  let running = false;

  function hash(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  function noise(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }

  function fbm(x, y, t) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;
    for (let i = 0; i < 4; i++) {
      value += amp * noise(x * freq + t, y * freq + t * 0.7);
      freq *= 2.1;
      amp *= 0.5;
    }
    return value;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }

  function draw() {
    if (!running) return;
    const w = canvas.width;
    const h = canvas.height;
    const img = ctx.createImageData(w, h);
    const data = img.data;
    const scale = 0.006;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = fbm(x * scale, y * scale, time);
        const i = (y * w + x) * 4;
        data[i] = 18 + v * 80;
        data[i + 1] = 8 + v * 35;
        data[i + 2] = 45 + v * 140;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
    time += 0.012;
    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    draw();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
    },
    { threshold: 0.15 }
  );
  observer.observe(canvas);

  window.addEventListener('resize', resize);

  return {
    destroy() {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
    },
  };
}
