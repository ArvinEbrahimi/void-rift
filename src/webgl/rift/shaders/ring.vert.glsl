uniform float uTime;
varying vec2 vUv;
varying float vAngle;
void main() {
  vUv = uv;
  vAngle = atan(position.y, position.x);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
