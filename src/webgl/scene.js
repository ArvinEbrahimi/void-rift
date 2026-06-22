import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03030a, 0.035);

  const ambient = new THREE.AmbientLight(0x1a1035, 0.4);
  scene.add(ambient);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x03030a, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;

  const container = document.querySelector('#canvas-container');
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}
