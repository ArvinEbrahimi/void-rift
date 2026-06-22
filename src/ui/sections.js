export function createSections() {
  const main = document.createElement('main');
  main.className = 'page-content';
  main.innerHTML = `
    <div class="hero-spacer" aria-hidden="true"></div>

    <section id="work" class="section section--work">
      <div class="section__inner">
        <p class="section__label">01 / Selected Work</p>
        <h2 class="section__title">Projects across the stack</h2>
        <div class="section__grid">
          <article class="project-card" data-cursor="expand">
            <span class="project-card__index">01</span>
            <h3 class="project-card__name">Void Rift</h3>
            <p class="project-card__desc">Cinematic WebGL hero with procedural GLSL nebula, 9.8K particles, and post-processing pipeline.</p>
            <ul class="project-card__tags">
              <li>Three.js</li>
              <li>GLSL</li>
              <li>GSAP</li>
            </ul>
          </article>
          <article class="project-card" data-cursor="expand">
            <span class="project-card__index">02</span>
            <h3 class="project-card__name">SaaS Platform</h3>
            <p class="project-card__desc">Full-stack product with React, Next.js, Django REST Framework, and real-time dashboards.</p>
            <ul class="project-card__tags">
              <li>Next.js</li>
              <li>Django</li>
              <li>PostgreSQL</li>
            </ul>
          </article>
          <article class="project-card" data-cursor="expand">
            <span class="project-card__index">03</span>
            <h3 class="project-card__name">Motion Systems</h3>
            <p class="project-card__desc">Scroll-driven storytelling, timeline orchestration, and micro-interactions for brand experiences.</p>
            <ul class="project-card__tags">
              <li>GSAP</li>
              <li>WebGL</li>
              <li>UX</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section id="about" class="section section--about">
      <div class="section__inner section__inner--split">
        <div>
          <p class="section__label">02 / About</p>
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
        <p class="section__label">03 / Contact</p>
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.12 }
  );

  main.querySelectorAll('.section').forEach((section) => observer.observe(section));

  return main;
}
