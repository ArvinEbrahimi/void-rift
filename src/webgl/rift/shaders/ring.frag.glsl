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
