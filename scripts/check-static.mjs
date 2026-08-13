import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  { file: 'index.html', canonical: 'https://hautmaler.de/', structuredData: true },
  { file: 'impressum.html', canonical: 'https://hautmaler.de/impressum.html' },
  { file: 'datenschutz.html', canonical: 'https://hautmaler.de/datenschutz.html' },
  { file: '404.html', canonical: null, openGraphUrl: 'https://hautmaler.de/404.html' }
];
const failures = [];
const pageContent = new Map();

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function allOpeningTags(html) {
  return [...html.matchAll(/<[a-z][^>]*>/gi)].map((match) => match[0]);
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${escapeRegExp(name)}\\s*=\\s*(['"])(.*?)\\1`, 'i'));
  return match ? match[2] : null;
}

function metaContent(html, key, value) {
  const tag = tags(html, 'meta').find((candidate) => attribute(candidate, key) === value);
  return tag ? attribute(tag, 'content') : null;
}

function internalTarget(fromFile, rawReference) {
  const reference = rawReference.replaceAll('&amp;', '&');
  if (/^(?:https?:|mailto:|tel:|data:)/i.test(reference)) return null;
  const [pathAndQuery, fragment = ''] = reference.split('#', 2);
  const cleanPath = pathAndQuery.split('?', 1)[0];
  let targetFile;
  if (!cleanPath) {
    targetFile = fromFile;
  } else if (cleanPath === '/') {
    targetFile = 'index.html';
  } else if (cleanPath.startsWith('/')) {
    targetFile = decodeURIComponent(cleanPath.slice(1));
  } else {
    targetFile = path.normalize(path.join(path.dirname(fromFile), decodeURIComponent(cleanPath)));
  }
  return { targetFile, fragment: decodeURIComponent(fragment) };
}

function checkInternalReference(fromFile, reference, context) {
  const target = internalTarget(fromFile, reference);
  if (!target) return;
  const absolute = path.resolve(root, target.targetFile);
  const withinRoot = absolute === root || absolute.startsWith(`${root}${path.sep}`);
  assert(withinRoot && existsSync(absolute), `${fromFile}: missing ${context} target ${target.targetFile}`);

  if (target.fragment && target.targetFile.endsWith('.html') && pageContent.has(target.targetFile)) {
    const targetIds = new Set(allOpeningTags(pageContent.get(target.targetFile)).map((tag) => attribute(tag, 'id')).filter(Boolean));
    assert(targetIds.has(target.fragment), `${fromFile}: missing fragment #${target.fragment} in ${target.targetFile}`);
  }
}

for (const page of pages) {
  pageContent.set(page.file, await readFile(path.join(root, page.file), 'utf8'));
}

for (const page of pages) {
  const html = pageContent.get(page.file);
  assert(/^<!doctype html>/i.test(html), `${page.file}: missing HTML doctype`);
  assert(/<html\b[^>]*\blang="de"/i.test(html), `${page.file}: html language must be de`);
  assert(tags(html, 'h1').length === 1, `${page.file}: expected exactly one h1`);

  const description = metaContent(html, 'name', 'description');
  assert(description && description.length >= 40 && description.length <= 180, `${page.file}: missing concise meta description`);
  assert(metaContent(html, 'name', 'robots') === 'noindex, nofollow', `${page.file}: preview robots directive changed`);
  assert(metaContent(html, 'name', 'referrer') === 'no-referrer', `${page.file}: referrer policy must be no-referrer`);

  const canonicalTag = tags(html, 'link').find((tag) => attribute(tag, 'rel') === 'canonical');
  if (page.canonical) {
    assert(attribute(canonicalTag ?? '', 'href') === page.canonical, `${page.file}: canonical URL mismatch`);
  } else {
    assert(!canonicalTag, `${page.file}: an error page must not declare a canonical URL`);
  }

  const expectedOpenGraph = new Map([
    ['og:title', true],
    ['og:description', true],
    ['og:type', 'website'],
    ['og:url', page.openGraphUrl ?? page.canonical],
    ['og:image', 'https://hautmaler.de/img/logo.png'],
    ['og:image:alt', true]
  ]);
  for (const [property, expected] of expectedOpenGraph) {
    const actual = metaContent(html, 'property', property);
    assert(expected === true ? Boolean(actual) : actual === expected, `${page.file}: invalid ${property}`);
  }

  const csp = metaContent(html, 'http-equiv', 'Content-Security-Policy');
  assert(Boolean(csp), `${page.file}: missing Content Security Policy`);
  assert(csp?.includes("default-src 'self'"), `${page.file}: CSP must default to self`);
  assert(csp?.includes("connect-src 'none'"), `${page.file}: CSP must block background connections`);
  assert(csp?.includes('frame-src https://www.google.com'), `${page.file}: CSP must limit map frames to Google`);
  assert(!csp?.includes("'unsafe-inline'") && !csp?.includes("'unsafe-eval'"), `${page.file}: CSP must not allow unsafe scripts`);

  const executableInlineScripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)];
  assert(executableInlineScripts.length === 0, `${page.file}: executable inline script found`);

  assert(/<script\b[^>]*\bsrc="preview-bootstrap\.js"[^>]*><\/script>/i.test(html), `${page.file}: preview bootstrap missing`);
  assert(/<script\b[^>]*\bsrc="script\.js"[^>]*><\/script>/i.test(html), `${page.file}: shared behavior script missing`);
  assert(/<html\b[^>]*class="[^"]*preview-locked/i.test(html), `${page.file}: preview lock must work before JavaScript`);
  assert(/class="preview-gate"/.test(html), `${page.file}: preview gate markup missing`);

  const ids = allOpeningTags(html).map((tag) => attribute(tag, 'id')).filter(Boolean);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert(duplicateIds.length === 0, `${page.file}: duplicate IDs ${[...new Set(duplicateIds)].join(', ')}`);

  for (const anchor of tags(html, 'a')) {
    const href = attribute(anchor, 'href');
    assert(Boolean(href), `${page.file}: anchor without href`);
    if (!href) continue;
    if (/^https:\/\//i.test(href)) {
      const rel = new Set((attribute(anchor, 'rel') ?? '').split(/\s+/).filter(Boolean));
      assert(rel.has('noreferrer'), `${page.file}: external link must suppress referrer: ${href}`);
      if (attribute(anchor, 'target') === '_blank') {
        assert(rel.has('noopener'), `${page.file}: target=_blank link must use noopener: ${href}`);
      }
    } else {
      checkInternalReference(page.file, href, 'link');
    }
  }

  for (const image of tags(html, 'img')) {
    const source = attribute(image, 'src');
    assert(Boolean(source), `${page.file}: image without src`);
    assert(attribute(image, 'alt') !== null, `${page.file}: image without alt`);
    assert(/^\d+$/.test(attribute(image, 'width') ?? ''), `${page.file}: image without numeric width: ${source}`);
    assert(/^\d+$/.test(attribute(image, 'height') ?? ''), `${page.file}: image without numeric height: ${source}`);
    if (source) checkInternalReference(page.file, source, 'image');
    if (source && /(?:work-|phil|storefront)/.test(source)) {
      assert(attribute(image, 'loading') === 'lazy', `${page.file}: below-fold image must be lazy: ${source}`);
    }
  }

  for (const source of tags(html, 'source')) {
    const srcset = attribute(source, 'srcset') ?? '';
    for (const candidate of srcset.split(',')) {
      const reference = candidate.trim().split(/\s+/, 1)[0];
      if (reference) checkInternalReference(page.file, reference, 'responsive image');
    }
  }

  for (const script of tags(html, 'script')) {
    const source = attribute(script, 'src');
    if (source) checkInternalReference(page.file, source, 'script');
  }
  for (const link of tags(html, 'link')) {
    const relation = attribute(link, 'rel') ?? '';
    const href = attribute(link, 'href');
    if (href && /(?:stylesheet|icon)/.test(relation)) checkInternalReference(page.file, href, 'linked asset');
  }

  assert(!/<(?:script|img|iframe|source)\b[^>]*(?:src|srcset)="https?:\/\//i.test(html), `${page.file}: unexpected third-party active resource`);
  assert(!/\son[a-z]+\s*=/i.test(html), `${page.file}: inline event handler found`);
  assert(!/<iframe\b/i.test(html), `${page.file}: map iframe must not exist before interaction`);
}

