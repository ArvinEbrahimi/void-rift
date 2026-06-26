import * as THREE from 'three';

export function createRiftEnvMap(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03030a);

  const key = new THREE.PointLight(0xc4a0ff, 12, 20);
  key.position.set(-3, 4, 2);
  scene.add(key);

  const rim = new THREE.PointLight(0x7c3aed, 8, 18);
  rim.position.set(3, -1, 3);
  scene.add(rim);

  const fill = new THREE.PointLight(0x1a0a3d, 4, 25);
  fill.position.set(0, -3, -2);
  scene.add(fill);

  const accent = new THREE.PointLight(0xa855f7, 6, 12);
  accent.position.set(0, 2, -4);
  scene.add(accent);

  const rt = new THREE.WebGLCubeRenderTarget(128);
  const cubeCam = new THREE.CubeCamera(0.1, 50, rt);
  cubeCam.update(renderer, scene);

  const envMap = pmrem.fromCubemap(rt.texture).texture;

  rt.dispose();
  pmrem.dispose();

  return envMap;
}
