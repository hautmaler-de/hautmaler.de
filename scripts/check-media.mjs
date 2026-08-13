import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import exifr from 'exifr';
import sharp from 'sharp';
import { generateImages } from './generate-images.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'media-manifest.json'), 'utf8'));
const htmlFiles = ['index.html', 'impressum.html', 'datenschutz.html', '404.html'];
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function hash(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(target));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}

function localImageReference(rawReference) {
  const reference = rawReference.replaceAll('&amp;', '&').split(/[?#]/, 1)[0];
  if (/^https?:\/\//i.test(reference)) {
    const url = new URL(reference);
    return url.hostname === 'hautmaler.de' ? url.pathname.replace(/^\/+/, '') : null;
  }
  if (/^(?:data:|mailto:|tel:)/i.test(reference)) return null;
  return reference.replace(/^\/+/, '');
}

const flattened = new Map();
for (const asset of manifest.assets ?? []) {
  assert(!flattened.has(asset.path), `Duplicate manifest path: ${asset.path}`);
  assert(asset.permissionStatus === 'pending-external', `${asset.path}: permission cannot be approved by automation`);
  assert(['original', 'derivative'].includes(asset.kind), `${asset.path}: invalid original/derivative status`);
  assert(asset.metadata?.gpsRemoved === true, `${asset.path}: GPS removal status must be explicit`);
  assert(Array.isArray(asset.altTexts), `${asset.path}: altTexts must be an array`);
  assert(Boolean(asset.replacementNeeded), `${asset.path}: replacement need must be recorded`);
  flattened.set(asset.path, {
    ...asset,
    width: asset.dimensions?.width,
    height: asset.dimensions?.height,
    exifRemoved: asset.metadata?.exifRemoved,
    gpsRemoved: asset.metadata?.gpsRemoved
  });

  for (const derivative of asset.responsiveDerivatives ?? []) {
    assert(!flattened.has(derivative.path), `Duplicate manifest path: ${derivative.path}`);
    assert(derivative.width <= asset.dimensions.width, `${derivative.path}: derivative width upscales its source`);
    assert(derivative.exifRemoved === true && derivative.gpsRemoved === true, `${derivative.path}: derivative metadata status is unsafe`);
    flattened.set(derivative.path, {
      ...derivative,
      permissionStatus: asset.permissionStatus,
      kind: 'derivative',
      derivativeOf: asset.path,
      altTexts: asset.altTexts
    });
  }
}

const referenced = new Set();
for (const file of htmlFiles) {
  const html = await readFile(path.join(root, file), 'utf8');
  for (const match of html.matchAll(/<(?:img|source|link|meta)\b[^>]*(?:src|srcset|href|content)=(['"])(.*?)\1/gi)) {
    for (const candidate of match[2].split(',')) {
      const value = candidate.trim().split(/\s+/, 1)[0];
      const local = localImageReference(value);
      if (local && /\.(?:avif|ico|jpe?g|png|svg|webp)$/i.test(local)) referenced.add(local);
    }
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    const source = attributes.match(/\bsrc=(['"])(.*?)\1/i)?.[2];
    const alt = attributes.match(/\balt=(['"])(.*?)\1/i)?.[2];
    const local = source ? localImageReference(source) : null;
    if (local && flattened.has(local)) {
      assert(flattened.get(local).altTexts.includes(alt ?? ''), `${file}: alt text is not represented in the manifest for ${local}`);
    }
  }
}

const deployedImages = [
  path.join(root, 'apple-touch-icon.png'),
  path.join(root, 'favicon.ico'),
  path.join(root, 'favicon.svg'),
  ...await filesBelow(path.join(root, 'img'))
].filter((file) => /\.(?:avif|ico|jpe?g|png|svg|webp)$/i.test(file));
const deployedRelative = new Set(deployedImages.map((file) => path.relative(root, file)));

for (const reference of referenced) {
  assert(existsSync(path.join(root, reference)), `Referenced image is missing: ${reference}`);
  assert(flattened.has(reference), `Referenced image is absent from media-manifest.json: ${reference}`);
}
for (const file of deployedRelative) {
  assert(flattened.has(file), `Deployed image is absent from media-manifest.json: ${file}`);
  assert(referenced.has(file), `Unreferenced deployed image: ${file}`);
}
for (const file of flattened.keys()) {
  assert(deployedRelative.has(file), `Manifest image is missing: ${file}`);
}

for (const [relative, record] of flattened) {
  const absolute = path.join(root, relative);
  if (!existsSync(absolute)) continue;

  let metadata;
  if (!relative.endsWith('.ico')) {
    metadata = await sharp(absolute).metadata();
    assert(metadata.width === record.width && metadata.height === record.height, `${relative}: dimensions do not match the manifest`);
    if (record.exifRemoved) {
      assert(!metadata.exif && !metadata.xmp && !metadata.iptc, `${relative}: metadata should have been removed`);
    }
  }

  if (!/\.(?:ico|svg)$/i.test(relative)) {
    let gps;
    try {
      gps = await exifr.gps(absolute);
    } catch (error) {
      if (metadata?.exif || metadata?.xmp || metadata?.iptc) {
        failures.push(`${relative}: GPS inspection failed while metadata blocks are present: ${error.message}`);
      }
    }
    assert(!gps, `${relative}: GPS metadata is present`);
  }
}

const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'hautmaler-media-'));
try {
  await generateImages(temporaryDirectory);
  const generatedFiles = await filesBelow(temporaryDirectory);
  for (const generated of generatedFiles) {
    const relative = path.relative(temporaryDirectory, generated);
    const committed = path.join(root, 'img', 'derived', relative);
    assert(existsSync(committed), `Generated derivative is not committed: img/derived/${relative}`);
    if (existsSync(committed)) {
      const [generatedBytes, committedBytes] = await Promise.all([readFile(generated), readFile(committed)]);
      assert(hash(generatedBytes) === hash(committedBytes), `Generated derivative is stale: img/derived/${relative}`);
    }
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log(`Media readiness: ${flattened.size} source and derivative files passed.`);
