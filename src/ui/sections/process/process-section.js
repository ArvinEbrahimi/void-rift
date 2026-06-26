const STEPS = [
  {
    id: 'discover',
    title: 'Discover',
    desc: 'Map constraints, users, and the emotional job the interface must do.',
    icon: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M15 15l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'design',
    title: 'Design',
    desc: 'Typography, motion language, and system tokens before pixels multiply.',
    icon: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="16" y="10" width="4" height="4" stroke="currentColor" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'build',
    title: 'Build',
    desc: 'Ship vertical slices — API, UI, and motion wired together early.',
    icon: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6L4 12l4 6M16 6l4 6-4 6M14 4l-4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'ship',
    title: 'Ship',
    desc: 'Performance budgets, accessibility checks, and deploy with observability.',
    icon: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 15l7-7 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 8v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'iterate',
    title: 'Iterate',
    desc: 'Measure, refine shaders and flows — polish is a loop, not a phase.',
    icon: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12a7 7 0 0112.5-4M19 12a7 7 0 01-12.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 5h3v3M8 19H5v-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
];

const PHILOSOPHY =
  'Ship fast, polish forever — performance and craft are the same discipline.';

function renderStep(step, index) {
  return `
    <li class="process-step" data-step="${step.id}">
      <div class="process-step__icon">${step.icon}</div>
      <span class="process-step__num">0${index + 1}</span>
      <h3 class="process-step__title">${step.title}</h3>
      <p class="process-step__desc">${step.desc}</p>
    </li>
  `;
}

export function createProcessSectionHTML() {
  return `
    <section id="process" class="section section--process">
      <div class="section__inner section__inner--wide">
        <div class="section__head">
          <p class="section__label">// 04 — Process</p>
          <h2 class="section__title">How I build</h2>
        </div>

        <div class="process-timeline" data-process-timeline>
          <svg class="process-timeline__defs" width="0" height="0" aria-hidden="true">
            <defs>
              <linearGradient id="process-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#6e3fff"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
          <svg class="process-timeline__line" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
            <line class="process-timeline__track" x1="0" y1="2" x2="1000" y2="2" />
            <line class="process-timeline__draw" x1="0" y1="2" x2="1000" y2="2" />
          </svg>
          <ol class="process-timeline__steps">
            ${STEPS.map(renderStep).join('')}
          </ol>
        </div>

        <blockquote class="process-quote">
          <p>${PHILOSOPHY}</p>
        </blockquote>
      </div>
    </section>
  `;
}

export function initProcessTimeline(root) {
  const timeline = root.querySelector('[data-process-timeline]');
  const drawLine = timeline?.querySelector('.process-timeline__draw');
  if (!drawLine) return;

  const length = 1000;
  drawLine.style.strokeDasharray = String(length);
  drawLine.style.strokeDashoffset = String(length);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        timeline.classList.toggle('is-animated', entry.isIntersecting);
        drawLine.style.strokeDashoffset = entry.isIntersecting ? '0' : String(length);
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(timeline);
}
