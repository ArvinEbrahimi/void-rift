import * as THREE from 'three';

const godRayVertexShader = `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const godRayFragmentShader = `
  uniform float uTime;
  uniform float uReveal;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    float beam = smoothstep(0.0, 0.45, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.y));
    float radial = 1.0 - abs(vUv.x - 0.5) * 2.0;
    radial = pow(radial, 2.5);
    float flicker = 0.85 + 0.15 * sin(uTime * 3.0 + vUv.y * 12.0);
    float alpha = beam * radial * flicker * 0.12 * uReveal * (1.0 - uScroll * 0.6);
    vec3 col = mix(vec3(0.35, 0.12, 0.85), vec3(0.75, 0.45, 1.0), vUv.y);
    gl_FragColor = vec4(col, alpha);
  }
`;

function createHexAccentLights(parent) {
  const accents = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const light = new THREE.PointLight(0x9b5cff, 0.4, 3.5);
    light.position.set(Math.cos(angle) * 1.38, Math.sin(angle) * 0.05, Math.sin(angle) * 1.38);
    parent.add(light);
    accents.push(light);
  }
  return accents;
}

export function createLightingRig(scene, riftGroup) {
  const rig = new THREE.Group();
  rig.name = 'LightingRig';
  scene.add(rig);

  const key = new THREE.SpotLight(0xc4a0ff, 3.2, 14, Math.PI / 4.5, 0.35, 1.2);
  key.position.set(-2.8, 3.2, 4.5);
  key.castShadow = false;
  rig.add(key);
  rig.add(key.target);
  key.target.position.set(0, 0, 0);

  const fill = new THREE.HemisphereLight(0x1a0a3d, 0x0a0520, 0.7);
  rig.add(fill);

  const rim = new THREE.PointLight(0x7c3aed, 2.4, 12);
  rim.position.set(2.5, -0.5, 2.8);
  rig.add(rim);

  const core = new THREE.PointLight(0x5a22cc, 1.6, 4.5);
  core.position.set(0, 0, 0.2);
  riftGroup.add(core);

  const accents = createHexAccentLights(riftGroup);

  const godRayGeo = new THREE.ConeGeometry(3.2, 7, 32, 1, true);
  const godRayMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uScroll: { value: 0 },
    },
    vertexShader: godRayVertexShader,
    fragmentShader: godRayFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const godRay = new THREE.Mesh(godRayGeo, godRayMat);
  godRay.rotation.x = Math.PI;
  godRay.position.set(-1.2, 3.8, 1.5);
  rig.add(godRay);

  const keyPos = new THREE.Vector3();
  const rimPos = new THREE.Vector3();
  const mouseTarget = { x: 0, y: 0 };
  let scrollProgress = 0;

  return {
    rig,
    lights: { key, fill, rim, core, accents },
    godRay,
    godRayMat,
    uniforms: {
      uKeyLightPos: { value: keyPos },
      uRimLightPos: { value: rimPos },
      uKeyIntensity: { value: 1 },
    },
    setMouseTarget(x, y) {
      mouseTarget.x = x;
      mouseTarget.y = y;
    },
    setScrollProgress(progress) {
      scrollProgress = progress;
    },
    setReveal(value) {
      godRayMat.uniforms.uReveal.value = value;
    },
    update(time, mouseProximity = 0) {
      key.position.x = -2.8 + mouseTarget.x * 1.1;
      key.position.y = 3.2 + mouseTarget.y * 0.7;
      key.intensity = 3.2 * (1 - scrollProgress * 0.45) + mouseProximity * 1.8;
      key.target.position.set(mouseTarget.x * 0.2, mouseTarget.y * 0.15, 0);

      fill.intensity = 0.7 + scrollProgress * 0.4;
      fill.position.y = scrollProgress * 0.5;

      const rimOrbit = time * 0.22;
      rim.position.x = Math.cos(rimOrbit) * 2.8;
      rim.position.z = Math.sin(rimOrbit) * 2.8 + 1.2;
      rim.position.y = Math.sin(time * 0.35) * 0.6;
      rim.intensity = 2.4 + Math.sin(time * 1.1) * 0.35 + mouseProximity * 0.8;

      core.intensity = 1.6 + Math.sin(time * 1.25) * 0.35 + mouseProximity * 1.4;

      accents.forEach((light, i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2 + time * 0.08;
        light.position.x = Math.cos(angle) * 1.38;
        light.position.z = Math.sin(angle) * 1.38;
        light.intensity = 0.35 + Math.sin(time * 2.5 + i) * 0.12 + mouseProximity * 0.25;
      });

      godRayMat.uniforms.uTime.value = time;
      godRayMat.uniforms.uScroll.value = scrollProgress;
      godRay.rotation.z = Math.sin(time * 0.15) * 0.08 - 0.12;

      key.getWorldPosition(keyPos);
      rim.getWorldPosition(rimPos);
    },
  };
}
