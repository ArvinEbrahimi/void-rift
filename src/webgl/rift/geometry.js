import * as THREE from 'three';

export function createHexFrameGeometry(outerRadius = 1.48, innerRadius = 1.1, depth = 0.14) {
  const shape = new THREE.Shape();

  for (let i = 0; i <= 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * outerRadius;
    const y = Math.sin(angle) * outerRadius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  const hole = new THREE.Path();
  for (let i = 0; i <= 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * innerRadius;
    const y = Math.sin(angle) * innerRadius;
    if (i === 0) hole.moveTo(x, y);
    else hole.lineTo(x, y);
  }
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.028,
    bevelSegments: 3,
    curveSegments: 2,
  });

  geo.rotateX(Math.PI / 2);
  geo.center();
  return geo;
}

export function createHexFilaments(radius = 1.32, height = 0.08) {
  const points = [];
  const phases = [];

  for (let i = 0; i < 6; i++) {
    const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const a2 = (((i + 1) % 6) / 6) * Math.PI * 2 - Math.PI / 2;
    const x1 = Math.cos(a1) * radius;
    const z1 = Math.sin(a1) * radius;
    const x2 = Math.cos(a2) * radius;
    const z2 = Math.sin(a2) * radius;
    const segments = 20;

    for (let s = 0; s < segments; s++) {
      const t1 = s / segments;
      const t2 = (s + 1) / segments;
      const wave1 = Math.sin(t1 * Math.PI) * height;
      const wave2 = Math.sin(t2 * Math.PI) * height;

      points.push(
        THREE.MathUtils.lerp(x1, x2, t1),
        wave1,
        THREE.MathUtils.lerp(z1, z2, t1),
        THREE.MathUtils.lerp(x1, x2, t2),
        wave2,
        THREE.MathUtils.lerp(z1, z2, t2)
      );
      phases.push(i + t1, i + t2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1));
  return geo;
}

export function createTunnelLatheGeometry() {
  const profile = [];
  const segments = 24;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = (t - 0.5) * 1.85;
    const flare = 1.0 + Math.sin(t * Math.PI) * 0.12;
    const radius = THREE.MathUtils.lerp(0.98, 0.22, Math.pow(t, 1.35)) * flare;
    profile.push(new THREE.Vector2(radius, y));
  }

  const geo = new THREE.LatheGeometry(profile, 56);
  geo.rotateX(Math.PI / 2);
  return geo;
}

export function createAccretionDiscGeometry() {
  return new THREE.RingGeometry(0.32, 0.62, 96, 4);
}

export function createEnergyRibbons() {
  const meshes = [];
  const axes = [
    { rx: 0, ry: 0, rz: 0 },
    { rx: Math.PI / 3, ry: Math.PI / 4, rz: 0 },
    { rx: -Math.PI / 4, ry: Math.PI / 2, rz: Math.PI / 6 },
  ];

  axes.forEach((axis, idx) => {
    const points = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48;
      const angle = t * Math.PI * 5 + idx * 0.8;
      const r = 1.45 + Math.sin(t * 10 + idx) * 0.12;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * r,
          Math.sin(t * Math.PI * 3) * 0.22,
          Math.sin(angle) * r
        )
      );
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 120, 0.007, 6, false);
    const mesh = new THREE.Mesh(geo);
    mesh.rotation.set(axis.rx, axis.ry, axis.rz);
    mesh.userData.phase = idx * 2.1;
    meshes.push(mesh);
  });

  return meshes;
}

export function createVariedOrbitalShards(count = 18, radius = 2.05) {
  const group = new THREE.Group();
  const prototypes = [
    new THREE.TetrahedronGeometry(0.055, 0),
    new THREE.OctahedronGeometry(0.05, 0),
    new THREE.IcosahedronGeometry(0.042, 0),
  ];

  const perType = Math.ceil(count / prototypes.length);
  const allOrbits = [];
  const allSpeeds = [];
  let index = 0;

  prototypes.forEach((geo, typeIdx) => {
    const typeCount = typeIdx === prototypes.length - 1 ? count - index : perType;
    const mat = new THREE.MeshBasicMaterial({
      color: 0xb87fff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const instanced = new THREE.InstancedMesh(geo, mat, typeCount);
    const orbits = [];
    const speeds = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < typeCount; i++) {
      const orbit = ((index + i) / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.25;
      dummy.position.set(Math.cos(orbit) * r, (Math.random() - 0.5) * 0.2, Math.sin(orbit) * r);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
      orbits.push(orbit);
      speeds.push(0.12 + Math.random() * 0.3);
    }

    instanced.userData.orbits = orbits;
    instanced.userData.speeds = speeds;
    instanced.userData.typeIdx = typeIdx;
    group.add(instanced);
    allOrbits.push(orbits);
    allSpeeds.push(speeds);
    index += typeCount;
  });

  group.userData.shardMeshes = group.children;
  return group;
}

export function createOrbitalShards(count = 16, radius = 1.95) {
  return createVariedOrbitalShards(count, radius);
}

export function createPortalShellGeometry() {
  const geo = new THREE.IcosahedronGeometry(1.22, 10);
  return geo;
}

export function createPortalShellGeometryLOD() {
  return new THREE.IcosahedronGeometry(1.22, 3);
}

export function createTunnelGeometryLOD() {
  const profile = [];
  const segments = 12;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = (t - 0.5) * 1.85;
    const flare = 1.0 + Math.sin(t * Math.PI) * 0.12;
    const radius = THREE.MathUtils.lerp(0.98, 0.22, Math.pow(t, 1.35)) * flare;
    profile.push(new THREE.Vector2(radius, y));
  }

  const geo = new THREE.LatheGeometry(profile, 24);
  geo.rotateX(Math.PI / 2);
  return geo;
}

export function createRiftImpostorGeometry() {
  const geo = new THREE.IcosahedronGeometry(1.05, 2);
  return geo;
}

export function createFacetGeometry() {
  return new THREE.IcosahedronGeometry(1.02, 2);
}

export function createTunnelGeometry() {
  return createTunnelLatheGeometry();
}
