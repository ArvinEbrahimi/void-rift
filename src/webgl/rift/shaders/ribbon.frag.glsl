uniform float uTime;
uniform float uReveal;
varying float vPhase;
varying vec2 vUv;

void main() {
  float streak = sin(vUv.x * 24.0 - uTime * 6.0 + vPhase) * 0.5 + 0.5;
  streak *= 1.0 - abs(vUv.y - 0.5) * 2.0;
  vec3 col = mix(vec3(0.4, 0.1, 0.9), vec3(0.9, 0.5, 1.0), streak);
  float alpha = streak * 0.55 * uReveal;
  gl_FragColor = vec4(col, alpha);
}
