export const NOISE_GLSL = `
  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise3(vec3 p) {
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

  float fbm3(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise3(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  float ridged(vec3 p) {
    float n = 1.0 - abs(noise3(p) * 2.0 - 1.0);
    return n * n;
  }

  float hexFold(vec3 p) {
    float angle = atan(p.y, p.x);
    float hex = cos(floor(0.5 + angle / 1.0472) * 1.0472 - angle);
    return hex;
  }
`;

export const shellVertexShader = `
  uniform float uTime;
  uniform float uMouse;
  uniform float uReveal;
  uniform float uScroll;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying float vDisplace;
  varying float vHex;
  varying float vFresnel;

  ${NOISE_GLSL}

  void main() {
    vec3 pos = position;
    vec3 n = normalize(normal);

    float hex = hexFold(pos);
    float breathe = sin(uTime * 0.9 + pos.y * 2.5) * 0.06;
    float warp = fbm3(pos * 1.8 + vec3(uTime * 0.22));
    float ridge = ridged(pos * 3.2 - vec3(uTime * 0.18)) * 0.35;
    float displace = (warp * 0.42 + ridge + breathe) * uReveal;
    displace += uMouse * (warp + hex * 0.25) * 0.35;
    displace *= 0.85 + hex * 0.25;

    vDisplace = displace;
    vHex = hex;

    vec3 displaced = pos + n * displace;
    displaced.y += uScroll * 0.8;

    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * n);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.4);
    vFresnel = fresnel;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const shellFragmentShader = `
  uniform float uTime;
  uniform float uReveal;
  uniform float uMouse;
  uniform vec3 uKeyLightPos;
  uniform vec3 uRimLightPos;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying float vDisplace;
  varying float vHex;
  varying float vFresnel;

  ${NOISE_GLSL}

  void main() {
    float fresnel = vFresnel;
    float pulse = 0.78 + 0.22 * sin(uTime * 1.35 + vDisplace * 4.0);

    float veins = ridged(vWorldPos * 4.5 + vec3(uTime * 0.35, -uTime * 0.2, uTime * 0.15));
    veins = smoothstep(0.55, 0.95, veins);

    float scan = sin((vWorldPos.y + vWorldPos.x) * 12.0 - uTime * 2.5) * 0.5 + 0.5;
    scan = pow(scan, 8.0) * 0.35;

    vec3 N = normalize(vNormal);
    vec3 keyDir = normalize(uKeyLightPos - vWorldPos);
    vec3 rimDir = normalize(uRimLightPos - vWorldPos);
    float keyWrap = clamp(dot(N, keyDir) * 0.55 + 0.45, 0.0, 1.0);
    float rimWrap = clamp(dot(N, rimDir) * 0.5 + 0.5, 0.0, 1.0);
    float thickness = pow(fresnel, 1.8);
    float absorption = 1.0 - smoothstep(0.0, 0.65, thickness) * 0.35;

    vec3 voidCore = vec3(0.01, 0.005, 0.04);
    vec3 innerGlow = vec3(0.35, 0.08, 0.95);
    vec3 edgeGlow = vec3(0.72, 0.32, 1.0);
    vec3 hotEdge = vec3(0.92, 0.55, 1.0);

    vec3 col = mix(voidCore, innerGlow, fresnel * 0.9);
    col = mix(col, edgeGlow, fresnel * fresnel * 1.2);
    col += hotEdge * veins * (0.35 + uMouse * 0.4);
    col += edgeGlow * scan;
    col += innerGlow * vDisplace * 1.4;
    col += vec3(0.2, 0.05, 0.5) * vHex * fresnel;
    col += vec3(0.55, 0.25, 1.0) * keyWrap * 0.45 * absorption;
    col += vec3(0.45, 0.15, 0.85) * rimWrap * 0.35 * (1.0 - thickness);

    float chroma = fresnel * 0.15;
    col.r += chroma * 0.4;
    col.b -= chroma * 0.2;

    col *= pulse;

    float alpha = (fresnel * 0.85 + veins * 0.35 + vDisplace * 0.25 + keyWrap * 0.1) * uReveal;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(col, alpha);
  }
