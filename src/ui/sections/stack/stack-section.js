import { CORE_NODES, SATELLITE_NODES, STACK_META } from './stack-data.js';

function renderCoreNode(node, index) {
  const positions = [
    'constellation__core-node--a',
    'constellation__core-node--b',
    'constellation__core-node--c',
  ];
  return `
    <button
      type="button"
      class="stack-node stack-node--core ${positions[index]}"
      data-node-id="${node.id}"
      data-desc="${node.desc}"
      aria-describedby="stack-tooltip"
    >
      <span class="stack-node__label">${node.label}</span>
    </button>
  `;
}

function renderRing(ring, nodes) {
  const ringClass = ring === 1 ? 'constellation__ring--inner' : 'constellation__ring--outer';
  return `
    <div class="constellation__ring ${ringClass}">
      ${nodes
        .map(
          (node) => `
        <button
          type="button"
          class="stack-node stack-node--sat"
          style="--angle: ${node.angle}deg"
          data-node-id="${node.id}"
          data-desc="${node.desc}"
          aria-describedby="stack-tooltip"
        >
          <span class="stack-node__label">${node.label}</span>
        </button>`
        )
        .join('')}
    </div>
  `;
}

const innerRing = SATELLITE_NODES.filter((n) => n.ring === 1);
const outerRing = SATELLITE_NODES.filter((n) => n.ring === 2);

const CODE_SNIPPET = `
<span class="tok-kw">from</span> rest_framework <span class="tok-kw">import</span> viewsets, permissions
<span class="tok-kw">from</span> .models <span class="tok-kw">import</span> Project
<span class="tok-kw">from</span> .serializers <span class="tok-kw">import</span> ProjectSerializer

<span class="tok-kw">class</span> <span class="tok-type">ProjectViewSet</span>(viewsets.ModelViewSet):
    queryset = Project.objects.filter(is_published=<span class="tok-bool">True</span>)
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    <span class="tok-kw">def</span> <span class="tok-fn">get_queryset</span>(self):
        qs = <span class="tok-fn">super</span>().get_queryset().select_related(<span class="tok-str">'owner'</span>)
        <span class="tok-kw">if</span> tag := self.request.query_params.get(<span class="tok-str">'tag'</span>):
            qs = qs.filter(tags__slug=tag)
        <span class="tok-kw">return</span> qs.order_by(<span class="tok-str">'-featured'</span>, <span class="tok-str">'-created_at'</span>)
`.trim();

const ARCHITECTURE_SVG = `
<svg class="stack-arch__svg" viewBox="0 0 520 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="arch-flow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6e3fff" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="#a855f7" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#6e3fff" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect class="stack-arch__box" x="24" y="68" width="110" height="64" rx="2"/>
  <text class="stack-arch__text" x="79" y="94">React</text>
  <text class="stack-arch__sub" x="79" y="114">Client</text>
  <rect class="stack-arch__box" x="205" y="68" width="110" height="64" rx="2"/>
  <text class="stack-arch__text" x="260" y="94">Django</text>
  <text class="stack-arch__sub" x="260" y="114">REST API</text>
  <rect class="stack-arch__box" x="386" y="68" width="110" height="64" rx="2"/>
  <text class="stack-arch__text" x="441" y="94">PostgreSQL</text>
  <text class="stack-arch__sub" x="441" y="114">Primary DB</text>
  <rect class="stack-arch__box stack-arch__box--cache" x="205" y="148" width="110" height="44" rx="2"/>
  <text class="stack-arch__text" x="260" y="176">Redis</text>
  <path class="stack-arch__flow" d="M134 100 H205" />
  <path class="stack-arch__flow" d="M315 100 H386" />
  <path class="stack-arch__flow stack-arch__flow--down" d="M260 132 V148" />
</svg>
`;

export function createStackSectionHTML() {
  return `
    <section id="stack" class="section section--stack">
      <div class="section__inner section__inner--wide">
        <div class="section__head">
          <p class="section__label">// 02 — Stack</p>
          <h2 class="section__title">Full-stack constellation</h2>
          <p class="stack__context">${STACK_META.headline}</p>
        </div>

        <div class="stack__layout">
          <div class="stack__constellation-wrap">
            <div class="constellation" data-constellation>
              <div class="constellation__glow" aria-hidden="true"></div>
              <div class="constellation__core">
                ${CORE_NODES.map(renderCoreNode).join('')}
              </div>
              ${renderRing(1, innerRing)}
              ${renderRing(2, outerRing)}
            </div>
            <div class="stack-tooltip" id="stack-tooltip" role="status" aria-live="polite">
              <span class="stack-tooltip__label">Hover a node</span>
              <p class="stack-tooltip__desc">Core and satellite technologies in production use.</p>
            </div>
          </div>

          <div class="stack__panels">
            <div class="void-panel stack-code">
              <p class="void-panel__label">django · views.py</p>
              <pre class="stack-code__pre"><code>${CODE_SNIPPET}</code></pre>
            </div>
            <div class="void-panel stack-arch">
              <p class="void-panel__label">architecture · data flow</p>
              ${ARCHITECTURE_SVG}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initStackConstellation(root) {
  const constellation = root.querySelector('[data-constellation]');
  if (!constellation) return;

  const tooltip = root.querySelector('#stack-tooltip');
  const labelEl = tooltip?.querySelector('.stack-tooltip__label');
  const descEl = tooltip?.querySelector('.stack-tooltip__desc');
  const nodes = constellation.querySelectorAll('.stack-node');
  const archSvg = root.querySelector('.stack-arch__svg');
  const flows = archSvg?.querySelectorAll('.stack-arch__flow');

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      nodes.forEach((n) => n.classList.toggle('is-active', n === node));
      if (labelEl) labelEl.textContent = node.querySelector('.stack-node__label')?.textContent || '';
      if (descEl) descEl.textContent = node.dataset.desc || '';
    });

    node.addEventListener('focus', () => node.dispatchEvent(new Event('mouseenter')));
    node.addEventListener('blur', () => {
      node.classList.remove('is-active');
    });
  });

  constellation.addEventListener('mouseleave', () => {
    nodes.forEach((n) => n.classList.remove('is-active'));
    if (labelEl) labelEl.textContent = 'Hover a node';
    if (descEl) descEl.textContent = 'Core and satellite technologies in production use.';
  });

  if (flows?.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          archSvg?.classList.toggle('is-animated', entry.isIntersecting);
        });
      },
      { threshold: 0.35 }
    );
    if (archSvg) observer.observe(archSvg);
  }
}
