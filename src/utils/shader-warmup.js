export async function warmupShaders(renderer, scene, camera) {
  if (renderer.compileAsync) {
    await renderer.compileAsync(scene, camera);
  } else {
    renderer.compile(scene, camera);
  }

  const prevTarget = renderer.getRenderTarget();
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
  if (prevTarget) renderer.setRenderTarget(prevTarget);
}
