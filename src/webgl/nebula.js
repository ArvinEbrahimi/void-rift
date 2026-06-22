import * as THREE from 'three';

const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float t = uTime * 0.03;

    float n = fbm(uv * 3.0 + t);
    float n2 = fbm(uv * 5.0 - t * 0.7 + n);

    float blobL = smoothstep(0.6, 0.0, length(uv - vec2(-0.3, 0.1)) - n2 * 0.3);
    float blobR = smoothstep(0.6, 0.0, length(uv - vec2(0.3, -0.1)) - n2 * 0.2);

    vec3 col = mix(uColorA, uColorB, n);
    col = mix(col, uColorC, blobL * 0.4 + blobR * 0.3);

    float vignette = smoothstep(0.65, 0.05, length(uv));
    float alpha = (blobL * 0.55 + blobR * 0.45 + n * 0.15) * 0.38 * vignette;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function createNebula(scene) {
  const geo = new THREE.PlaneGeometry(20, 12);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(0x1a0a3d) },
      uColorB: { value: new THREE.Color(0x0d1f3c) },
      uColorC: { value: new THREE.Color(0x6e3fff) },
    },
    vertexShader: nebulaVertexShader,
    fragmentShader: nebulaFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.z = -3;
  scene.add(mesh);

  return {
    mesh,
    update(time) {
      mat.uniforms.uTime.value = time;
    },
  };
}
