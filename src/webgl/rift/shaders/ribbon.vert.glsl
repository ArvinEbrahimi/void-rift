uniform float uRibbonPhase;
varying float vPhase;
varying vec2 vUv;
void main() {
  vPhase = uRibbonPhase;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
