export function detectQualityTier() {
  const ua = navigator.userAgent;
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const dpr = window.devicePixelRatio || 1;

  let tier = 'B';
  if (mobile || cores <= 4 || memory <= 4) tier = 'C';
  else if (cores >= 8 && memory >= 8 && dpr >= 1.5) tier = 'A';

  if (typeof window !== 'undefined') {
    window.__VOID_TIER = tier;
  }

  return tier;
}

export const TIER_CONFIG = {
  A: { starCount: 6000, dustCount: 3000, riftCount: 1400, shaderQuality: 1.0, postFx: 'full' },
  B: { starCount: 4200, dustCount: 2100, riftCount: 980, shaderQuality: 0.75, postFx: 'standard' },
  C: { starCount: 2000, dustCount: 900, riftCount: 400, shaderQuality: 0.5, postFx: 'minimal' },
};

export function getTierConfig(tier = detectQualityTier()) {
  return TIER_CONFIG[tier] || TIER_CONFIG.B;
}
