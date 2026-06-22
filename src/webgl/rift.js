import * as THREE from 'three';
import { gsap } from 'gsap';

const riftVertexShader = `
  uniform float uTime;
  uniform float uMouse;
  uniform float uReveal;
  uniform float uScroll;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplace;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vNormal = normal;
    vPosition = position;

    float n = noise(position * 2.0 + uTime * 0.4);
    float displace = (n * 0.35 + sin(uTime * 0.8) * 0.08) * uReveal;
    displace += uMouse * n * 0.25;
    vDisplace = displace;

    vec3 newPos = position + normal * displace;
    newPos.y += uScroll * 0.8;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const riftFragmentShader = `
  uniform float uTime;
  uniform float uReveal;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplace;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(normalize(vNormal), viewDir), 2.2);

    vec3 colorCore = vec3(0.02, 0.01, 0.08);
    vec3 colorGlow = vec3(0.50, 0.20, 1.0);
    vec3 colorEdge = vec3(0.75, 0.40, 1.0);

    vec3 col = mix(colorCore, colorGlow, fresnel);
    col = mix(col, colorEdge, fresnel * fresnel);
    col += colorGlow * vDisplace * 1.2;

    float pulse = 0.82 + 0.18 * sin(uTime * 1.2);
    col *= pulse;

    float alpha = mix(0.2, 1.0, fresnel) * (0.6 + vDisplace * 0.4) * uReveal;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function createRift(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const geo = new THREE.IcosahedronGeometry(1.2, 8);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: 0 },
      uReveal: { value: 0 },
      uScroll: { value: 0 },
    },
    vertexShader: riftVertexShader,
    fragmentShader: riftFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const rift = new THREE.Mesh(geo, mat);
  group.add(rift);

  const coreGeo = new THREE.IcosahedronGeometry(0.85, 4);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x03030a,
    transparent: true,
    opacity: 0.95,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.45,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const outerRingGeo = new THREE.TorusGeometry(2.1, 0.015, 6, 64);
  const outerRing = new THREE.Mesh(
    outerRingGeo,
    new THREE.MeshBasicMaterial({
      color: 0x6e3fff,
      transparent: true,
      opacity: 0.2,
    })
  );
  outerRing.rotation.x = Math.PI / 2;
  outerRing.rotation.z = Math.PI / 6;
  group.add(outerRing);

  group.scale.setScalar(0.01);

  let scrollProgress = 0;

  return {
    rift,
    core,
    ring,
    group,
    reveal() {
      gsap.to(mat.uniforms.uReveal, {
        value: 1,
        duration: 2.2,
        ease: 'power2.inOut',
      });
      gsap.fromTo(
        ringMat,
        { opacity: 0 },
        { opacity: 0.45, duration: 2, ease: 'power2.out' }
      );
    },
    setScrollProgress(progress) {
      scrollProgress = progress;
    },
    update(time, mouseProximity = 0) {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uMouse.value = mouseProximity;

      const reveal = mat.uniforms.uReveal.value;
      const scrollEased = scrollProgress * scrollProgress;
      const scrollScale = THREE.MathUtils.lerp(1, 0.28, scrollEased);
      const pulse = 1 + 0.02 * Math.sin(time * 1.2);
      const baseScale = THREE.MathUtils.lerp(0.01, 1, reveal) * scrollScale;

      group.scale.setScalar(baseScale * pulse);
      group.position.y = scrollEased * 1.2;
      mat.uniforms.uScroll.value = scrollEased;

      rift.rotation.y += 0.002;
      rift.rotation.z += 0.001;
      core.rotation.y -= 0.001;
      ring.rotation.z += 0.003;
      outerRing.rotation.z -= 0.002;
    },
  };
}
