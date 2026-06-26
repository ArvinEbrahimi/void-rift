const TEHRAN_TZ = 'Asia/Tehran';
const VERSION = 'v1.0.0';

function formatTehranTime(date = new Date()) {
  return date.toLocaleTimeString('en-GB', {
    timeZone: TEHRAN_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function createTelemetry() {
  let fps = 60;
  let scrollPct = 0;
  let frameCount = 0;
  let lastSample = performance.now();

  const root = document.createElement('header');
  root.className = 'void-telemetry';
  root.setAttribute('aria-label', 'System telemetry');
  root.innerHTML = `
  <div class="void-telemetry__group">
    <div class="void-telemetry__pill">
      <span class="void-telemetry__pill-dot" aria-hidden="true"></span>
      <strong>Available</strong>
      <span>for hire</span>
    </div>
    <div class="void-telemetry__item">
      <span>FPS</span>
      <strong data-fps>60</strong>
    </div>
    <div class="void-telemetry__item void-telemetry__group--meta">
      <span>TEH</span>
      <strong data-time>--:--:--</strong>
    </div>
  </div>
  <div class="void-telemetry__group void-telemetry__group--meta">
    <div class="void-telemetry__item">
      <span>SCROLL</span>
      <strong data-scroll>0%</strong>
    </div>
    <div class="void-telemetry__item">
      <span>TIER</span>
      <strong data-tier>${window.__VOID_TIER || 'B'}</strong>
    </div>
    <div class="void-telemetry__item">
      <span>BUILD</span>
      <strong>${VERSION}</strong>
    </div>
  </div>
`;

  const fpsEl = root.querySelector('[data-fps]');
  const timeEl = root.querySelector('[data-time]');
  const scrollEl = root.querySelector('[data-scroll]');

  function tickClock() {
    timeEl.textContent = formatTehranTime();
  }

  tickClock();
  const clockInterval = setInterval(tickClock, 1000);

  return {
    root,
    tickFrame() {
      frameCount++;
      const now = performance.now();
      if (now - lastSample >= 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastSample));
        frameCount = 0;
        lastSample = now;
        fpsEl.textContent = String(fps);
      }
    },
    setScrollPercent(pct) {
      scrollPct = pct;
      scrollEl.textContent = `${Math.round(pct * 100)}%`;
      document.documentElement.style.setProperty('--page-scroll', pct.toFixed(4));
    },
    getFps: () => fps,
    destroy() {
      clearInterval(clockInterval);
    },
  };
}
