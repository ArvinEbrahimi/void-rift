import { PROJECTS } from './projects-data.js';

const ARROW_SVG = `
  <svg class="bento-card__arrow-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3 14L14 3M14 3H7M14 3V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
`;

function renderStats(featured) {
  if (!featured) return '';
  return `
    <ul class="bento-card__stats" aria-label="Live project stats">
      <li><span>Shaders</span><strong data-stat-shaders>12</strong></li>
      <li><span>Particles</span><strong data-stat-particles>—</strong></li>
      <li><span>FPS</span><strong data-stat-fps>60</strong></li>
      <li><span>Tier</span><strong data-stat-tier>${window.__VOID_TIER || 'B'}</strong></li>
    </ul>
  `;
}

function renderCard(project) {
  const cats = project.categories.join(' ');
  const featuredClass = project.featured ? ' bento-card--featured' : '';
  const visualClass = project.visual ? ` bento-card__visual--${project.visual}` : '';

  return `
    <article
      class="bento-card${featuredClass}"
      data-project-id="${project.id}"
      data-categories="${cats}"
      data-cursor="expand"
      tabindex="0"
      role="button"
      aria-label="Open ${project.name} case study"
    >
      <div class="bento-card__visual${visualClass}" aria-hidden="true"></div>
      <div class="bento-card__body">
        <header class="bento-card__header">
          <span class="bento-card__index">${project.index}</span>
          <span class="bento-card__meta">${project.year} · ${project.role}</span>
        </header>
        <h3 class="bento-card__name">${project.name}</h3>
        <p class="bento-card__desc">${project.desc}</p>
        ${renderStats(project.featured)}
        <footer class="bento-card__footer">
          <ul class="bento-card__tags">
            ${project.tags.map((t) => `<li>${t}</li>`).join('')}
          </ul>
          <a
            class="bento-card__arrow magnetic-target"
            href="${project.link}"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="expand"
            aria-label="View ${project.name} on GitHub"
            onclick="event.stopPropagation()"
          >${ARROW_SVG}</a>
        </footer>
      </div>
    </article>
  `;
}

export function createWorkSectionHTML() {
  return `
    <section id="work" class="section section--work">
      <div class="section__inner section__inner--wide">
        <div class="section__head">
          <p class="section__label">// 01 — Work</p>
          <h2 class="section__title">Projects across the stack</h2>
        </div>

        <div class="work-filters" role="toolbar" aria-label="Filter projects">
          <button type="button" class="work-filters__chip is-active" data-filter="all">All</button>
          <button type="button" class="work-filters__chip" data-filter="webgl">WebGL</button>
          <button type="button" class="work-filters__chip" data-filter="fullstack">Full-Stack</button>
          <button type="button" class="work-filters__chip" data-filter="motion">Motion</button>
        </div>

        <div class="bento" data-bento-grid>
          ${PROJECTS.map(renderCard).join('')}
        </div>
      </div>
    </section>
  `;
}
