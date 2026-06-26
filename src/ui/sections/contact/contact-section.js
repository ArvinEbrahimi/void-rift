import { initContactForm } from './contact-form.js';

const SOCIALS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/ArvinEbrahimi',
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1C5.93 1 1 5.93 1 12c0 4.87 3.16 8.99 7.54 10.45.55.1.76-.24.76-.53 0-.26-.01-1.14-.02-2.07-3.06.67-3.71-1.31-3.71-1.31-.5-1.27-1.24-1.61-1.24-1.61-.99-.68.07-.67.07-.67 1.09.08 1.67 1.12 1.67 1.12.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.47-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.12-2.95-.11-.28-.49-1.42.11-2.96 0 0 .93-.3 3.05 1.13.88-.25 1.83-.37 2.77-.37.94 0 1.89.12 2.77.37 2.12-1.43 3.05-1.13 3.05-1.13.6 1.54.22 2.68.11 2.96.7.77 1.12 1.75 1.12 2.95 0 4.22-2.58 5.15-5.03 5.42.4.34.75 1.01.75 2.04 0 1.47-.01 2.65-.01 3.01 0 .29.2.64.77.53A10.02 10.02 0 0023 12c0-6.07-4.93-11-11-11z"/></svg>`,
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:ebrahimiarvin.official@gmail.com',
    icon: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/arvinebrahimi',
    icon: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 4L3 11l6 2 2 6 3-7 7-8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/arvinebrahimi',
    icon: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
];

export function createContactSectionHTML() {
  return `
    <section id="contact" class="section section--contact">
      <div class="section__inner section__inner--wide">
        <p class="section__label">// 08 — Contact</p>
        <h2 class="section__title">Let's build something memorable</h2>

        <div class="contact-split">
          <form class="contact-form void-panel" data-contact-form novalidate>
            <p class="void-panel__label">Send a message</p>
            <label class="contact-form__field">
              <span>Name</span>
              <input type="text" name="name" autocomplete="name" required minlength="2" />
            </label>
            <label class="contact-form__field">
              <span>Email</span>
              <input type="email" name="email" autocomplete="email" required />
            </label>
            <label class="contact-form__field">
              <span>Message</span>
              <textarea name="message" rows="5" required minlength="10"></textarea>
            </label>
            <button type="submit" class="contact-form__submit" data-cursor="expand">Send message</button>
            <p class="contact-form__status" data-form-status hidden role="status"></p>
          </form>

          <aside class="contact-aside">
            <div class="void-panel contact-aside__panel">
              <p class="void-panel__label">Direct channels</p>
              <p class="contact-aside__lead">Open to freelance, collaborations, and full-time roles.</p>
              <p class="contact-aside__trust">
                <span class="contact-aside__trust-dot" aria-hidden="true"></span>
                Response time: ~24h
              </p>
              <p class="contact-aside__calendar">Availability: booking via email — calendar link coming soon.</p>
              <ul class="contact-social">
                ${SOCIALS.map(
                  (s) => `
                  <li>
                    <a href="${s.href}" class="contact-social__link magnetic-target" target="_blank" rel="noopener noreferrer" data-cursor="expand" aria-label="${s.label}">
                      ${s.icon}
                      <span>${s.label}</span>
                    </a>
                  </li>`
                ).join('')}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;
}

export function initContactSection(root) {
  const form = root.querySelector('[data-contact-form]');
  if (form) initContactForm(form);
}
