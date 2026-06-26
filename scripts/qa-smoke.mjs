/**
 * Lightweight hero QA smoke checks (no browser required).
 * Run: node scripts/qa-smoke.mjs
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, shell: true, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

const checks = [];

async function main() {
  await run('npm', ['run', 'build']);
  checks.push('build');

  const required = [
    'dist/index.html',
    'src/webgl/post/dof.js',
    'src/webgl/rift/lod.js',
    'src/webgl/rift/shaders/index.js',
  ];

  for (const file of required) {
    if (!existsSync(join(root, file))) {
      throw new Error(`Missing ${file}`);
    }
    checks.push(file);
  }

  const { createDofEffect } = await import(pathToFileURL(join(root, 'src/webgl/post/dof.js')).href);
  const { PerspectiveCamera } = await import('three');
  createDofEffect(new PerspectiveCamera(60, 1, 0.1, 1000), { postFx: 'full' });
  checks.push('dof-import');

  console.log('\nQA smoke passed:', checks.length, 'checks');
}

main().catch((err) => {
  console.error('\nQA smoke failed:', err.message);
  process.exit(1);
});
