import { createTelemetry } from '../components/telemetry.js';

const RAIL_SECTIONS = [
  { id: 'hero', label: 'Void', href: '#' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'stack', label: 'Stack', href: '#stack' },
  { id: 'lab', label: 'Lab', href: '#lab' },
  { id: 'process', label: 'Process', href: '#process' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'metrics', label: 'Metrics', href: '#metrics' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export function createShell() {
  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link';
  skipLink.href = '#work';
  skipLink.textContent = 'Skip to content';

  const rail = document.createElement('aside');
  rail.className = 'void-rail';
  rail.setAttribute('aria-label', 'Section progress');
  rail.innerHTML = `
    <div class="void-rail__track">
      <div class="void-rail__fill"></div>
    </div>
    <ul class="void-rail__dots">
      ${RAIL_SECTIONS.map(
        (s) => `
        <li class="void-rail__dot" data-section="${s.id}">
          <a class="void-rail__label" href="${s.href}">${s.label}</a>
          <span class="void-rail__marker" aria-hidden="true"></span>
        </li>`
      ).join('')}
    </ul>
  `;

  const status = document.createElement('footer');
  status.className = 'void-status';
  status.setAttribute('aria-label', 'System status');
  status.innerHTML = `
    <div class="void-status__group">
      <span class="void-status__tag">SYS.ONLINE</span>
      <span class="void-status__coords">
        <span>X</span><strong data-cursor-x>0000</strong>
        <span>Y</span><strong data-cursor-y>0000</strong>
      </span>
    </div>
    <a class="void-status__link" href="https://github.com/ArvinEbrahimi" target="_blank" rel="noopener noreferrer" data-cursor="expand">
      github.com/ArvinEbrahimi
    </a>
  `;

  const telemetry = createTelemetry();

  document.body.append(skipLink, rail, telemetry.root, status);

  const dots = rail.querySelectorAll('.void-rail__dot');
  const cursorX = status.querySelector('[data-cursor-x]');
  const cursorY = status.querySelector('[data-cursor-y]');

  function setActiveSection(id) {
    dots.forEach((dot) => {
      dot.classList.toggle('is-active', dot.dataset.section === id);
    });
  }

  function updateScrollState() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = window.scrollY / max;
    telemetry.setScrollPercent(pct);

    const probe = window.scrollY + window.innerHeight * 0.35;
    let active = 'hero';
    if (probe >= document.getElementById('contact')?.offsetTop) active = 'contact';
    else if (probe >= document.getElementById('metrics')?.offsetTop) active = 'metrics';
    else if (probe >= document.getElementById('about')?.offsetTop) active = 'about';
    else if (probe >= document.getElementById('process')?.offsetTop) active = 'process';
    else if (probe >= document.getElementById('lab')?.offsetTop) active = 'lab';
    else if (probe >= document.getElementById('stack')?.offsetTop) active = 'stack';
    else if (probe >= document.getElementById('work')?.offsetTop) active = 'work';
    setActiveSection(active);
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  return {
    telemetry,
    setCursorCoords(x, y) {
      cursorX.textContent = String(Math.round(x)).padStart(4, '0');
      cursorY.textContent = String(Math.round(y)).padStart(4, '0');
    },
    updateScrollState,
    destroy() {
      telemetry.destroy();
      window.removeEventListener('scroll', updateScrollState);
      skipLink.remove();
      rail.remove();
      telemetry.root.remove();
      status.remove();
    },
  };
}