`;

export const facetVertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const facetFragmentShader = `
  uniform float uTime;
  uniform float uReveal;
  varying vec3 vPosition;

  void main() {
    float edge = max(abs(vPosition.x), max(abs(vPosition.y), abs(vPosition.z)));
    float glow = smoothstep(0.75, 1.05, edge);
    float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + edge * 8.0);
    vec3 col = vec3(0.55, 0.22, 1.0) * glow * pulse;
    float alpha = glow * 0.45 * uReveal;
    gl_FragColor = vec4(col, alpha);
  }
`;

export const tunnelVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    vec3 pos = position;
    float twist = sin(uTime * 0.6 + length(pos.xy) * 4.0) * 0.04;
    pos.x += twist * pos.y;
    pos.y -= twist * pos.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const tunnelFragmentShader = `
  uniform float uTime;
  uniform float uReveal;
  varying vec2 vUv;
  varying vec3 vPosition;

  ${NOISE_GLSL}

  void main() {
    float radius = length(vPosition.xy);
    float swirl = atan(vPosition.y, vPosition.x) + log(radius + 0.5) * 2.5 - uTime * 1.8;
    float bands = sin(swirl * 8.0) * 0.5 + 0.5;
    float depth = smoothstep(1.2, 0.0, radius);
    float horizon = smoothstep(0.15, 0.0, radius);

    float n = fbm3(vec3(vUv * 4.0, uTime * 0.15));
    vec3 col = mix(vec3(0.005, 0.0, 0.02), vec3(0.25, 0.05, 0.55), bands * 0.4 + n * 0.2);
    col += vec3(0.45, 0.12, 0.85) * pow(bands, 4.0) * depth * 0.6;
    col = mix(col, vec3(0.0), horizon * 0.85);

    float alpha = (depth * 0.75 + bands * 0.15) * uReveal * (1.0 - horizon * 0.5);
    gl_FragColor = vec4(col, alpha);
  }
`;

export const ringVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vAngle;
  void main() {
    vUv = uv;
    vAngle = atan(position.y, position.x);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ringFragmentShader = `
  uniform float uTime;
  uniform float uReveal;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vAngle;

  void main() {
    float dash = sin(vAngle * 18.0 + uTime * 3.0) * 0.5 + 0.5;
    dash *= sin(vAngle * 6.0 - uTime * 1.2) * 0.5 + 0.5;
    float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + vAngle * 3.0);
    vec3 col = uColor * (0.6 + dash * 0.8) * pulse;
    float alpha = (0.25 + dash * 0.55) * uReveal;
    gl_FragColor = vec4(col, alpha);
  }
`;

export const filamentVertexShader = `
  uniform float uTime;
  attribute float aPhase;
  varying float vPhase;
  void main() {
    vPhase = aPhase;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const filamentFragmentShader = `
  uniform float uTime;
  uniform float uReveal;
  varying float vPhase;

  void main() {
    float pulse = 0.4 + 0.6 * sin(uTime * 4.0 + vPhase * 6.28);
    vec3 col = vec3(0.65, 0.28, 1.0) * pulse;
    float alpha = pulse * 0.7 * uReveal;
    gl_FragColor = vec4(col, alpha);
  }
`;

export const shardVertexShader = `
  uniform float uTime;
  uniform float uReveal;
  attribute float aOrbit;
  attribute float aSpeed;
  varying float vGlow;
  void main() {
    float angle = aOrbit + uTime * aSpeed;
    vec3 pos = position;
    pos.x += cos(angle) * 0.15;
    pos.z += sin(angle) * 0.15;
    pos.y += sin(uTime * 2.0 + aOrbit) * 0.08;
    vGlow = 0.5 + 0.5 * sin(uTime * 3.0 + aOrbit * 5.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const shardFragmentShader = `
  uniform float uReveal;
  varying float vGlow;
  void main() {
    vec3 col = vec3(0.7, 0.35, 1.0) * vGlow;
    gl_FragColor = vec4(col, vGlow * 0.85 * uReveal);
  }
`;
