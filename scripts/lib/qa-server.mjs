import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function getProjectRoot() {
  return root;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

/**
 * Starts `vite preview` on a random port and waits until it responds.
 */
export async function startPreviewServer() {
  const port = await getFreePort();
  const url = `http://127.0.0.1:${port}/`;

  const child = spawn('npm', ['run', 'preview', '--', '--port', String(port), '--host', '127.0.0.1'], {
    cwd: root,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview server start timeout')), 30000);
    const onData = (chunk) => {
      const text = chunk.toString();
      if (text.includes('Local:') || text.includes(url)) {
        clearTimeout(timeout);
        child.stdout?.off('data', onData);
        child.stderr?.off('data', onData);
        resolve();
      }
    };
    child.stdout?.on('data', onData);
    child.stderr?.on('data', onData);
    child.on('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Preview server exited with code ${code}`));
    });
  });

  // Give Vite a moment to bind fully.
  await new Promise((r) => setTimeout(r, 400));

  return {
    url,
    port,
    async close() {
      child.kill('SIGTERM');
      await new Promise((r) => setTimeout(r, 300));
    },
  };
}

export async function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build'], { cwd: root, shell: true, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`build failed: ${code}`))));
  });
}
