const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#stack', label: 'Stack' },
  { href: '#lab', label: 'Lab' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export function createMobileNav() {
  const nav = document.createElement('nav');
  nav.className = 'mobile-nav';
  nav.setAttribute('aria-label', 'Mobile navigation');
  nav.innerHTML = `
    <ul class="mobile-nav__list">
      ${LINKS.map(
        (l) => `
        <li>
          <a href="${l.href}" class="mobile-nav__link" data-mobile-link data-cursor="expand">${l.label}</a>
        </li>`
      ).join('')}
    </ul>
  `;

  document.body.appendChild(nav);

  const links = nav.querySelectorAll('[data-mobile-link]');

  function setActive() {
    const probe = window.scrollY + window.innerHeight * 0.4;
    let activeId = 'work';

    ['work', 'stack', 'lab', 'about', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el && probe >= el.offsetTop) activeId = id;
    });

    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  return nav;
}
