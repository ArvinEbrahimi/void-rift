uniform float uTime;
uniform float uReveal;
varying float vPhase;

void main() {
  float pulse = 0.4 + 0.6 * sin(uTime * 4.0 + vPhase * 6.28);
  vec3 col = vec3(0.65, 0.28, 1.0) * pulse;
  float alpha = pulse * 0.7 * uReveal;
  gl_FragColor = vec4(col, alpha);
}
