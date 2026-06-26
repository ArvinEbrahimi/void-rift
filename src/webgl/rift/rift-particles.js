import * as THREE from 'three';

export function createRiftParticles(parent, tierConfig) {
  const riftCount = tierConfig.riftCount;
  const riftGeo = new THREE.BufferGeometry();
  const riftPos = new Float32Array(riftCount * 3);
  const riftVel = new Float32Array(riftCount * 3);
  const riftLife = new Float32Array(riftCount);
  const riftSizes = new Float32Array(riftCount);

  function resetRiftParticle(i) {
    const angle = Math.random() * Math.PI * 2;
    const hexSides = 6;
    const sector = Math.floor(angle / ((Math.PI * 2) / hexSides));
    const sectorAngle = (sector / hexSides) * Math.PI * 2 - Math.PI / 2;
    const mix = (angle - sectorAngle) / ((Math.PI * 2) / hexSides);
    const nextAngle = sectorAngle + (Math.PI * 2) / hexSides;
    const edgeAngle = THREE.MathUtils.lerp(sectorAngle, nextAngle, mix);
    const radius = 1.05 + Math.random() * 0.25;

    riftPos[i * 3] = Math.cos(edgeAngle) * radius;
    riftPos[i * 3 + 1] = (Math.random() - 0.5) * 0.18;
    riftPos[i * 3 + 2] = Math.sin(edgeAngle) * radius;

    const dir = new THREE.Vector3(riftPos[i * 3], riftPos[i * 3 + 1], riftPos[i * 3 + 2]).normalize();
    const spiral = new THREE.Vector3(-dir.z, 0.03, dir.x).multiplyScalar(0.02);
    dir.add(spiral).normalize();

    const speed = 0.018 + Math.random() * 0.035;
    riftVel[i * 3] = dir.x * speed;
    riftVel[i * 3 + 1] = dir.y * speed;
    riftVel[i * 3 + 2] = dir.z * speed;

    riftLife[i] = Math.random() * 0.3;
    riftSizes[i] = Math.random() * 0.2 + 0.06;
  }

  for (let i = 0; i < riftCount; i++) resetRiftParticle(i);

  riftGeo.setAttribute('position', new THREE.BufferAttribute(riftPos, 3));
  riftGeo.setAttribute('size', new THREE.BufferAttribute(riftSizes, 1));
  riftGeo.setAttribute('life', new THREE.BufferAttribute(riftLife, 1));

  const riftMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uColorA: { value: new THREE.Color(0x6e3fff) },
      uColorB: { value: new THREE.Color(0xe0b0ff) },
      uColorC: { value: new THREE.Color(0xa855f7) },
    },
    vertexShader: `
      attribute float size;
      attribute float life;
      uniform float uTime;
      uniform float uReveal;
      varying float vLife;
      void main() {
        vLife = life * uReveal;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        float flicker = 0.85 + 0.15 * sin(uTime * 8.0 + life * 20.0);
        gl_PointSize = size * flicker * (280.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      varying float vLife;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float soft = exp(-dist * dist * 18.0);
        float fade = smoothstep(0.0, 0.15, vLife) * (1.0 - smoothstep(0.75, 1.0, vLife));
        vec3 col = mix(uColorA, mix(uColorB, uColorC, dist * 1.5), vLife);
        gl_FragColor = vec4(col, soft * fade * 0.9);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(riftGeo, riftMat);
  parent.add(points);

  return {
    points,
    mat: riftMat,
    setReveal(value) {
      riftMat.uniforms.uReveal.value = value;
    },
    update(time, reveal) {
      riftMat.uniforms.uTime.value = time;
      riftMat.uniforms.uReveal.value = reveal;

      const rate = 0.007 * (0.5 + reveal * 0.5);
      for (let i = 0; i < riftCount; i++) {
        riftPos[i * 3] += riftVel[i * 3];
        riftPos[i * 3 + 1] += riftVel[i * 3 + 1];
        riftPos[i * 3 + 2] += riftVel[i * 3 + 2];
        riftLife[i] += rate;

        const dist = Math.sqrt(
          riftPos[i * 3] ** 2 + riftPos[i * 3 + 1] ** 2 + riftPos[i * 3 + 2] ** 2
        );

        if (riftLife[i] > 1 || dist > 3.5) resetRiftParticle(i);
      }

      riftGeo.attributes.position.needsUpdate = true;
      riftGeo.attributes.life.needsUpdate = true;
    },
  };
}
