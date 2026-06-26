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

// __NOISE__

void main() {
  float fresnel = vFresnel;
  float pulse = 0.78 + 0.22 * sin(uTime * 1.35 + vDisplace * 4.0);

  float veins = ridged(vWorldPos * 4.5 + vec3(uTime * 0.35, -uTime * 0.2, uTime * 0.15));
  veins = aastep(0.55, veins);

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
