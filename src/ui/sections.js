import { createWorkSectionHTML } from './sections/work/work-section.js';
import { createWorkModal, initWorkInteractions } from './sections/work/work-interactions.js';
import { createStackSectionHTML, initStackConstellation } from './sections/stack/stack-section.js';
import { createLabSectionHTML, initLabSection } from './sections/lab/lab-section.js';
import { createProcessSectionHTML, initProcessTimeline } from './sections/process/process-section.js';

export function createSections(tierStats = {}) {
  const main = document.createElement('main');
  main.className = 'page-content';
  main.innerHTML = `
    <div class="hero-spacer" aria-hidden="true"></div>
    ${createWorkSectionHTML()}
    ${createStackSectionHTML()}
    ${createLabSectionHTML()}
    ${createProcessSectionHTML()}

    <section id="about" class="section section--about">
      <div class="section__inner section__inner--split">
        <div>
          <p class="section__label">// 05 — About</p>
          <h2 class="section__title">Building at the edge of code &amp; craft</h2>
        </div>
        <div class="section__body">
          <p>I'm Arvin Ebrahimi — a full-stack developer and creative technologist based in Tehran. I design and ship products where engineering precision meets cinematic interaction design.</p>
          <p>From Django APIs and React frontends to custom WebGL shaders and motion systems, I care about performance, detail, and the first three seconds of every experience.</p>
          <ul class="section__stats">
            <li><span>5+</span> Years shipping products</li>
            <li><span>Full-Stack</span> React · Next · Django</li>
            <li><span>Creative</span> Three.js · GSAP · WebGL</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="contact" class="section section--contact">
      <div class="section__inner">
        <p class="section__label">// 06 — Contact</p>
        <h2 class="section__title">Let's build something memorable</h2>
        <p class="section__lead">Open to freelance, collaborations, and full-time roles.</p>
        <div class="contact-links">
          <a href="mailto:ebrahimiarvin.official@gmail.com" class="contact-links__item" data-cursor="expand">
            <span>Email</span>
            ebrahimiarvin.official@gmail.com
          </a>
          <a href="https://github.com/ArvinEbrahimi" target="_blank" rel="noopener noreferrer" class="contact-links__item" data-cursor="expand">
            <span>GitHub</span>
            @ArvinEbrahimi
          </a>
          <a href="https://arvinebrahimi.dev" target="_blank" rel="noopener noreferrer" class="contact-links__item" data-cursor="expand">
            <span>Website</span>
            arvinebrahimi.dev
          </a>
        </div>
      </div>
    </section>
  `;

  document.body.appendChild(main);

  const workSection = main.querySelector('#work');
  const stackSection = main.querySelector('#stack');
  const labSection = main.querySelector('#lab');
  const processSection = main.querySelector('#process');
  const modal = createWorkModal();
  const workUi = initWorkInteractions(workSection, modal, { stats: tierStats });
  initStackConstellation(stackSection);
  const labUi = initLabSection(labSection);
  initProcessTimeline(processSection);

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
