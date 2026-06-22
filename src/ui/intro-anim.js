import { gsap } from 'gsap';

const subtitles = [
  'Three.js & WebGL',
  'React & Next.js',
  'Django & DRF',
  'GSAP & Motion',
];

function startTypewriter() {
  const el = document.querySelector('.overlay__subtitle-text');
  if (!el) return;

  let idx = 0;

  function type(text, cb) {
    let i = 0;
    el.textContent = '';
    const interval = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => erase(cb), 1800);
      }
    }, 70);
  }

  function erase(cb) {
    const interval = setInterval(() => {
      el.textContent = el.textContent.slice(0, -1);
      if (!el.textContent) {
        clearInterval(interval);
        cb();
      }
    }, 35);
  }

  function loop() {
    type(subtitles[idx % subtitles.length], () => {
      idx++;
      loop();
    });
  }

  loop();
}

export function playIntro(onRiftReveal) {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.fromTo(
    '.loading-bar',
    { scaleX: 0, transformOrigin: 'left' },
    { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }
  )
    .to('.loading-bar', { opacity: 0, duration: 0.3 })
    .add(() => {
      if (onRiftReveal) onRiftReveal();
    })
    .from(
      '.overlay__name .char',
      {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: { amount: 0.5, from: 'start' },
        ease: 'power4.out',
      },
      '+=0.3'
    )
    .from(
      '.overlay__eyebrow',
      {
        opacity: 0,
        y: 20,
        duration: 0.7,
      },
      '-=0.4'
    )
    .from(
      '.overlay__nav',
      {
        opacity: 0,
        y: -20,
        duration: 0.6,
      },
      '-=0.5'
    )
    .from(
      '.overlay__bottom',
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
      },
      '-=0.4'
    )
    .add(() => startTypewriter(), '-=0.2');

  return tl;
}
