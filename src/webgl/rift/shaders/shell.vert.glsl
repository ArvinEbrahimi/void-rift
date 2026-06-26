uniform float uTime;
uniform float uMouse;
uniform float uReveal;
uniform float uScroll;
uniform float uHexMorph;
uniform float uQuality;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vViewDir;
varying float vDisplace;
varying float vHex;
varying float vFresnel;

// __NOISE__

vec3 toHexPrism(vec3 p, float amount) {
  float angle = atan(p.z, p.x);
  float r = length(p.xz);
  float hex = cos(floor(0.5 + angle / 1.0472) * 1.0472 - angle);
  float targetR = mix(r, 1.12 * hex, 0.7);
  vec3 outP = p;
  outP.x = cos(angle) * targetR;
  outP.z = sin(angle) * targetR;
  return mix(p, outP, amount);
}

float fbmQuality(vec3 p, float quality) {
  float value = 0.0;
  float amplitude = 0.5;
  int maxIter = quality > 0.7 ? 6 : (quality > 0.55 ? 4 : 3);
  for (int i = 0; i < 6; i++) {
    if (i >= maxIter) break;
    value += amplitude * noise3(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

float shellDisplace(vec3 pos, vec3 n, float hex) {
  float breathe = sin(uTime * 0.9 + pos.y * 2.5) * 0.06
                + sin(uTime * 1.65 + pos.x * 3.0) * 0.035
                + sin(uTime * 0.42 + pos.z * 2.0) * 0.02;
  float warp = fbmQuality(pos * 1.8 + vec3(uTime * 0.22), uQuality);
  float ridge = ridged(pos * 3.2 - vec3(uTime * 0.18)) * 0.35;
  float displace = (warp * 0.42 + ridge + breathe) * uReveal;
  displace += uMouse * (warp + hex * 0.25) * 0.35;
  return displace * (0.85 + hex * 0.25);
}

void main() {
  vec3 pos = toHexPrism(position, uHexMorph * uReveal);
  vec3 n = normalize(normal);
  float hex = hexFold(pos);
  float displace = shellDisplace(pos, n, hex);

  vDisplace = displace;
  vHex = hex;

  float eps = 0.018;
  vec3 tangent = normalize(cross(n, vec3(0.0, 1.0, 0.001)));
  vec3 bitangent = normalize(cross(n, tangent));
  float dC = displace;
  float dT = shellDisplace(pos + tangent * eps, n, hexFold(pos + tangent * eps));
  float dB = shellDisplace(pos + bitangent * eps, n, hexFold(pos + bitangent * eps));

  vec3 displaced = pos + n * dC;
  vec3 neighborT = pos + tangent * eps + n * dT;
  vec3 neighborB = pos + bitangent * eps + n * dB;
  vec3 displacedNormal = normalize(cross(neighborT - displaced, neighborB - displaced));

  displaced.y += uScroll * 0.8;

  vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
  vWorldPos = worldPos.xyz;
  vNormal = normalize(normalMatrix * displacedNormal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  vFresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.4);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
