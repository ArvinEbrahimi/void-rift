import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  ChromaticAberrationEffect,
  VignetteEffect,
  BrightnessContrastEffect,
} from 'postprocessing';
import * as THREE from 'three';

export function createPostprocessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);

  composer.addPass(new RenderPass(scene, camera));

  const bloom = new BloomEffect({
    intensity: 2.4,
    luminanceThreshold: 0.14,
    luminanceSmoothing: 0.35,
    mipmapBlur: true,
  });

  const chromaticAberration = new ChromaticAberrationEffect({
    offset: new THREE.Vector2(0.0008, 0.0008),
    radialModulation: true,
    modulationOffset: 0.15,
  });

  const vignette = new VignetteEffect({
    offset: 0.35,
    darkness: 0.65,
  });

  const grade = new BrightnessContrastEffect({
    brightness: 0.02,
    contrast: 0.12,
  });

  composer.addPass(new EffectPass(camera, bloom, chromaticAberration, vignette, grade));

  let scrollProgress = 0;

  return {
    composer,
    setChromaticIntensity(x, y) {
      chromaticAberration.offset.set(x * 0.002, y * 0.002);
    },
    setScrollProgress(progress) {
      scrollProgress = progress;
      vignette.darkness = 0.65 + progress * 0.2;
      vignette.offset = 0.35 - progress * 0.08;
      bloom.intensity = 2.4 - progress * 0.6;
    },
  };
}
