import * as THREE from 'three';
import { getTierConfig } from '../utils/quality-tier.js';

export function createParticles(scene, tierConfig = getTierConfig()) {
  const starCount = tierConfig.starCount;
  const dustCount = tierConfig.dustCount;

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);
  const starColors = new Float32Array(starCount * 3);

  const tempColor = new THREE.Color();
  const hotStar = new THREE.Color(0xc8d8ff);
  const warmStar = new THREE.Color(0xe8e4f0);
  const coolStar = new THREE.Color(0x9090b8);

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 50 + Math.random() * 150;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
    starSizes[i] = Math.random() * 0.25 + 0.05;

    const temp = Math.random();
    if (temp < 0.15) tempColor.copy(hotStar);
    else if (temp < 0.7) tempColor.copy(warmStar);
    else tempColor.copy(coolStar);

    starColors[i * 3] = tempColor.r;
    starColors[i * 3 + 1] = tempColor.g;
    starColors[i * 3 + 2] = tempColor.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uScrollVel: { value: 0 } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDepth;
      uniform float uTime;
      uniform float uScrollVel;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mvPosition.z;
        float twinkle = 0.8 + 0.2 * sin(uTime * 2.0 + position.x * 10.0);
        float scrollStretch = 1.0 + abs(uScrollVel) * 0.2;
        gl_PointSize = size * twinkle * scrollStretch * (300.0 / max(vDepth, 1.0));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDepth;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float soft = exp(-dist * dist * 16.0);
        float depthFade = smoothstep(220.0, 40.0, vDepth);
        gl_FragColor = vec4(vColor, soft * depthFade * 0.85);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);
  const dustSizes = new Float32Array(dustCount);
  const dustPhase = new Float32Array(dustCount);

  const colorA = new THREE.Color(0x1a0a3d);
  const colorB = new THREE.Color(0xb8a0e8);

  for (let i = 0; i < dustCount; i++) {
    const u = 1 - Math.random();
    const v = Math.random();
    const gauss = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    dustPos[i * 3] = gauss * 6 + (Math.random() - 0.5) * 3;
    dustPos[i * 3 + 1] = gauss * 3 + (Math.random() - 0.5) * 2;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const mixFactor = Math.random();
    const c = colorA.clone().lerp(colorB, mixFactor);
    dustColors[i * 3] = c.r;
    dustColors[i * 3 + 1] = c.g;
    dustColors[i * 3 + 2] = c.b;

    dustSizes[i] = Math.random() * 2.0 + 0.5;
    dustPhase[i] = Math.random() * Math.PI * 2;
  }

  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
  dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));
  dustGeo.setAttribute('phase', new THREE.BufferAttribute(dustPhase, 1));

  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      attribute float phase;
      varying vec3 vColor;
      varying float vDepth;
      uniform float uTime;
      void main() {
        vColor = color;
        vec3 pos = position;
        float t = uTime * 0.12 + phase;
        pos.x += sin(t + position.z * 0.3) * 0.12 + sin(t * 2.1) * 0.04;
        pos.y += cos(t * 0.9 + position.x * 0.25) * 0.1;
        pos.z += sin(t * 1.3 + position.y) * 0.06;
        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        vDepth = -mvPos.z;
        gl_PointSize = size * (200.0 / max(vDepth, 1.0));
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDepth;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float soft = exp(-dist * dist * 12.0);
        float depthFade = smoothstep(80.0, 8.0, vDepth);
        gl_FragColor = vec4(vColor, soft * depthFade * 0.12);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  return {
    stars,
    dust,
    setScrollVelocity(vel) {
      starMat.uniforms.uScrollVel.value = vel;
    },
    update(time) {
      starMat.uniforms.uTime.value = time;
      dustMat.uniforms.uTime.value = time;
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;
    },
  };
}
