import { gsap } from 'gsap';

const subtitles = [
  'Three.js & WebGL',
  'React & Next.js',
  'Django & DRF',
  'GSAP & Motion',
];

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function scrambleText(el, text, onComplete) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    el.textContent = text;
    if (onComplete) onComplete();
    return;
  }

  const duration = 700;
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const revealed = Math.floor(text.length * t);
    let out = '';

    for (let i = 0; i < text.length; i++) {
      if (i < revealed) {
        out += text[i];
      } else {
        out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
    }

    el.textContent = out;
    if (t < 1) requestAnimationFrame(tick);
    else {
      el.textContent = text;
      if (onComplete) onComplete();
    }
  }

  requestAnimationFrame(tick);
}

function startRoleCycle() {
  const el = document.querySelector('.overlay__subtitle-text');
  if (!el) return;

  let idx = 0;

  function next() {
    scrambleText(el, subtitles[idx % subtitles.length], () => {
      idx++;
      setTimeout(next, 2200);
    });
  }

  next();
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
    .add(() => startRoleCycle(), '-=0.2');

  return tl;
}
