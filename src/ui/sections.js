import { createWorkSectionHTML } from './sections/work/work-section.js';
import { createWorkModal, initWorkInteractions } from './sections/work/work-interactions.js';
import { createStackSectionHTML, initStackConstellation } from './sections/stack/stack-section.js';
import { createLabSectionHTML, initLabSection } from './sections/lab/lab-section.js';
import { createProcessSectionHTML, initProcessTimeline } from './sections/process/process-section.js';
import { createAboutSectionHTML } from './sections/about/about-section.js';
import { createMetricsSectionHTML, initMetricsCounters } from './sections/metrics/metrics-section.js';
import {
  createTestimonialsSectionHTML,
  initTestimonialsCarousel,
} from './sections/testimonials/testimonials-section.js';
import { createContactSectionHTML, initContactSection } from './sections/contact/contact-section.js';

export function createSections(tierStats = {}) {
  const main = document.createElement('main');
  main.className = 'page-content';
  main.id = 'main-content';
  main.tabIndex = -1;
  main.innerHTML = `
    <div class="hero-spacer" aria-hidden="true"></div>
    ${createWorkSectionHTML()}
    ${createStackSectionHTML()}
    ${createLabSectionHTML()}
    ${createProcessSectionHTML()}
    ${createAboutSectionHTML()}
    ${createMetricsSectionHTML()}
    ${createTestimonialsSectionHTML()}
    ${createContactSectionHTML()}
  `;

  document.body.appendChild(main);

  const workSection = main.querySelector('#work');
  const stackSection = main.querySelector('#stack');
  const labSection = main.querySelector('#lab');
  const processSection = main.querySelector('#process');
  const metricsSection = main.querySelector('#metrics');
  const testimonialsSection = main.querySelector('#testimonials');
  const contactSection = main.querySelector('#contact');

  const modal = createWorkModal();
  const workUi = initWorkInteractions(workSection, modal, { stats: tierStats });
  initStackConstellation(stackSection);
  const labUi = initLabSection(labSection);
  initProcessTimeline(processSection);
  initMetricsCounters(metricsSection);
  initTestimonialsCarousel(testimonialsSection);
  initContactSection(contactSection);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.12 }
  );

  main.querySelectorAll('.section').forEach((section) => observer.observe(section));

  return { main, workUi, labUi, modal };
}
