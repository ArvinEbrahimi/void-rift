import { DepthOfFieldEffect } from 'postprocessing';

/**
 * Cinematic DOF focused on the rift (world-space focus distance).
 * Tier A: full bokeh; Tier B: reduced resolution/blur strength.
 */
export function createDofEffect(camera, tierConfig = { postFx: 'standard' }) {
  const isFull = tierConfig.postFx === 'full';

  return new DepthOfFieldEffect(camera, {
    focusDistance: 5.0,
    focusRange: 2.2,
    bokehScale: isFull ? 1.05 : 0.72,
    resolutionScale: isFull ? 0.5 : 0.32,
  });
}

export function updateDofEffect(dofEffect, { scrollProgress = 0, cameraDistance = 5 } = {}) {
  if (!dofEffect?.cocMaterial?.uniforms) return;

  const uniforms = dofEffect.cocMaterial.uniforms;
  uniforms.focusDistance.value = cameraDistance;
  uniforms.focusRange.value = Math.max(0.9, 2.4 - scrollProgress * 1.4);

  const strength = 1.0 - scrollProgress * 0.9;
  dofEffect.blendMode.opacity.value = strength;
  dofEffect.blurPass.scale = 0.85 + strength * 0.15;
}
