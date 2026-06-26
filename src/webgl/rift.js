import * as THREE from 'three';
import { gsap } from 'gsap';
import {
  shellVertexShader,
  shellFragmentShader,
  facetVertexShader,
  facetFragmentShader,
  tunnelVertexShader,
  tunnelFragmentShader,
  ringVertexShader,
  ringFragmentShader,
  filamentVertexShader,
  filamentFragmentShader,
  accretionVertexShader,
  accretionFragmentShader,
  ribbonVertexShader,
  ribbonFragmentShader,
} from './rift/shaders/index.js';
import {
  createPortalShellGeometry,
  createFacetGeometry,
  createTunnelGeometry,
  createHexFrameGeometry,
  createHexFilaments,
  createVariedOrbitalShards,
  createAccretionDiscGeometry,
  createEnergyRibbons,
} from './rift/geometry.js';

function createEnergyRing(group, radius, tube, color, tiltX, tiltZ, sharedUniforms) {
  const geo = new THREE.TorusGeometry(radius, tube, 16, 128);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: sharedUniforms.uTime,
      uReveal: sharedUniforms.uReveal,
      uColor: { value: new THREE.Color(color) },
    },
    vertexShader: ringVertexShader,
    fragmentShader: ringFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = tiltX;
  mesh.rotation.z = tiltZ;
  group.add(mesh);
  return mesh;
}

