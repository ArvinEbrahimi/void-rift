export function createMouseParallax() {
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  return {
    update() {
      target.x += (mouse.x - target.x) * 0.04;
      target.y += (mouse.y - target.y) * 0.04;

      const dist = Math.sqrt(target.x ** 2 + target.y ** 2);
      const proximity = Math.max(0, 1 - dist * 0.85);

      return { target, proximity };
    },
  };
}
