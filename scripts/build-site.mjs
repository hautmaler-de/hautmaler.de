import { cp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '_site');
const publicEntries = [
  '404.html',
  'CNAME',
  'apple-touch-icon.png',
  'datenschutz.html',
  'favicon.ico',
  'favicon.svg',
  'fonts',
  'img',
  'impressum.html',
  'index.html',
  'preview-bootstrap.js',
  'robots.txt',
  'script.js',
  'sitemap.xml',
  'styles.css'
];
const forbiddenTopLevelEntries = new Set([
  '.agent',
  '.git',
  '.github',
  'docs',
  'media-manifest.json',
  'node_modules',
  'package-lock.json',
  'package.json',
  'release-gates.json',
  'scripts',
  'tests'
]);

if (path.basename(output) !== '_site' || path.dirname(output) !== root) {
  throw new Error('Refusing to clean an unexpected deployment output path.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output);

for (const entry of publicEntries) {
  await cp(path.join(root, entry), path.join(output, entry), {
    recursive: true,
    errorOnExist: true
  });
}

const outputEntries = await readdir(output);
for (const entry of outputEntries) {
  if (forbiddenTopLevelEntries.has(entry)) {
    throw new Error(`Private development entry copied into the deployment bundle: ${entry}`);
  }
}

for (const page of ['index.html', 'impressum.html', 'datenschutz.html', '404.html']) {
  const html = await readFile(path.join(output, page), 'utf8');
  if (!html.includes('noindex, nofollow') || !html.includes('preview-gate')) {
    throw new Error(`${page} lost its preview boundary in the deployment bundle.`);
  }
}

console.log(`Deployment bundle: ${publicEntries.length} public entries staged in _site/.`);
