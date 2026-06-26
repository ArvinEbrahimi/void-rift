import noiseGlsl from './noise.glsl?raw';
import shellVert from './shell.vert.glsl?raw';
import shellFrag from './shell.frag.glsl?raw';
import facetVert from './facet.vert.glsl?raw';
import facetFrag from './facet.frag.glsl?raw';
import tunnelVert from './tunnel.vert.glsl?raw';
import tunnelFrag from './tunnel.frag.glsl?raw';
import ringVert from './ring.vert.glsl?raw';
import ringFrag from './ring.frag.glsl?raw';
import filamentVert from './filament.vert.glsl?raw';
import filamentFrag from './filament.frag.glsl?raw';
import accretionVert from './accretion.vert.glsl?raw';
import accretionFrag from './accretion.frag.glsl?raw';
import ribbonVert from './ribbon.vert.glsl?raw';
import ribbonFrag from './ribbon.frag.glsl?raw';
import shardVert from './shard.vert.glsl?raw';
import shardFrag from './shard.frag.glsl?raw';

function withNoise(source) {
  return source.replace('// __NOISE__', noiseGlsl);
}

export const NOISE_GLSL = noiseGlsl;

export const shellVertexShader = withNoise(shellVert);
export const shellFragmentShader = withNoise(shellFrag);
export const facetVertexShader = facetVert;
export const facetFragmentShader = facetFrag;
export const tunnelVertexShader = tunnelVert;
export const tunnelFragmentShader = withNoise(tunnelFrag);
export const ringVertexShader = ringVert;
export const ringFragmentShader = ringFrag;
export const filamentVertexShader = filamentVert;
export const filamentFragmentShader = filamentFrag;
export const accretionVertexShader = accretionVert;
export const accretionFragmentShader = accretionFrag;
export const ribbonVertexShader = ribbonVert;
export const ribbonFragmentShader = ribbonFrag;
export const shardVertexShader = shardVert;
export const shardFragmentShader = shardFrag;
