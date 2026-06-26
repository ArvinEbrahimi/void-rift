import * as THREE from 'three';

const nebulaVertexShader = `
  uniform float uParallax;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.x += uParallax * 0.4;
    pos.y += uParallax * 0.25;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  uniform float uDepth;
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
    float t = uTime * (0.02 + uDepth * 0.01);

    float n = fbm(uv * (2.5 + uDepth) + t);
    float n2 = fbm(uv * (4.0 + uDepth * 0.5) - t * 0.8 + n);

    float blobL = smoothstep(0.65, 0.0, length(uv - vec2(-0.32, 0.12)) - n2 * 0.35);
    float blobR = smoothstep(0.65, 0.0, length(uv - vec2(0.28, -0.08)) - n2 * 0.25);

    vec3 col = mix(uColorA, uColorB, n);
    col = mix(col, uColorC, blobL * 0.45 + blobR * 0.35);

    float vignette = smoothstep(0.7, 0.05, length(uv));
    float depthFade = 0.28 + uDepth * 0.18;
    float alpha = (blobL * 0.5 + blobR * 0.4 + n * 0.12) * depthFade * vignette;
    gl_FragColor = vec4(col, alpha);
  }
`;

const LAYERS = [
  { z: -2, scale: 1.0, depth: 0.3, parallax: 0.15 },
  { z: -5.5, scale: 1.35, depth: 0.6, parallax: 0.35 },
  { z: -9, scale: 1.7, depth: 1.0, parallax: 0.55 },
];

function createNebulaLayer(config) {
  const geo = new THREE.PlaneGeometry(22 * config.scale, 14 * config.scale);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDepth: { value: config.depth },
      uParallax: { value: 0 },
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
  mesh.position.z = config.z;
  return { mesh, mat, parallax: config.parallax };
}

export function createNebulaVolume(scene) {
  const group = new THREE.Group();
  group.name = 'NebulaVolume';
  scene.add(group);

  const layers = LAYERS.map((config) => {
    const layer = createNebulaLayer(config);
    if (config.z <= -5) {
      layer.mesh.renderOrder = -20;
      layer.mat.depthWrite = true;
    }
    group.add(layer.mesh);
    return layer;
  });

  let mouseParallax = 0;
  let scrollParallax = 0;

  return {
    group,
    layers,
    setParallax(mouse, scroll) {
      mouseParallax = mouse;
      scrollParallax = scroll;
    },
    update(time) {
      layers.forEach((layer) => {
        layer.mat.uniforms.uTime.value = time;
        layer.mat.uniforms.uParallax.value =
          mouseParallax * layer.parallax + scrollParallax * layer.parallax * 0.5;
      });
    },
  };
}
