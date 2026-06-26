import { TESTIMONIALS } from './testimonials-data.js';

export function createTestimonialsSectionHTML() {
  return `
    <section id="testimonials" class="section section--testimonials">
      <div class="section__inner section__inner--wide">
        <div class="section__head">
          <p class="section__label">// 07 — Testimonials</p>
          <h2 class="section__title">Colleagues say</h2>
          <p class="testimonials__note">Template quotes — replace with real testimonials when available.</p>
        </div>

        <div class="testimonials-carousel" data-testimonials>
          <div class="testimonials-track" data-testimonials-track>
            ${TESTIMONIALS.map(
              (t, i) => `
              <article class="testimonial-card void-panel" data-index="${i}" ${i === 0 ? '' : 'hidden'}>
                ${t.isTemplate ? '<span class="testimonial-card__badge">Template</span>' : ''}
                <blockquote class="testimonial-card__quote">"${t.quote}"</blockquote>
                <footer class="testimonial-card__footer">
                  <strong class="testimonial-card__name">${t.name}</strong>
                  <span class="testimonial-card__role">${t.role}</span>
                </footer>
              </article>`
            ).join('')}
          </div>
          <div class="testimonials-dots" role="tablist" aria-label="Testimonials">
            ${TESTIMONIALS.map(
              (_, i) => `
              <button type="button" class="testimonials-dots__btn${i === 0 ? ' is-active' : ''}" data-dot="${i}" role="tab" aria-selected="${i === 0}" aria-label="Testimonial ${i + 1}"></button>`
            ).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initTestimonialsCarousel(root) {
  const carousel = root.querySelector('[data-testimonials]');
  if (!carousel) return;

  const cards = [...carousel.querySelectorAll('.testimonial-card')];
  const dots = [...carousel.querySelectorAll('[data-dot]')];
  let index = 0;
  let timer = 0;
  let paused = false;

  function show(next) {
    index = (next + cards.length) % cards.length;
    cards.forEach((card, i) => {
      const active = i === index;
      card.hidden = !active;
      card.classList.toggle('is-active', active);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', String(i === index));
    });
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) show(index + 1);
    }, 5500);
  }

  carousel.addEventListener('mouseenter', () => {
    paused = true;
  });
  carousel.addEventListener('mouseleave', () => {
    paused = false;
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.dot));
      start();
    });
  });

  start();
  return { destroy: () => clearInterval(timer) };
}
