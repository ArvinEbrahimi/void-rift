import { gsap } from 'gsap';

const STAGGER_SELECTORS = [
  '.bento-card',
  '.lab-card',
  '.process-step',
  '.about-values__item',
  '.metrics-stat',
  '.stack-node--core',
  '.testimonial-card',
].join(',');

export function initScrollAnimations() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const titles = document.querySelectorAll('.section__title, .section__head .section__label');
  titles.forEach((el) => {
    gsap.set(el, { y: 28, opacity: 0 });
  });

  const titleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gsap.to(entry.target, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
        });
        titleObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
  );

  titles.forEach((el) => titleObserver.observe(el));

  document.querySelectorAll('.section').forEach((section) => {
    const items = section.querySelectorAll(STAGGER_SELECTORS);
    if (!items.length) return;

    gsap.set(items, { y: 36, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          gsap.to(items, {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.07,
            ease: 'power3.out',
          });
          observer.disconnect();
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(section);
  });
}
