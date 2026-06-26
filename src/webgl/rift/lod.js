import * as THREE from 'three';
import {
  createPortalShellGeometryLOD,
  createTunnelGeometryLOD,
  createRiftImpostorGeometry,
} from './geometry.js';

const LOD_NAMES = ['near', 'mid', 'far'];

/**
 * Distance + scroll driven LOD for the rift assembly.
 * Far: impostor shell + simplified shader; near: full layer stack.
 */
export function createRiftLodController({ camera, parts, uniforms, tierConfig }) {
  const shellGeoFull = parts.shell.geometry;
  const shellGeoMid = createPortalShellGeometryLOD();
  const shellGeoFar = createRiftImpostorGeometry();
  const tunnelGeoFull = parts.tunnel.geometry;
  const tunnelGeoLod = createTunnelGeometryLOD();

  const detailLayers = [
    parts.facets,
    parts.filaments,
    parts.accretion,
    parts.ringB,
    parts.ringC,
    ...parts.ribbons,
    parts.shards,
  ];

  const midHideLayers = [parts.ringC, ...parts.ribbons];

  let currentLod = -1;
  const worldPos = new THREE.Vector3();

  function setVisible(objects, visible) {
    objects.forEach((obj) => {
      if (obj) obj.visible = visible;
    });
  }

  function applyLod(level) {
    if (level === currentLod) return;
    currentLod = level;

    const tierQuality = tierConfig.shaderQuality ?? 1.0;

    if (level >= 2) {
      parts.shell.geometry = shellGeoFar;
      parts.tunnel.visible = false;
      setVisible(detailLayers, false);
      parts.ringA.visible = true;
      parts.tunnel.geometry = tunnelGeoLod;
      uniforms.uQuality.value = tierQuality * 0.35;
      uniforms.uLod.value = 2;
    } else if (level === 1) {
      parts.shell.geometry = shellGeoMid;
      parts.tunnel.geometry = tunnelGeoLod;
      parts.tunnel.visible = true;
      setVisible(detailLayers, true);
      setVisible(midHideLayers, false);
      parts.ringA.visible = true;
      parts.ringB.visible = true;
      uniforms.uQuality.value = tierQuality * 0.65;
      uniforms.uLod.value = 1;
    } else {
      parts.shell.geometry = shellGeoFull;
      parts.tunnel.geometry = tunnelGeoFull;
      parts.tunnel.visible = true;
      setVisible(detailLayers, true);
      uniforms.uQuality.value = tierQuality;
      uniforms.uLod.value = 0;
    }

    if (typeof window !== 'undefined') {
      window.__VOID_LOD = LOD_NAMES[level] || 'near';
    }
  }

  return {
    update(scrollProgress = 0) {
      parts.group.getWorldPosition(worldPos);
      const dist = camera.position.distanceTo(worldPos);
      const scale = parts.group.scale.x;
      const apparent = (scale / Math.max(dist, 0.5)) * uniforms.uReveal.value;

      let level = 0;
      if (apparent < 0.11 || scrollProgress > 0.74) level = 2;
      else if (apparent < 0.3 || scrollProgress > 0.4) level = 1;

      if (tierConfig.postFx === 'minimal') {
        level = Math.max(level, 1);
      }

      applyLod(level);
    },
    getLevel() {
      return currentLod;
    },
    getLevelName() {
      return LOD_NAMES[currentLod] || 'near';
    },
  };
}
