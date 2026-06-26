import { PROJECTS } from './projects-data.js';

export function createWorkModal() {
  const backdrop = document.createElement('div');
  backdrop.className = 'work-modal-backdrop';
  backdrop.hidden = true;

  const panel = document.createElement('aside');
  panel.className = 'work-modal';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'work-modal-title');
  panel.hidden = true;
  panel.innerHTML = `
    <button type="button" class="work-modal__close" aria-label="Close panel">&times;</button>
    <p class="work-modal__label"></p>
    <h2 class="work-modal__title" id="work-modal-title"></h2>
    <p class="work-modal__meta"></p>
    <p class="work-modal__body"></p>
    <ul class="work-modal__tags"></ul>
    <a class="work-modal__link" href="#" target="_blank" rel="noopener noreferrer" data-cursor="expand">
      View repository
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </a>
  `;

  document.body.append(backdrop, panel);

  const labelEl = panel.querySelector('.work-modal__label');
  const titleEl = panel.querySelector('.work-modal__title');
  const metaEl = panel.querySelector('.work-modal__meta');
  const bodyEl = panel.querySelector('.work-modal__body');
  const tagsEl = panel.querySelector('.work-modal__tags');
  const linkEl = panel.querySelector('.work-modal__link');
  const closeBtn = panel.querySelector('.work-modal__close');

  let lastFocus = null;

  function close() {
    backdrop.hidden = true;
    panel.hidden = true;
    document.body.classList.remove('work-modal-open');
    if (lastFocus) lastFocus.focus();
  }

  function open(projectId) {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return;

    lastFocus = document.activeElement;
    labelEl.textContent = `// ${project.index} — Case Study`;
    titleEl.textContent = project.name;
    metaEl.textContent = `${project.year} · ${project.role}`;
    bodyEl.textContent = project.detail;
    tagsEl.innerHTML = project.tags.map((t) => `<li>${t}</li>`).join('');
    linkEl.href = project.link;

    backdrop.hidden = false;
    panel.hidden = false;
    document.body.classList.add('work-modal-open');
    closeBtn.focus();
  }

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) close();
  });

  return { open, close, panel };
}

export function initWorkFilters(root) {
  const chips = root.querySelectorAll('.work-filters__chip');
  const cards = root.querySelectorAll('.bento-card');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));

      cards.forEach((card) => {
        if (filter === 'all') {
          card.classList.remove('is-filtered-out');
          return;
        }
        const cats = card.dataset.categories || '';
        card.classList.toggle('is-filtered-out', !cats.includes(filter));
      });
    });
  });
}

export function initWorkInteractions(root, modal, options = {}) {
  initWorkFilters(root);

  root.querySelectorAll('.bento-card').forEach((card) => {
    const open = () => modal.open(card.dataset.projectId);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  const shadersEl = root.querySelector('[data-stat-shaders]');
  const particlesEl = root.querySelector('[data-stat-particles]');
  const fpsEl = root.querySelector('[data-stat-fps]');
  const tierEl = root.querySelector('[data-stat-tier]');

  if (options.stats) {
    const { starCount, dustCount, riftCount } = options.stats;
    if (particlesEl) {
      particlesEl.textContent = ((starCount + dustCount + riftCount) / 1000).toFixed(1) + 'K';
    }
    if (tierEl) tierEl.textContent = window.__VOID_TIER || 'B';
  }

  return {
    updateLiveStats(getFps) {
      if (fpsEl && getFps) fpsEl.textContent = String(getFps());
    },
  };
}
