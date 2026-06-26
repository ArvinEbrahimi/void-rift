uniform float uReveal;
varying float vGlow;
void main() {
  vec3 col = vec3(0.7, 0.35, 1.0) * vGlow;
  gl_FragColor = vec4(col, vGlow * 0.85 * uReveal);
}
