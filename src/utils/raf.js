export function createRAF(callbacks) {
  let animId;
  let running = true;
  const clock = { start: performance.now(), elapsed: 0 };

  function loop() {
    if (running) {
      clock.elapsed = (performance.now() - clock.start) / 1000;
      callbacks.forEach((cb) => cb(clock.elapsed));
    }
    animId = requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    if (running) clock.start = performance.now() - clock.elapsed * 1000;
  });

  loop();

  return {
    stop: () => cancelAnimationFrame(animId),
  };
}
