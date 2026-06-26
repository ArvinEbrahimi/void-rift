uniform float uTime;
uniform float uReveal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  float radius = length(vPosition.xy);
  float angle = atan(vPosition.y, vPosition.x);
  float spin = angle + uTime * 2.2 - radius * 4.0;
  float bands = sin(spin * 12.0) * 0.5 + 0.5;
  float inner = smoothstep(0.32, 0.38, radius);
  float outer = 1.0 - smoothstep(0.58, 0.64, radius);
  float mask = inner * outer;

  vec3 col = mix(vec3(0.15, 0.02, 0.35), vec3(0.85, 0.35, 1.0), bands);
  col += vec3(1.0, 0.6, 0.9) * pow(bands, 6.0) * 0.4;

  float alpha = mask * (0.35 + bands * 0.45) * uReveal;
  gl_FragColor = vec4(col, alpha);
}
