import { PULL_QUOTE, CAREER, VALUES } from './about-data.js';

export function createAboutSectionHTML() {
  return `
    <section id="about" class="section section--about">
      <div class="section__inner section__inner--wide">
        <p class="section__label">// 05 — About</p>

        <div class="about-editorial">
          <div class="about-editorial__aside">
            <div class="about-avatar" aria-hidden="true">
              <span class="about-avatar__monogram">AE</span>
              <span class="about-avatar__ring"></span>
            </div>
            <blockquote class="about-pull-quote">
              <p>${PULL_QUOTE}</p>
            </blockquote>
            <a
              class="about-cv magnetic-target"
              href="mailto:ebrahimiarvin.official@gmail.com?subject=CV%20Request"
              data-cursor="expand"
            >
              <span>Download CV</span>
              <small>PDF · ~240 KB · on request</small>
            </a>
          </div>

          <div class="about-editorial__body">
            <h2 class="section__title about-editorial__title">Building at the edge of code &amp; craft</h2>
            <div class="about-columns">
              <p>I'm Arvin Ebrahimi — a full-stack developer and creative technologist based in Tehran. I design and ship products where engineering precision meets cinematic interaction design.</p>
              <p>From Django APIs and React frontends to custom WebGL shaders and motion systems, I care about performance, detail, and the first three seconds of every experience.</p>
            </div>

            <ol class="about-timeline">
              ${CAREER.map(
                (item) => `
                <li class="about-timeline__item">
                  <span class="about-timeline__year">${item.year}</span>
                  <div>
                    <strong class="about-timeline__org">${item.org}</strong>
                    <p class="about-timeline__role">${item.role}</p>
                  </div>
                </li>`
              ).join('')}
            </ol>
          </div>
        </div>

        <ul class="about-values">
          ${VALUES.map(
            (v) => `
            <li class="about-values__item">
              <div class="about-values__icon">${v.icon}</div>
              <h3 class="about-values__title">${v.title}</h3>
              <p class="about-values__desc">${v.desc}</p>
            </li>`
          ).join('')}
        </ul>
      </div>
    </section>
  `;
}