export function createRift(scene, tierConfig = { shaderQuality: 1.0 }) {
  const group = new THREE.Group();
  scene.add(group);

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: 0 },
    uReveal: { value: 0 },
    uScroll: { value: 0 },
    uHexMorph: { value: 0 },
    uQuality: { value: tierConfig.shaderQuality ?? 1.0 },
    uKeyLightPos: { value: new THREE.Vector3(-2.8, 3.2, 4.5) },
    uRimLightPos: { value: new THREE.Vector3(2.5, 0, 2.8) },
  };

  const shellMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: shellVertexShader,
    fragmentShader: shellFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const shell = new THREE.Mesh(createPortalShellGeometry(), shellMat);
  group.add(shell);

  const facetMat = new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uReveal: uniforms.uReveal },
    vertexShader: facetVertexShader,
    fragmentShader: facetFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    wireframe: true,
  });
  const facets = new THREE.Mesh(createFacetGeometry(), facetMat);
  group.add(facets);

  const tunnelMat = new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uReveal: uniforms.uReveal },
    vertexShader: tunnelVertexShader,
    fragmentShader: tunnelFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const tunnel = new THREE.Mesh(createTunnelGeometry(), tunnelMat);
  group.add(tunnel);

  const hexFrameMat = new THREE.MeshStandardMaterial({
    color: 0x6e3fff,
    emissive: 0x3b1578,
    emissiveIntensity: 1.2,
    metalness: 0.85,
    roughness: 0.25,
    transparent: true,
    opacity: 0.55,
  });
  const hexFrame = new THREE.Mesh(createHexFrameGeometry(), hexFrameMat);
  group.add(hexFrame);

  const voidCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x010108, transparent: true, opacity: 0.98 })
  );
  voidCore.userData.noBloom = true;
  group.add(voidCore);

  const accretionMat = new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uReveal: uniforms.uReveal },
    vertexShader: accretionVertexShader,
    fragmentShader: accretionFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const accretion = new THREE.Mesh(createAccretionDiscGeometry(), accretionMat);
  accretion.rotation.x = -Math.PI / 2;
  group.add(accretion);

  const filamentMat = new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uReveal: uniforms.uReveal },
    vertexShader: filamentVertexShader,
    fragmentShader: filamentFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const filaments = new THREE.LineSegments(createHexFilaments(), filamentMat);
  group.add(filaments);

  const ribbons = createEnergyRibbons().map((mesh) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: uniforms.uTime,
        uReveal: uniforms.uReveal,
        uRibbonPhase: { value: mesh.userData.phase },
      },
      vertexShader: ribbonVertexShader,
      fragmentShader: ribbonFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    mesh.material = mat;
    group.add(mesh);
    return mesh;
  });

  const ringA = createEnergyRing(group, 1.58, 0.028, 0x9b5cff, Math.PI / 2, 0, uniforms);
  const ringB = createEnergyRing(group, 1.92, 0.016, 0x7c3aed, Math.PI / 2.3, Math.PI / 6, uniforms);
  const ringC = createEnergyRing(group, 2.28, 0.01, 0x6e3fff, Math.PI / 1.8, -Math.PI / 5, uniforms);

  const shards = createVariedOrbitalShards(18, 2.05);
  group.add(shards);

  group.scale.setScalar(0.01);

  let scrollProgress = 0;
  const shardDummy = new THREE.Object3D();

  return {
    group,
    shell,
    hexFrame,
    hexFrameMat,
    uniforms,
    applyEnvMap(envMap) {
      hexFrameMat.envMap = envMap;
      hexFrameMat.envMapIntensity = 0.85;
      hexFrameMat.needsUpdate = true;
    },
    bindLighting(lightUniforms) {
      uniforms.uKeyLightPos = lightUniforms.uKeyLightPos;
      uniforms.uRimLightPos = lightUniforms.uRimLightPos;
    },
    reveal() {
      gsap.to(uniforms.uReveal, { value: 1, duration: 2.4, ease: 'power2.inOut' });
      gsap.to(uniforms.uHexMorph, { value: 1, duration: 2.8, ease: 'power3.out' });
      gsap.to(hexFrameMat, { opacity: 0.75, emissiveIntensity: 2, duration: 2.2, ease: 'power2.out' });
      shards.children.forEach((child) => {
        gsap.to(child.material, { opacity: 0.75, duration: 2.5, ease: 'power2.out' });
      });
    },
    setScrollProgress(progress) {
      scrollProgress = progress;
    },
    update(time, mouseProximity = 0) {
      uniforms.uTime.value = time;
      uniforms.uMouse.value = mouseProximity;

      const reveal = uniforms.uReveal.value;
      const scrollEased = scrollProgress * scrollProgress;
      const scrollScale = THREE.MathUtils.lerp(1, 0.26, scrollEased);
      const pulse =
        1 +
        0.018 * Math.sin(time * 1.2) +
        0.01 * Math.sin(time * 2.3) +
        0.006 * Math.sin(time * 0.55) +
        mouseProximity * 0.012;
      const baseScale = THREE.MathUtils.lerp(0.01, 1, reveal) * scrollScale;

      group.scale.setScalar(baseScale * pulse);
      group.position.y = scrollEased * 1.2;
      uniforms.uScroll.value = scrollEased;

      shell.rotation.y += 0.0016;
      shell.rotation.z += 0.0008;
      facets.rotation.y -= 0.0022;
      facets.rotation.x += 0.001;
      tunnel.rotation.z += 0.0035;
      hexFrame.rotation.y += 0.0012;
      voidCore.rotation.y -= 0.0008;
      accretion.rotation.z += 0.004;

      ringA.rotation.z += 0.0032;
      ringB.rotation.z -= 0.0024;
      ringC.rotation.z += 0.0016;

      ribbons.forEach((ribbon, i) => {
        ribbon.rotation.y += 0.001 * (i + 1);
      });

      shards.children.forEach((instanced) => {
        const orbits = instanced.userData.orbits;
        const speeds = instanced.userData.speeds;
        for (let i = 0; i < instanced.count; i++) {
          const orbit = orbits[i] + time * speeds[i] * 0.15;
          const r = 2.05 + Math.sin(time * 0.8 + i) * 0.12;
          shardDummy.position.set(
            Math.cos(orbit) * r,
            Math.sin(time * 2 + i) * 0.1,
            Math.sin(orbit) * r
          );
          shardDummy.rotation.set(time * speeds[i], time * speeds[i] * 1.3, 0);
          shardDummy.updateMatrix();
          instanced.setMatrixAt(i, shardDummy.matrix);
        }
        instanced.instanceMatrix.needsUpdate = true;
      });
    },
  };
}
