uniform float uTime;
uniform float uReveal;
attribute float aOrbit;
attribute float aSpeed;
varying float vGlow;
void main() {
  float angle = aOrbit + uTime * aSpeed;
  vec3 pos = position;
  pos.x += cos(angle) * 0.15;
  pos.z += sin(angle) * 0.15;
  pos.y += sin(uTime * 2.0 + aOrbit) * 0.08;
  vGlow = 0.5 + 0.5 * sin(uTime * 3.0 + aOrbit * 5.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
