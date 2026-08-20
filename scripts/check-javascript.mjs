import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set([
  '.git',
  '.lighthouseci',
  'node_modules',
  'playwright-report',
  'test-results'
]);

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      files.push(...await collect(path.join(directory, entry.name)));
    } else if (entry.isFile() && /\.(?:c|m)?js$/.test(entry.name)) {
      files.push(path.join(directory, entry.name));
    }
  }
  return files;
}

const files = (await collect(root)).sort();
let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    cwd: root,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout);
  }
}

if (failed) process.exit(1);
console.log(`JavaScript syntax: ${files.length} files passed.`);
