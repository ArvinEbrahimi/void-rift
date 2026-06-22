import * as THREE from 'three';

const riftVertexShader = `
  uniform float uTime;
  uniform float uMouse;
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
    float displace = n * 0.35 + sin(uTime * 0.8) * 0.08;
    displace += uMouse * n * 0.2;
    vDisplace = displace;

    vec3 newPos = position + normal * displace;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const riftFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplace;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(normalize(vNormal), viewDir), 2.5);

    vec3 colorCore = vec3(0.02, 0.01, 0.08);
    vec3 colorGlow = vec3(0.43, 0.15, 1.0);
    vec3 colorEdge = vec3(0.66, 0.33, 0.97);

    vec3 col = mix(colorCore, colorGlow, fresnel);
    col = mix(col, colorEdge, fresnel * fresnel);
    col += colorGlow * vDisplace * 0.8;

    float pulse = 0.85 + 0.15 * sin(uTime * 1.2);
    col *= pulse;

    float alpha = mix(0.3, 1.0, fresnel) * (0.7 + vDisplace * 0.3);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function createRift(scene) {
  const geo = new THREE.IcosahedronGeometry(1.2, 8);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: 0 },
    },
    vertexShader: riftVertexShader,
    fragmentShader: riftFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const rift = new THREE.Mesh(geo, mat);
  rift.position.set(0, 0, 0);
  scene.add(rift);

  const coreGeo = new THREE.IcosahedronGeometry(0.85, 4);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x03030a,
    transparent: true,
    opacity: 0.95,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  const ringGeo = new THREE.TorusGeometry(1.6, 0.02, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.3,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  return {
    rift,
    core,
    ring,
    update(time, mouseProximity = 0) {
      mat.uniforms.uTime.value = time;
      mat.uniforms.uMouse.value = mouseProximity;
      rift.rotation.y += 0.002;
      rift.rotation.z += 0.001;
      core.rotation.y -= 0.001;
      ring.rotation.z += 0.003;

      const pulse = 1 + 0.02 * Math.sin(time * 1.2);
      ring.scale.setScalar(pulse);
    },
  };
}
