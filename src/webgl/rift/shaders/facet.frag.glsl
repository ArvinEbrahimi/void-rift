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
