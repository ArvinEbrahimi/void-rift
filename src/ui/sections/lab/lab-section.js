import { LAB_EXPERIMENTS, BUILDING_NEXT } from './lab-data.js';
import { initNoiseDemo } from './noise-demo.js';

const GITHUB_ICON = `
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1.5C4.41 1.5 1.5 4.5 1.5 8.2c0 3 1.95 5.54 4.66 6.44.34.06.47-.15.47-.33 0-.16-.01-.7-.01-1.27-1.9.35-2.3-.8-2.3-.8-.31-.8-.76-1.01-.76-1.01-.62-.43.05-.42.05-.42.69.05 1.05.72 1.05.72.61 1.06 1.6.75 1.99.57.06-.45.24-.75.44-.92-1.52-.14-3.12-.76-3.12-3.4 0-.75.27-1.36.71-1.84-.07-.17-.31-.86.07-1.79 0 0 .58-.19 1.9.7.55-.15 1.14-.23 1.73-.23.59 0 1.18.08 1.73.23 1.32-.9 1.9-.7 1.9-.7.38.93.14 1.62.07 1.79.44.48.71 1.09.71 1.84 0 2.65-1.6 3.26-3.13 3.4.25.22.47.64.47 1.29 0 .93-.01 1.68-.01 1.9 0 .19.13.4.47.33A6.51 6.51 0 0014.5 8.2C14.5 4.5 11.59 1.5 8 1.5z" fill="currentColor"/>
  </svg>
`;

function renderExperiment(exp, index) {
  const isLive = exp.type === 'live';
  const liveClass = isLive ? ' lab-card--live' : '';
  const visualClass = exp.visual ? ` lab-card__preview--${exp.visual}` : '';

  return `
    <article class="lab-card${liveClass}" data-cursor="expand">
      <div class="lab-card__preview${visualClass}">
        ${isLive ? '<canvas class="lab-card__canvas" data-noise-demo aria-label="Live noise visualizer"></canvas><span class="lab-card__live-badge">LIVE</span>' : ''}
      </div>
      <div class="lab-card__body">
        <span class="lab-card__index">0${index + 1}</span>
        <h3 class="lab-card__title">${exp.title}</h3>
        <p class="lab-card__desc">${exp.desc}</p>
        <ul class="lab-card__tags">
          ${exp.tags.map((t) => `<li>${t}</li>`).join('')}
        </ul>
        <a class="lab-card__source" href="${exp.github}" target="_blank" rel="noopener noreferrer" data-cursor="expand">
          ${GITHUB_ICON}
          View source
        </a>
      </div>
    </article>
  `;
}

function renderBuildingNext() {
  return `
    <article class="lab-card lab-card--next" data-cursor="expand">
      <div class="lab-card__preview lab-card__preview--next">
        <span class="lab-card__next-pulse" aria-hidden="true"></span>
      </div>
      <div class="lab-card__body">
        <span class="lab-card__index lab-card__index--wip">WIP</span>
        <h3 class="lab-card__title">${BUILDING_NEXT.title}</h3>
        <p class="lab-card__desc">${BUILDING_NEXT.desc}</p>
        <ul class="lab-card__tags">
          ${BUILDING_NEXT.tags.map((t) => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </article>
  `;
}

export function createLabSectionHTML() {
  return `
    <section id="lab" class="section section--lab">
      <div class="section__inner section__inner--wide">
        <div class="section__head">
          <p class="section__label">// 03 — Lab</p>
          <h2 class="section__title">Experiments &amp; shader toys</h2>
        </div>
        <div class="lab-grid">
          ${LAB_EXPERIMENTS.map(renderExperiment).join('')}
          ${renderBuildingNext()}
        </div>
      </div>
    </section>
  `;
}

export function initLabSection(root) {
  const canvas = root.querySelector('[data-noise-demo]');
  if (!canvas) return { destroy() {} };
  return initNoiseDemo(canvas);
}
