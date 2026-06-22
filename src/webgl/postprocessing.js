import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  ChromaticAberrationEffect,
  VignetteEffect,
} from 'postprocessing';
import * as THREE from 'three';

export function createPostprocessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);

  composer.addPass(new RenderPass(scene, camera));

  const bloom = new BloomEffect({
    intensity: 2.6,
    luminanceThreshold: 0.12,
    luminanceSmoothing: 0.3,
    mipmapBlur: true,
  });

  const chromaticAberration = new ChromaticAberrationEffect({
    offset: new THREE.Vector2(0.0008, 0.0008),
    radialModulation: true,
    modulationOffset: 0.15,
  });

  const vignette = new VignetteEffect({
    offset: 0.35,
    darkness: 0.7,
  });

  composer.addPass(new EffectPass(camera, bloom, chromaticAberration, vignette));

  return {
    composer,
    setChromaticIntensity(x, y) {
      chromaticAberration.offset.set(x * 0.002, y * 0.002);
    },
  };
}
