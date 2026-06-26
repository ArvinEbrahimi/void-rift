/**
 * Registers renderables for selective bloom (rift emissives, bright stars, god-ray).
 */
export function addBloomTargets(selection, root, options = {}) {
  const skip = new Set(options.skip || []);
  const minLuminance = options.minLuminance ?? 0;

  root.traverse((obj) => {
    if (skip.has(obj)) return;
    if (obj.userData?.noBloom) return;

    const isRenderable =
      obj.isMesh || obj.isPoints || obj.isLineSegments || obj.isLine || obj.isInstancedMesh;
    if (!isRenderable) return;

    if (minLuminance > 0 && obj.material?.emissive) {
      const intensity = obj.material.emissiveIntensity ?? 0;
      if (intensity < minLuminance) return;
    }

    selection.add(obj);
  });
}

export function createBloomTargetList({ rift, riftParticles, particles, lightingRig }) {
  const targets = [];
  if (rift?.group) targets.push(rift.group);
  if (riftParticles?.points) targets.push(riftParticles.points);
  if (riftParticles?.comets) targets.push(riftParticles.comets);
  if (particles?.stars) targets.push(particles.stars);
  if (lightingRig?.godRay) targets.push(lightingRig.godRay);
  return targets;
}
