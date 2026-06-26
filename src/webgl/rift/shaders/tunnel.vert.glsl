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
