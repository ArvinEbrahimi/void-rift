import * as THREE from 'three';

export function createHexFrameGeometry(outerRadius = 1.45, innerRadius = 1.15, depth = 0.12) {
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
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 1,
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

export function createOrbitalShards(count = 16, radius = 1.95) {
  const geo = new THREE.TetrahedronGeometry(0.06, 0);
  const positions = [];
  const orbits = [];
  const speeds = [];

  for (let i = 0; i < count; i++) {
    const orbit = (i / count) * Math.PI * 2;
    const tilt = (Math.random() - 0.5) * 0.4;
    const r = radius + (Math.random() - 0.5) * 0.2;

    positions.push(Math.cos(orbit) * r, tilt, Math.sin(orbit) * r);
    orbits.push(orbit);
    speeds.push(0.15 + Math.random() * 0.35);
  }

  const instanced = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial(), count);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i++) {
    dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    dummy.updateMatrix();
    instanced.setMatrixAt(i, dummy.matrix);
  }

  instanced.userData.orbits = orbits;
  instanced.userData.speeds = speeds;
  return instanced;
}

export function createPortalShellGeometry() {
  const geo = new THREE.IcosahedronGeometry(1.22, 10);
  return geo;
}

export function createFacetGeometry() {
  return new THREE.IcosahedronGeometry(1.02, 2);
}

export function createTunnelGeometry() {
  const geo = new THREE.CylinderGeometry(0.95, 0.35, 1.6, 48, 1, true);
  geo.rotateX(Math.PI / 2);
  return geo;
}
