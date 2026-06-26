const METRICS = [
  { id: 'projects', label: 'Projects shipped', value: 24, suffix: '+' },
  { id: 'years', label: 'Years experience', value: 5, suffix: '+' },
  { id: 'tech', label: 'Technologies', value: 18, suffix: '' },
  { id: 'repos', label: 'Public repos', value: 32, suffix: '' },
];

const LANGUAGES = [
  { name: 'TypeScript / JS', pct: 38 },
  { name: 'Python', pct: 28 },
  { name: 'GLSL / Shader', pct: 14 },
  { name: 'CSS / HTML', pct: 12 },
  { name: 'Other', pct: 8 },
];

function renderMetric(m) {
  return `
    <li class="metrics-stat" data-count="${m.value}" data-suffix="${m.suffix}">
      <strong class="metrics-stat__value">0${m.suffix}</strong>
      <span class="metrics-stat__label">${m.label}</span>
    </li>
  `;
}

export function createMetricsSectionHTML() {
  return `
    <section id="metrics" class="section section--metrics">
      <div class="section__inner section__inner--wide">
        <p class="section__label">// 06 — Metrics</p>
        <h2 class="section__title">Lines of craft</h2>
        <p class="metrics__note">Static snapshot — GitHub API integration planned for live data.</p>

        <ul class="metrics-stats" data-metrics-counters>
          ${METRICS.map(renderMetric).join('')}
        </ul>

        <div class="metrics-lang">
          <h3 class="metrics-lang__title">Language focus</h3>
          <ul class="metrics-lang__bars">
            ${LANGUAGES.map(
              (l) => `
              <li class="metrics-lang__row">
                <span class="metrics-lang__name">${l.name}</span>
                <div class="metrics-lang__track">
                  <div class="metrics-lang__fill" style="--pct: ${l.pct}%"></div>
                </div>
                <span class="metrics-lang__pct">${l.pct}%</span>
              </li>`
            ).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

export function initMetricsCounters(root) {
  const stats = root.querySelectorAll('.metrics-stat[data-count]');
  if (!stats.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateStat(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const valueEl = el.querySelector('.metrics-stat__value');
    if (!valueEl || reduced) {
      if (valueEl) valueEl.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      valueEl.textContent = `${Math.round(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((el) => observer.observe(el));
}
