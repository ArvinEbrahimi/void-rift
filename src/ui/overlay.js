export function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <nav class="overlay__nav" aria-label="Primary">
      <a href="#" class="overlay__logo magnetic-target" data-cursor="expand" aria-label="Arvin Ebrahimi home">
        <span class="overlay__logo-mark">AE</span>
      </a>
      <ul class="overlay__links">
        <li><a href="#work" class="magnetic-target" data-cursor="expand">Work</a></li>
        <li><a href="#stack" class="magnetic-target" data-cursor="expand">Stack</a></li>
        <li><a href="#lab" class="magnetic-target" data-cursor="expand">Lab</a></li>
        <li><a href="#about" class="magnetic-target" data-cursor="expand">About</a></li>
        <li><a href="#contact" class="magnetic-target" data-cursor="expand">Contact</a></li>
      </ul>
    </nav>

    <div class="overlay__center">
      <p class="overlay__eyebrow">
        <span class="overlay__dot"></span>
        Full-Stack Developer &amp; Creative Technologist
      </p>

      <h1 class="overlay__name">
        <span class="overlay__name-line" data-line="1">
          ${'ARVIN'.split('').map((c) => `<span class="char">${c}</span>`).join('')}
        </span>
        <span class="overlay__name-line overlay__name-line--dim" data-line="2">
          ${'EBRAHIMI'.split('').map((c) => `<span class="char">${c}</span>`).join('')}
        </span>
      </h1>

      <p class="overlay__subtitle" aria-live="polite" aria-atomic="true">
        <span class="overlay__subtitle-text"></span>
        <span class="overlay__cursor-blink" aria-hidden="true">_</span>
      </p>

      <div class="overlay__ctas">
        <a class="overlay__cta overlay__cta--primary magnetic-target" href="#work" data-cursor="expand">
          View Work
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3V13M8 13L4 9M8 13L12 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </a>
        <a class="overlay__cta overlay__cta--ghost magnetic-target" href="https://github.com/ArvinEbrahimi" target="_blank" rel="noopener noreferrer" data-cursor="expand">
          GitHub
        </a>
      </div>
    </div>

    <div class="overlay__bottom">
      <div class="overlay__coords">
        <span class="overlay__coord-label">LAT</span>
        <span class="overlay__coord-val" id="coord-lat">35.6892° N</span>
        <span class="overlay__coord-label" style="margin-left:1.5rem">LON</span>
        <span class="overlay__coord-val" id="coord-lon">51.3890° E</span>
      </div>
      <div class="overlay__scroll-hint" aria-hidden="true">
        <div class="overlay__scroll-ring-wrap">
          <svg class="overlay__scroll-ring" viewBox="0 0 40 40" width="40" height="40">
            <circle class="overlay__scroll-ring-track" cx="20" cy="20" r="17" fill="none" stroke-width="1.5" />
            <circle
              class="overlay__scroll-ring-progress"
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke-width="1.5"
              stroke-dasharray="106.8"
              stroke-dashoffset="106.8"
              transform="rotate(-90 20 20)"
            />
          </svg>
          <svg class="overlay__scroll-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v6M6 8L4 6M6 8l2-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>SCROLL</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}
