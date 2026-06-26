import * as THREE from 'three';

const SORT_INTERVAL = 12;

export function createRiftParticles(parent, tierConfig, camera) {
  const riftCount = tierConfig.riftCount;
  const riftGeo = new THREE.BufferGeometry();
  const riftPos = new Float32Array(riftCount * 3);
  const riftVel = new Float32Array(riftCount * 3);
  const riftLife = new Float32Array(riftCount);
  const riftSizes = new Float32Array(riftCount);

  const sortIndices = new Uint32Array(riftCount);
  const sortDepths = new Float32Array(riftCount);
  const scratchPos = new Float32Array(riftCount * 3);
  const scratchVel = new Float32Array(riftCount * 3);
  const scratchLife = new Float32Array(riftCount);
  const scratchSizes = new Float32Array(riftCount);
  let sortFrame = 0;

  const tempVec = new THREE.Vector3();
  const viewMatrix = new THREE.Matrix4();

  const cometCount = Math.max(2, Math.floor(riftCount * 0.01));
  const cometSet = new Set();
  while (cometSet.size < cometCount) {
    cometSet.add(Math.floor(Math.random() * riftCount));
  }
  const cometIndices = [...cometSet];

  const trailHistory = new Float32Array(cometCount * 6 * 3);
  const trailAlphas = new Float32Array(cometCount * 6);
  for (let t = 0; t < cometCount * 6; t++) {
    trailAlphas[t] = (t % 6) / 5;
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

  for (let i = 0; i < riftCount; i++) resetRiftParticle(i);

  riftGeo.setAttribute('position', new THREE.BufferAttribute(riftPos, 3));
  riftGeo.setAttribute('size', new THREE.BufferAttribute(riftSizes, 1));
  riftGeo.setAttribute('life', new THREE.BufferAttribute(riftLife, 1));

  const riftMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uScrollVel: { value: 0 },
      uFogDensity: { value: 0.0008 },
      uColorA: { value: new THREE.Color(0x6e3fff) },
      uColorB: { value: new THREE.Color(0xe0b0ff) },
      uColorC: { value: new THREE.Color(0xa855f7) },
    },
    vertexShader: `
      attribute float size;
      attribute float life;
      uniform float uTime;
      uniform float uReveal;
      uniform float uScrollVel;
      varying float vLife;
      varying float vDepth;
      void main() {
        vLife = life * uReveal;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mvPos.z;
        float flicker = 0.85 + 0.15 * sin(uTime * 8.0 + life * 20.0);
        float scrollStretch = 1.0 + abs(uScrollVel) * 0.35;
        gl_PointSize = size * flicker * scrollStretch * (280.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      uniform float uFogDensity;
      varying float vLife;
      varying float vDepth;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float soft = exp(-dist * dist * 18.0);
        float fade = smoothstep(0.0, 0.15, vLife) * (1.0 - smoothstep(0.75, 1.0, vLife));
        float fog = exp(-uFogDensity * vDepth * vDepth);
        vec3 col = mix(uColorA, mix(uColorB, uColorC, dist * 1.5), vLife);
        gl_FragColor = vec4(col, soft * fade * fog * 0.9);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(riftGeo, riftMat);
  parent.add(points);

  const cometGeo = new THREE.BufferGeometry();
  const cometPosAttr = new THREE.BufferAttribute(new Float32Array(cometCount * 6 * 3), 3);
  const cometAlphaAttr = new THREE.BufferAttribute(trailAlphas, 1);
  cometGeo.setAttribute('position', cometPosAttr);
  cometGeo.setAttribute('alpha', cometAlphaAttr);
  cometGeo.setDrawRange(0, cometCount * 5 * 2);

  const cometIndicesArr = new Uint16Array(cometCount * 5 * 2);
  let idx = 0;
  for (let c = 0; c < cometCount; c++) {
    const base = c * 6;
    for (let s = 0; s < 5; s++) {
      cometIndicesArr[idx++] = base + s;
      cometIndicesArr[idx++] = base + s + 1;
    }
  }
  cometGeo.setIndex(new THREE.BufferAttribute(cometIndicesArr, 1));

  const cometMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uColor: { value: new THREE.Color(0xc4a0ff) },
    },
    vertexShader: `
      attribute float alpha;
      uniform float uReveal;
      varying float vAlpha;
      void main() {
        vAlpha = alpha * uReveal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float fade = pow(vAlpha, 1.6);
        gl_FragColor = vec4(uColor, fade * 0.55);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const comets = new THREE.LineSegments(cometGeo, cometMat);
  parent.add(comets);

  function pushTrail(cometIdx, particleIdx) {
    const base = cometIdx * 6 * 3;
    for (let s = 5; s > 0; s--) {
      const dst = base + s * 3;
      const src = base + (s - 1) * 3;
      trailHistory[dst] = trailHistory[src];
      trailHistory[dst + 1] = trailHistory[src + 1];
      trailHistory[dst + 2] = trailHistory[src + 2];
    }
    trailHistory[base] = riftPos[particleIdx * 3];
    trailHistory[base + 1] = riftPos[particleIdx * 3 + 1];
    trailHistory[base + 2] = riftPos[particleIdx * 3 + 2];
  }

  function sortByDepth() {
    if (!camera) return;

    viewMatrix.copy(camera.matrixWorldInverse).multiply(parent.matrixWorld);

    for (let i = 0; i < riftCount; i++) {
      sortIndices[i] = i;
      tempVec.set(riftPos[i * 3], riftPos[i * 3 + 1], riftPos[i * 3 + 2]).applyMatrix4(viewMatrix);
      sortDepths[i] = tempVec.z;
    }

    sortIndices.sort((a, b) => sortDepths[b] - sortDepths[a]);

    for (let i = 0; i < riftCount; i++) {
      const src = sortIndices[i];
      const dst = i;
      scratchPos[dst * 3] = riftPos[src * 3];
      scratchPos[dst * 3 + 1] = riftPos[src * 3 + 1];
      scratchPos[dst * 3 + 2] = riftPos[src * 3 + 2];
      scratchVel[dst * 3] = riftVel[src * 3];
      scratchVel[dst * 3 + 1] = riftVel[src * 3 + 1];
      scratchVel[dst * 3 + 2] = riftVel[src * 3 + 2];
      scratchLife[dst] = riftLife[src];
      scratchSizes[dst] = riftSizes[src];
    }

    riftPos.set(scratchPos);
    riftVel.set(scratchVel);
    riftLife.set(scratchLife);
    riftSizes.set(scratchSizes);

    const oldToNew = new Uint32Array(riftCount);
    for (let newIdx = 0; newIdx < riftCount; newIdx++) {
      oldToNew[sortIndices[newIdx]] = newIdx;
    }
    for (let c = 0; c < cometCount; c++) {
      cometIndices[c] = oldToNew[cometIndices[c]];
    }
  }

  return {
    points,
    comets,
    mat: riftMat,
    setReveal(value) {
      riftMat.uniforms.uReveal.value = value;
      cometMat.uniforms.uReveal.value = value;
    },
    setScrollVelocity(vel) {
      riftMat.uniforms.uScrollVel.value = vel;
    },
    setFogDensity(density) {
      riftMat.uniforms.uFogDensity.value = density;
    },
    update(time, reveal) {
      riftMat.uniforms.uTime.value = time;
      riftMat.uniforms.uReveal.value = reveal;
      cometMat.uniforms.uTime.value = time;
      cometMat.uniforms.uReveal.value = reveal;

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

      for (let c = 0; c < cometCount; c++) {
        pushTrail(c, cometIndices[c]);
      }

      sortFrame++;
      if (sortFrame >= SORT_INTERVAL) {
        sortFrame = 0;
        sortByDepth();
      }

      riftGeo.attributes.position.needsUpdate = true;
      riftGeo.attributes.life.needsUpdate = true;
      cometPosAttr.array.set(trailHistory);
      cometPosAttr.needsUpdate = true;
    },
  };
}
