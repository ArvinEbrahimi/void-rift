export async function warmupShaders(renderer, scene, camera) {
  const start = performance.now();

  if (renderer.compileAsync) {
    await renderer.compileAsync(scene, camera);
  } else {
    renderer.compile(scene, camera);
  }

  const prevTarget = renderer.getRenderTarget();
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
  if (prevTarget) renderer.setRenderTarget(prevTarget);

  if (typeof window !== 'undefined') {
    window.__VOID_SHADER_MS = Math.round(performance.now() - start);
  }
}
