const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function initEasterEgg(onTrigger) {
  if (!onTrigger) return;

  let konamiIndex = 0;
  let typed = '';

  window.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex >= KONAMI.length) {
        konamiIndex = 0;
        onTrigger('konami');
      }
    } else {
      konamiIndex = e.key === KONAMI[0] ? 1 : 0;
    }

    if (e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-4);
      if (typed === 'void') {
        typed = '';
        onTrigger('void');
      }
    }
  });
}
