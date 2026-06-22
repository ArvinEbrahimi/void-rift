export function createRAF(callbacks) {
  let animId;
  const clock = { start: performance.now(), elapsed: 0 };

  function loop() {
    clock.elapsed = (performance.now() - clock.start) / 1000;
    callbacks.forEach((cb) => cb(clock.elapsed));
    animId = requestAnimationFrame(loop);
  }

  loop();

  return {
    stop: () => cancelAnimationFrame(animId),
  };
}
