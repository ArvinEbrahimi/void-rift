/** Safari / WebKit — DepthOfFieldEffect can hit depth attachment limits. */
export function isWebKit() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /AppleWebKit/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);
}
