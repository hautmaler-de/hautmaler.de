import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const technicalChecks = [
  ['Public deployment bundle', 'build:site'],
  ['HTML structure', 'check:html'],
  ['JavaScript syntax', 'check:js'],
  ['Static invariants and internal links', 'check:static'],
  ['Media manifest and derivatives', 'check:media'],
  ['External links', 'check:external'],
  ['Browser E2E and accessibility', 'test:e2e'],
  ['Lighthouse budgets', 'check:lighthouse'],
  ['Dependency audit', 'check:dependencies']
];

let technicalFailure = false;
console.log('\nTechnical readiness');

for (const [label, script] of technicalChecks) {
  console.log(`\n[RUN] ${label}`);
  const result = spawnSync('npm', ['run', '--silent', script], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit'
  });
  if (result.status === 0) {
    console.log(`[PASS] ${label}`);
  } else {
    technicalFailure = true;
    console.error(`[FAIL] ${label}`);
  }
}

const gatePath = path.join(root, 'release-gates.json');
const gateData = JSON.parse(await readFile(gatePath, 'utf8'));
if (!Array.isArray(gateData.gates) || gateData.gates.length === 0) {
  throw new Error('release-gates.json must contain external release gates.');
}

console.log('\nExternal approvals (never completed by automation)');
for (const gate of gateData.gates) {
  if (gate.status !== 'pending-external') {
    throw new Error(`External gate ${gate.id} must remain pending-external.`);
  }
  console.log(`[BLOCKED] ${gate.label}`);
}

console.log('\nPublic release remains blocked until every external approval is confirmed by an authorized person.');
if (technicalFailure) process.exit(1);
console.log('Technical readiness: PASS');
