export function createFooter({ onBackToVoid } = {}) {
  const footer = document.createElement('footer');
  footer.className = 'void-footer';
  footer.innerHTML = `
    <div class="void-footer__inner">
      <a href="#" class="void-footer__monogram magnetic-target" data-back-to-void data-cursor="expand" aria-label="AE — Back to void">
        <span>AE</span>
      </a>
      <p class="void-footer__credit">Built with Three.js + Vanilla JS</p>
      <p class="void-footer__copy">© ${new Date().getFullYear()} Arvin Ebrahimi</p>
      <button type="button" class="void-footer__top magnetic-target" data-back-to-void data-cursor="expand">
        Back to void ↑
      </button>
    </div>
    <p class="void-footer__egg" data-shader-egg hidden aria-hidden="true"></p>
  `;

  document.body.appendChild(footer);

  const egg = footer.querySelector('[data-shader-egg]');
  if (window.__VOID_SHADER_MS) {
    egg.textContent = `shader compile: ${window.__VOID_SHADER_MS}ms`;
    egg.hidden = false;
  }

  footer.querySelectorAll('[data-back-to-void]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (onBackToVoid) onBackToVoid();
    });
  });

  return footer;
}
