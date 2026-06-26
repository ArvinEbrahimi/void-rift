import {
  EffectComposer,
  RenderPass,
  EffectPass,
  SelectiveBloomEffect,
  ChromaticAberrationEffect,
  VignetteEffect,
  BrightnessContrastEffect,
  NoiseEffect,
  BlendFunction,
} from 'postprocessing';
import * as THREE from 'three';
import { addBloomTargets } from './post/bloom-selective.js';
import { createDofEffect, updateDofEffect } from './post/dof.js';

export function createPostprocessing(renderer, scene, camera, tierConfig = { postFx: 'full' }, bloomRoots = []) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const isMinimal = tierConfig.postFx === 'minimal';
  const isFull = tierConfig.postFx === 'full';

  const bloom = new SelectiveBloomEffect(scene, camera, {
    intensity: isMinimal ? 1.8 : 2.5,
    luminanceThreshold: isMinimal ? 0.08 : 0.06,
    luminanceSmoothing: 0.42,
    mipmapBlur: true,
    levels: isFull ? 9 : 7,
    radius: 0.68,
  });
  bloom.ignoreBackground = true;

  for (const root of bloomRoots) {
    addBloomTargets(bloom.selection, root);
  }

  const effects = [bloom];
  let chromaticAberration = null;
  let dofEffect = null;

  if (!isMinimal) {
    dofEffect = createDofEffect(camera, tierConfig);
    effects.push(dofEffect);

    chromaticAberration = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.0006, 0.0006),
      radialModulation: true,
      modulationOffset: 0.22,
    });
    effects.push(chromaticAberration);
  }

  const vignette = new VignetteEffect({ offset: 0.35, darkness: 0.65 });
  effects.push(vignette);

  let noiseEffect = null;
  if (isFull) {
    effects.push(new BrightnessContrastEffect({ brightness: 0.02, contrast: 0.12 }));
    noiseEffect = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY, premultiply: true });
    noiseEffect.blendMode.opacity.value = 0.14;
    effects.push(noiseEffect);
  }

  const effectPass = new EffectPass(camera, ...effects);
  composer.addPass(effectPass);

  let scrollProgress = 0;
  const baseBloom = isMinimal ? 1.8 : 2.5;
  const focusPoint = new THREE.Vector3(0, 0, 0);

  return {
    composer,
    bloom,
    dofEffect,
    setChromaticIntensity(x, y, edgeFactor = 1) {
      if (!chromaticAberration) return;
      const edge = 0.6 + edgeFactor * 0.9;
      chromaticAberration.offset.set(x * 0.0025 * edge, y * 0.0025 * edge);
      chromaticAberration.modulationOffset = 0.18 + edgeFactor * 0.12;
    },
    setScrollProgress(progress) {
      scrollProgress = progress;
      vignette.darkness = 0.65 + progress * 0.2;
      vignette.offset = 0.35 - progress * 0.08;
      bloom.intensity = baseBloom - progress * 0.55;
      this.updateFocus();
    },
    updateFocus() {
      if (dofEffect) {
        const cameraDistance = camera.position.distanceTo(focusPoint);
        updateDofEffect(dofEffect, { scrollProgress, cameraDistance });
      }
    },
  };
}
