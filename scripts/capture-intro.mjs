/**
 * Capture hero intro frames at T=0s, 1s, 3s, 5s (from intro start).
 * Run: npm run qa:capture
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { getProjectRoot, runBuild, startPreviewServer } from './lib/qa-server.mjs';

const MARKS = [0, 1000, 3000, 5000];
const OUT_DIR = join(getProjectRoot(), 'qa', 'captures', 'intro');

async function waitForIntro(page) {
  await page.waitForFunction(() => window.__VOID_QA?.phase === 'intro', undefined, {
    timeout: 30000,
  });
}

async function waitUntilElapsed(page, targetMs) {
  await page.waitForFunction((ms) => performance.now() - (window.__VOID_QA?.introStartMs ?? 0) >= ms, targetMs, {
    timeout: 30000,
  });
}

function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

async function main() {
  const browserName = process.env.QA_BROWSER || 'chromium';
  if (browserName !== 'chromium') {
    console.warn('Intro capture uses chromium for consistency.');
  }

  await runBuild();
  await mkdir(OUT_DIR, { recursive: true });

  const server = await startPreviewServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);

  try {
    await page.goto(server.url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#canvas-container canvas', { timeout: 30000 });
    await page.waitForFunction(() => typeof window.__VOID_SHADER_MS === 'number', undefined, {
      timeout: 30000,
    });
    await waitForIntro(page);

    for (const mark of MARKS) {
      if (mark > 0) await waitUntilElapsed(page, mark);
      await page.waitForTimeout(120);
      const path = join(OUT_DIR, `intro-t${mark / 1000}s.png`);
      await page.screenshot({ path, fullPage: false });
      console.log('saved', path);
    }

    const shaderMs = await page.evaluate(() => window.__VOID_SHADER_MS);
    console.log(`shader compile: ${shaderMs}ms`);

    const critical = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('Shader Error')
    );
    if (critical.length) {
      console.warn('Console errors:', critical.slice(0, 5));
    }
  } finally {
    await context.close();
    await browser.close();
    await server.close();
  }

  console.log('\nIntro capture complete:', OUT_DIR);
}

main().catch((err) => {
  console.error('Intro capture failed:', err.message);
  process.exit(1);
});
