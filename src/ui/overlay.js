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

      <p class="overlay__subtitle">
        <span class="overlay__subtitle-text"></span>
        <span class="overlay__cursor-blink">_</span>
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
      <div class="overlay__scroll-hint">
        <span>SCROLL</span>
        <div class="overlay__scroll-line"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}
