export function createResizeHandler({ camera, renderer, composer }) {
  let timeout;

  function onResize() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (composer) {
        composer.setSize(width, height);
      }
    }, 150);
  }

  window.addEventListener('resize', onResize);

  return {
    destroy() {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    },
  };
}
