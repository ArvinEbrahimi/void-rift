/**
 * Record hero scroll exit as WebM (mouse drift + scroll to content).
 * Run: npm run qa:record
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { getProjectRoot, runBuild, startPreviewServer } from './lib/qa-server.mjs';

const OUT_DIR = join(getProjectRoot(), 'qa', 'captures', 'recordings');

async function main() {
  await runBuild();
  await mkdir(OUT_DIR, { recursive: true });

  const server = await startPreviewServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: OUT_DIR, size: { width: 1920, height: 1080 } },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  try {
    await page.goto(server.url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('#canvas-container canvas', { timeout: 30000 });
    await page.waitForFunction(() => window.__VOID_QA?.phase === 'intro', undefined, { timeout: 30000 });

    // Let intro + rift reveal play out.
    await page.waitForTimeout(3500);

    const box = { x: 960, y: 480 };
    for (let i = 0; i < 6; i++) {
      await page.mouse.move(box.x + Math.sin(i) * 120, box.y + Math.cos(i * 1.3) * 80);
      await page.waitForTimeout(250);
    }

    // Scroll through hero into content.
    await page.evaluate(async () => {
      const steps = 24;
      for (let i = 0; i <= steps; i++) {
        window.scrollTo({ top: (window.innerHeight * 1.2 * i) / steps, behavior: 'auto' });
        await new Promise((r) => setTimeout(r, 120));
      }
    });

    await page.waitForTimeout(800);
    console.log('Recording saved to', OUT_DIR);
  } finally {
    await context.close();
    await browser.close();
    await server.close();
  }
}

main().catch((err) => {
  console.error('Record failed:', err.message);
  process.exit(1);
});
