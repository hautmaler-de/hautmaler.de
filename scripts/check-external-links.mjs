import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = ['index.html', 'impressum.html', 'datenschutz.html', '404.html'];
const acceptedRestrictedStatuses = new Set([401, 403, 405, 429]);
const links = new Set();

for (const file of htmlFiles) {
  const html = await readFile(path.join(root, file), 'utf8');
  for (const match of html.matchAll(/<a\b[^>]*\bhref=(['"])(.*?)\1/gi)) {
    const href = match[2].replaceAll('&amp;', '&');
    if (/^https:\/\//i.test(href)) links.add(href);
  }
}

async function request(url, method) {
  return fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(15_000),
    headers: {
      'User-Agent': 'hautmaler-release-check/1.0'
    }
  });
}

async function check(url) {
  let response = await request(url, 'HEAD');
  if ([405, 501].includes(response.status)) response = await request(url, 'GET');
  const ok = response.ok
    || (response.status >= 300 && response.status < 400)
    || acceptedRestrictedStatuses.has(response.status);
  return { url, status: response.status, ok };
}

const results = await Promise.all([...links].sort().map(async (url) => {
  try {
    return await check(url);
  } catch (error) {
    return { url, status: 'network-error', ok: false, error: error.message };
  }
}));

for (const result of results) {
  const marker = result.ok ? 'PASS' : 'FAIL';
  console.log(`${marker} ${result.status} ${result.url}`);
}

if (results.some((result) => !result.ok)) process.exit(1);
console.log(`External links: ${results.length} endpoints reachable.`);
