# Current State

## Project goal

Maintain the static public website for Die Hautmaler in Ottobrunn with clear studio,
portfolio, contact, and legal information.

## Current status

- Default branch: `main`; current quality/readiness branch:
  `agent/hautmaler-quality-and-readiness`, based on commit `0c17b5e`.
- The site is implemented as static HTML/CSS/JavaScript and currently includes a
  client-side preview gate on all pages.
- GitHub Pages uses the repository workflow on `main`, the custom domain is public,
  and GitHub reported an approved certificate with enforced HTTPS on 2026-08-13.
- No open GitHub issues or pull requests were found on 2026-08-13.
- The quality/readiness implementation is complete locally. The full
  `npm run release:check` suite passed on 2026-08-13; branch push, remote CI, and a
  draft pull request are the remaining technical handoff actions.

## Working

- Responsive main, legal, privacy, and 404 pages.
- Mobile menu with Escape/focus handling and current-year behavior.
- Accessible static preview dialog on every page, including a visual lock when
  JavaScript is unavailable. It remains presentation only, not authentication.
- Google Maps is loaded only after explicit interaction and uses no referrer.
- Canonical/OpenGraph metadata, structured data, preview-aware robots/sitemap files,
  restrictive static CSP, safe external-link relations, and intrinsic image sizes.
- Responsive AVIF/WebP derivatives for suitable existing sources, with compatible
  fallbacks, no upscaling, and no EXIF/GPS in generated files.
- Versioned media provenance, external release gates, verification documentation,
  browser/axe/visual/Lighthouse tests, dependency audit, and static invariant checks.
- Pull-request CI is reusable by Pages, and deployment stages only allowlisted public
  files in `_site/` after quality checks pass.
- GitHub Pages deployment and the custom domain are operational.

## Active work

Quality and release-readiness implementation and local verification are complete.
Inspect and commit the intended diff, push the branch, open a draft pull request,
then record the PR in this handoff. Do not merge or change the public release state.

## Recently completed

- Replaced the former plain agency mention with the linked footer credit `website
  made by itmitalles.de`.
- Removed the contact form and retained direct contact links.
- Corrected experience and portfolio copy in recent content updates.
- Added the former generic root handoff, now migrated to `.agent/`.

## Known issues

- The legal notice still lacks the confirmed full legal name of the operator.
- Privacy text and the public mailbox need confirmation against actual mail handling.
- Address, telephone number, and hours are based on previously public sources and
  need owner confirmation before final release.
- Several portfolio images are low-resolution social-feed crops rather than originals.
- Rights holders, publication permission, trademark approval, and any required
  person/customer releases are not documented for current media.
- The existing `img/storefront.jpg` fallback retains capture-date and Picasa EXIF;
  all generated derivatives are metadata-free and no deployed image contains GPS.
- Pull-request CI has not run remotely yet because the branch is not pushed.
- The preview gate is embedded browser code and does not restrict technical access.

## Next recommended tasks

1. Commit and push the completed branch and open a draft pull request against `main`.
2. Confirm remote CI is green without merging or triggering a public release.
3. Obtain the external operator confirmations listed in `.agent/TODO.md`; automation
   must continue to report these as blocked rather than completed.

## Relevant files

- `index.html`, `styles.css`, `script.js`
- `impressum.html`, `datenschutz.html`, `404.html`
- `img/`, `README.md`
- `package.json`, `scripts/`, `tests/`, `media-manifest.json`, `release-gates.json`
- `docs/`, `.github/workflows/quality.yml`, `.github/workflows/pages.yml`, `CNAME`

## Validation

- `npm run release:check` passed on 2026-08-13.
- 24 Chromium E2E/axe/visual tests passed at 320, 390, 768, and 1440 px.
- Lighthouse passed all four pages with 1.00 performance, accessibility, and best
  practices in the local desktop run; all budgets passed.
- Media validation covered 38 source/derivative files; no GPS was found and generated
  AVIF/WebP output reproduced byte-for-byte.
- Six external HTTPS link targets returned HTTP 200 during the run.
- npm audit reported zero vulnerabilities.
- `git diff --check` passed.

## Last handoff

2026-08-13: completed the quality/readiness implementation and full local validation
while preserving operator facts, the presentation gate, `noindex`, and explicit map
consent. Publishing the branch and opening the draft PR remain.
