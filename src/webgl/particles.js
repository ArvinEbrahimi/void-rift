import * as THREE from 'three';

export function createParticles(scene, riftGroup = null) {
  const starGeo = new THREE.BufferGeometry();
  const starCount = 6000;
  const starPos = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 50 + Math.random() * 150;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
    starSizes[i] = Math.random() * 0.25 + 0.05;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

  const starMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xe8e4f0) },
    },
    vertexShader: `
      attribute float size;
      uniform float uTime;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float twinkle = 0.8 + 0.2 * sin(uTime * 2.0 + position.x * 10.0);
        gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        gl_FragColor = vec4(uColor, alpha * 0.85);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 3000;
  const dustPos = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);
  const dustSizes = new Float32Array(dustCount);

  const colorA = new THREE.Color(0x1a0a3d);
  const colorB = new THREE.Color(0xb8a0e8);

  for (let i = 0; i < dustCount; i++) {
    const u = 1 - Math.random();
    const v = Math.random();
    const gauss = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    dustPos[i * 3] = gauss * 6 + (Math.random() - 0.5) * 3;
    dustPos[i * 3 + 1] = gauss * 3 + (Math.random() - 0.5) * 2;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const mixFactor = Math.random();
    const c = colorA.clone().lerp(colorB, mixFactor);
    dustColors[i * 3] = c.r;
    dustColors[i * 3 + 1] = c.g;
    dustColors[i * 3 + 2] = c.b;

    dustSizes[i] = Math.random() * 2.0 + 0.5;
  }

  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
  dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uTime;
      void main() {
        vColor = color;
        vec3 pos = position;
        pos.x += sin(uTime * 0.1 + position.z) * 0.1;
        pos.y += cos(uTime * 0.08 + position.x) * 0.08;
        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (200.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * 0.12;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  const riftGeo = new THREE.BufferGeometry();
  const riftCount = 1400;
  const riftPos = new Float32Array(riftCount * 3);
  const riftVel = new Float32Array(riftCount * 3);
  const riftLife = new Float32Array(riftCount);
  const riftSizes = new Float32Array(riftCount);

  for (let i = 0; i < riftCount; i++) {
    resetRiftParticle(i);
  }

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

  riftGeo.setAttribute('position', new THREE.BufferAttribute(riftPos, 3));
  riftGeo.setAttribute('size', new THREE.BufferAttribute(riftSizes, 1));
  riftGeo.setAttribute('life', new THREE.BufferAttribute(riftLife, 1));

  const riftMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(0x6e3fff) },
      uColorB: { value: new THREE.Color(0xe0b0ff) },
      uColorC: { value: new THREE.Color(0xa855f7) },
    },
    vertexShader: `
      attribute float size;
      attribute float life;
      uniform float uTime;
      varying float vLife;
      void main() {
        vLife = life;
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
        if (dist > 0.5) discard;
        float soft = 1.0 - smoothstep(0.0, 0.5, dist);
        float fade = smoothstep(0.0, 0.15, vLife) * (1.0 - smoothstep(0.75, 1.0, vLife));
        vec3 col = mix(uColorA, mix(uColorB, uColorC, dist * 1.5), vLife);
        gl_FragColor = vec4(col, soft * fade * 0.9);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const riftParticles = new THREE.Points(riftGeo, riftMat);
  if (riftGroup) riftGroup.add(riftParticles);
  else scene.add(riftParticles);

  return {
    stars,
    dust,
    riftParticles,
    update(time) {
      starMat.uniforms.uTime.value = time;
      dustMat.uniforms.uTime.value = time;
      riftMat.uniforms.uTime.value = time;

      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;

      for (let i = 0; i < riftCount; i++) {
        riftPos[i * 3] += riftVel[i * 3];
        riftPos[i * 3 + 1] += riftVel[i * 3 + 1];
        riftPos[i * 3 + 2] += riftVel[i * 3 + 2];
        riftLife[i] += 0.007;

        const dist = Math.sqrt(
          riftPos[i * 3] ** 2 +
          riftPos[i * 3 + 1] ** 2 +
          riftPos[i * 3 + 2] ** 2
        );

        if (riftLife[i] > 1 || dist > 3.5) {
          resetRiftParticle(i);
        }
      }

      riftGeo.attributes.position.needsUpdate = true;
      riftGeo.attributes.life.needsUpdate = true;
    },
  };
}
