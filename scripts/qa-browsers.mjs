/**
 * Cross-browser smoke: load hero, verify WebGL canvas + no fatal errors.
 * Run: npm run qa:browsers
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { getProjectRoot, runBuild, startPreviewServer } from './lib/qa-server.mjs';

const OUT_DIR = join(getProjectRoot(), 'qa', 'captures', 'browsers');

const BROWSERS = [
  { name: 'chromium', launcher: chromium },
  { name: 'firefox', launcher: firefox },
  { name: 'webkit', launcher: webkit },
];

async function smokeBrowser({ name, launcher }, url) {
  const errors = [];
  const browser = await launcher.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForSelector('#canvas-container canvas', { timeout: 30000 });
    await page.waitForFunction(() => typeof window.__VOID_SHADER_MS === 'number', undefined, {
      timeout: 60000,
    });

    try {
      await page.waitForFunction(() => window.__VOID_QA?.phase === 'intro', undefined, {
        timeout: 30000,
      });
    } catch {
      await page.waitForFunction(
        () => window.__VOID_QA?.phase === 'warmed' || window.__VOID_QA?.phase === 'intro',
        undefined,
        { timeout: 10000 }
      );
    }
    await page.waitForTimeout(2000);

    const metrics = await page.evaluate(() => ({
      tier: window.__VOID_TIER,
      shaderMs: window.__VOID_SHADER_MS,
      phase: window.__VOID_QA?.phase,
    }));

    const shotPath = join(OUT_DIR, `${name}-smoke.png`);
    await page.screenshot({ path: shotPath });

    const shaderErrors = errors.filter((e) => e.includes('Shader Error'));
    const webkitDepthNoise = errors.filter((e) =>
      e.includes('depth stencil attachments') || e.includes('useProgram: program not valid')
    );
    const otherErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('Shader Error') &&
        !e.includes('depth stencil attachments') &&
        !e.includes('useProgram: program not valid')
    );

    const ok = otherErrors.length === 0;

    return {
      name,
      ok,
      metrics,
      shaderErrors: shaderErrors.length,
      webkitDepthNoise: webkitDepthNoise.length,
      otherErrors,
      shotPath,
      warnings: [...shaderErrors.slice(0, 2), ...webkitDepthNoise.slice(0, 2)],
    };
  } finally {
    await context.close();
    await browser.close();
  }
}

async function main() {
  await runBuild();
  await mkdir(OUT_DIR, { recursive: true });

  const server = await startPreviewServer();
  const results = [];

  try {
    for (const browser of BROWSERS) {
      console.log(`\n— ${browser.name} —`);
      try {
        const result = await smokeBrowser(browser, server.url);
        results.push(result);
        console.log(result.ok ? 'PASS' : 'FAIL', result.metrics, result.otherErrors.slice(0, 2));
      } catch (err) {
        results.push({ name: browser.name, ok: false, error: err.message });
        console.log('FAIL', err.message);
      }
    }
  } finally {
    await server.close();
  }

  const reportPath = join(OUT_DIR, 'report.json');
  await writeFile(reportPath, JSON.stringify(results, null, 2));

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.error('\nBrowser smoke failed:', failed.map((f) => f.name).join(', '));
    process.exit(1);
  }

  console.log('\nBrowser smoke passed. Report:', reportPath);
}

main().catch((err) => {
  console.error('Browser smoke failed:', err.message);
  process.exit(1);
});
