uniform float uTime;
uniform float uReveal;
varying vec2 vUv;
varying vec3 vPosition;

// __NOISE__

void main() {
  float radius = length(vPosition.xy);
  float swirl = atan(vPosition.y, vPosition.x) + log(radius + 0.5) * 2.5 - uTime * 1.8;
  float bands = sin(swirl * 8.0) * 0.5 + 0.5;
  float depth = smoothstep(1.2, 0.0, radius);
  float horizon = 1.0 - smoothstep(0.0, 0.15 + fwidth(radius), radius);

  float n = fbm3(vec3(vUv * 4.0, uTime * 0.15));
  vec3 col = mix(vec3(0.005, 0.0, 0.02), vec3(0.25, 0.05, 0.55), bands * 0.4 + n * 0.2);
  col += vec3(0.45, 0.12, 0.85) * pow(bands, 4.0) * depth * 0.6;
  col = mix(col, vec3(0.0), horizon * 0.85);

  float alpha = (depth * 0.75 + bands * 0.15) * uReveal * (1.0 - horizon * 0.5);
  gl_FragColor = vec4(col, alpha);
}
