import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledBrowser = chromium.executablePath();
const browserCandidates = [
  bundledBrowser,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
];
const chromePath = browserCandidates.find((candidate) => candidate && existsSync(candidate));

if (!chromePath) {
  throw new Error('No Chromium browser found. Run: npx playwright install chromium');
}

const lighthouseExecutable = path.join(root, 'node_modules', '.bin', 'lighthouse');
const server = spawn(process.execPath, ['scripts/serve.mjs', '4174'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'inherit']
});

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4174/', {
        signal: AbortSignal.timeout(500)
      });
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Timed out while starting the Lighthouse test server.');
}

const pages = ['/', '/impressum.html', '/datenschutz.html', '/404.html'];
let failed = false;

try {
  await waitForServer();
  for (const page of pages) {
    const url = `http://127.0.0.1:4174${page}?technical-preview=1`;
    const result = spawnSync(lighthouseExecutable, [
      url,
      '--quiet',
      '--output=json',
      '--output-path=stdout',
      '--preset=desktop',
      '--only-categories=performance,accessibility,best-practices',
      '--budget-path=lighthouse-budget.json',
      '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage'
    ], {
      cwd: root,
      env: { ...process.env, CHROME_PATH: chromePath },
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024
    });

    if (result.status !== 0) {
      failed = true;
      console.error(`FAIL Lighthouse ${page}`);
      process.stderr.write(result.stderr);
      continue;
    }

    const report = JSON.parse(result.stdout);
    const accessibility = report.categories.accessibility.score;
    const bestPractices = report.categories['best-practices'].score;
    const performance = report.categories.performance.score;
    const budget = report.audits['performance-budget'];
    const budgetsPassed = !budget || budget.score === 1 || budget.score === null;
    const pagePassed = accessibility >= 0.95 && bestPractices >= 0.95 && budgetsPassed;
    failed ||= !pagePassed;
    console.log(
      `${pagePassed ? 'PASS' : 'FAIL'} Lighthouse ${page}: `
      + `performance=${performance.toFixed(2)}, accessibility=${accessibility.toFixed(2)}, `
      + `best-practices=${bestPractices.toFixed(2)}, budgets=${budgetsPassed ? 'pass' : 'fail'}`
    );
  }
} finally {
  server.kill('SIGTERM');
}

if (failed) process.exit(1);