const indexHtml = pageContent.get('index.html');
const structuredScripts = [...indexHtml.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
assert(structuredScripts.length === 1, 'index.html: expected exactly one JSON-LD block');
if (structuredScripts.length === 1) {
  try {
    const data = JSON.parse(structuredScripts[0][1]);
    assert(data['@type'] === 'TattooParlor', 'index.html: JSON-LD type must remain TattooParlor');
    assert(Boolean(data.name && data.url && data.address), 'index.html: JSON-LD core fields missing');
  } catch {
    failures.push('index.html: invalid JSON-LD');
  }
}

const currentYear = String(new Date().getFullYear());
assert(indexHtml.includes(`<span id="year">${currentYear}</span>`), 'index.html: fallback copyright year is stale');
assert(indexHtml.includes('href="impressum.html"') && indexHtml.includes('href="datenschutz.html"'), 'index.html: legal footer links missing');

const css = await readFile(path.join(root, 'styles.css'), 'utf8');
for (const match of css.matchAll(/url\((['"]?)(.*?)\1\)/gi)) {
  checkInternalReference('styles.css', match[2], 'CSS asset');
}
assert(!/url\((['"]?)https?:\/\//i.test(css), 'styles.css: unexpected third-party request');
assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'styles.css: reduced-motion handling missing');

const script = await readFile(path.join(root, 'script.js'), 'utf8');
assert(!script.includes('innerHTML'), 'script.js: innerHTML is forbidden');
assert(script.includes("addEventListener('click'"), 'script.js: map must require explicit interaction');
assert(script.includes("referrerPolicy = 'no-referrer'"), 'script.js: map iframe must suppress referrer data');
assert(script.includes('replaceChildren(iframe)'), 'script.js: map placeholder must be replaced safely');

const previewBootstrap = await readFile(path.join(root, 'preview-bootstrap.js'), 'utf8');
assert(previewBootstrap.includes("['127.0.0.1', 'localhost'].includes(location.hostname)"), 'preview-bootstrap.js: technical bypass must be loopback-only');
assert(previewBootstrap.includes("has('technical-preview')"), 'preview-bootstrap.js: local technical bypass missing');

const pinMatch = script.match(/input\.value\s*===\s*(['"])([^'"]+)\1/);
assert(Boolean(pinMatch), 'script.js: preview comparison missing');

async function documentationFiles(directory) {
  if (!existsSync(directory)) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await documentationFiles(target));
    else if (/\.(?:md|ya?ml|log|txt)$/i.test(entry.name)) result.push(target);
  }
  return result;
}

if (pinMatch) {
  const sensitiveValue = pinMatch[2];
  const candidates = [
    path.join(root, 'README.md'),
    ...await documentationFiles(path.join(root, '.agent')),
    ...await documentationFiles(path.join(root, '.github')),
    ...await documentationFiles(path.join(root, 'docs'))
  ];
  const escaped = escapeRegExp(sensitiveValue);
  const valuePattern = new RegExp(`(^|\\D)${escaped}(\\D|$)`);
  for (const file of candidates) {
    const content = await readFile(file, 'utf8');
    const riskyLine = content.split(/\r?\n/).find((line) => /pin|preview|gate|vorschau/i.test(line) && valuePattern.test(line));
    assert(!riskyLine, `${path.relative(root, file)}: preview code leaked into documentation`);
  }
}

const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert(/^User-agent: \*$/m.test(robots) && /^Allow: \/$/m.test(robots), 'robots.txt: crawlers must reach page-level noindex directives');
assert(robots.includes('Sitemap: https://hautmaler.de/sitemap.xml'), 'robots.txt: sitemap declaration missing');

const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const page of pages.filter((item) => item.file !== '404.html')) {
  assert(sitemap.includes(`<loc>${page.canonical}</loc>`), `sitemap.xml: missing ${page.canonical}`);
}
assert(!sitemap.includes('/404.html'), 'sitemap.xml: 404 page must not be listed');

const releaseGates = JSON.parse(await readFile(path.join(root, 'release-gates.json'), 'utf8'));
assert(releaseGates.gates.length === 10, 'release-gates.json: expected ten external approvals');
assert(releaseGates.gates.every((gate) => gate.status === 'pending-external'), 'release-gates.json: automation cannot complete external approvals');

const qualityWorkflow = await readFile(path.join(root, '.github', 'workflows', 'quality.yml'), 'utf8');
assert(Boolean(parseYaml(qualityWorkflow)?.jobs?.verify), 'quality.yml: valid verify job missing');
assert(/pull_request:/m.test(qualityWorkflow), 'quality.yml: pull-request trigger missing');
assert(/workflow_call:/m.test(qualityWorkflow), 'quality.yml: reusable workflow trigger missing');
assert(/npm run release:check/.test(qualityWorkflow), 'quality.yml: release-readiness command missing');

const pagesWorkflow = await readFile(path.join(root, '.github', 'workflows', 'pages.yml'), 'utf8');
assert(Boolean(parseYaml(pagesWorkflow)?.jobs?.deploy), 'pages.yml: valid deploy job missing');
assert(/needs: quality/.test(pagesWorkflow), 'pages.yml: deployment must wait for quality checks');
assert(/path: _site/.test(pagesWorkflow), 'pages.yml: deployment must use the allowlisted bundle');
assert(!/path: \.$/m.test(pagesWorkflow), 'pages.yml: repository root must not be published');

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log(`Static readiness: ${pages.length} pages and all repository invariants passed.`);
