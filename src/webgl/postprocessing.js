import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  ChromaticAberrationEffect,
  VignetteEffect,
  BrightnessContrastEffect,
  NoiseEffect,
} from 'postprocessing';
import * as THREE from 'three';

export function createPostprocessing(renderer, scene, camera, tierConfig = { postFx: 'full' }) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new BloomEffect({
    intensity: tierConfig.postFx === 'minimal' ? 1.8 : 2.4,
    luminanceThreshold: tierConfig.postFx === 'minimal' ? 0.18 : 0.14,
    luminanceSmoothing: 0.35,
    mipmapBlur: true,
  });

  const effects = [bloom];
  let chromaticAberration = null;

  if (tierConfig.postFx !== 'minimal') {
    chromaticAberration = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.0008, 0.0008),
      radialModulation: true,
      modulationOffset: 0.15,
    });
    effects.push(chromaticAberration);
  }

  const vignette = new VignetteEffect({ offset: 0.35, darkness: 0.65 });
  effects.push(vignette);

  if (tierConfig.postFx === 'full') {
    effects.push(
      new BrightnessContrastEffect({ brightness: 0.02, contrast: 0.12 }),
      new NoiseEffect()
    );
  }

  const effectPass = new EffectPass(camera, ...effects);
  composer.addPass(effectPass);

  let scrollProgress = 0;

  return {
    composer,
    setChromaticIntensity(x, y) {
      if (chromaticAberration) {
        chromaticAberration.offset.set(x * 0.002, y * 0.002);
      }
    },
    setScrollProgress(progress) {
      scrollProgress = progress;
      vignette.darkness = 0.65 + progress * 0.2;
      vignette.offset = 0.35 - progress * 0.08;
      bloom.intensity = (tierConfig.postFx === 'minimal' ? 1.8 : 2.4) - progress * 0.6;
    },
  };
}
