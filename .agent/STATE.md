# Current State

## Project goal

Maintain the static public website for Die Hautmaler in Ottobrunn with clear studio,
portfolio, contact, and legal information.

## Current status

- Default branch: `main`; current quality/readiness branch:
  `agent/hautmaler-quality-and-readiness`, based on commit `0c17b5e`.
- Pull request: <https://github.com/hautmaler-de/hautmaler.de/pull/1>.
- The site is implemented as static HTML/CSS/JavaScript and currently includes a
  client-side preview gate on all pages.
- GitHub Pages uses the repository workflow on `main`, the custom domain is public,
  and GitHub reported an approved certificate with enforced HTTPS on 2026-08-13.
- The quality/readiness implementation is committed and pushed. The full local
  `npm run release:check` suite and remote `Website quality / verify` run
  `31727449740` passed on 2026-08-13 at commit `af416bb`.
- A user-supplied 941×1672 Foo Dog full-back portfolio photo was added on 2026-08-20
  with metadata-free JPEG, AVIF, and WebP files. The updated release suite passes and
  the user authorized publishing the preview build with its PIN and `noindex` intact.

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
- Locally served Inter, DM Mono, and Cinzel Decorative web fonts with OFL attribution;
  browser tests no longer depend on runner-installed font metrics or font CDNs.
- Versioned media provenance, external release gates, verification documentation,
  browser/axe/visual/Lighthouse tests, dependency audit, and static invariant checks.
- Pull-request CI is reusable by Pages, and deployment stages only allowlisted public
  files in `_site/` after quality checks pass.
- GitHub Pages deployment and the custom domain are operational.

## Active work

The new full-back portfolio image and its responsive derivatives are complete and
verified. PR #1 is the authorized publication path; the preview gate and `noindex`
remain intentionally intact while the external final-release confirmations stay open.

## Recently completed

- Added the final user-supplied 941×1672 Foo Dog full-back photo as the first portfolio
  item, created 320 px and 640 px AVIF/WebP variants, and refreshed the four homepage
  visual baselines.
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
- The preview gate is embedded browser code and does not restrict technical access.

## Next recommended tasks

1. Obtain the external operator confirmations listed in `.agent/TODO.md`; automation
   must continue to report these as blocked rather than completed.
2. Replace the low-resolution social-feed crops when approved originals are supplied.
3. Review the approved release candidate on physical iOS and Android devices.

## Relevant files

- `index.html`, `styles.css`, `script.js`
- `impressum.html`, `datenschutz.html`, `404.html`
- `img/`, `README.md`
- `package.json`, `scripts/`, `tests/`, `media-manifest.json`, `release-gates.json`
- `docs/`, `.github/workflows/quality.yml`, `.github/workflows/pages.yml`, `CNAME`

## Validation

- `npm run release:check` passed on 2026-08-20 after the portfolio addition.
- GitHub Actions run `31727449740` passed on 2026-08-13 for commit `af416bb`.
- 24 Chromium E2E/axe/visual tests passed at 320, 390, 768, and 1440 px.
- Lighthouse passed all four pages with 1.00 performance, accessibility, and best
  practices in the local desktop run; all budgets passed.
- Media validation covered 43 source/derivative files; no GPS was found and generated
  AVIF/WebP output reproduced byte-for-byte.
- Six external HTTPS link targets returned HTTP 200 during the run.
- npm audit reported zero vulnerabilities.
- `git diff --check` passed.

## Last handoff

2026-08-20: added and fully verified the final user-supplied 941×1672 Foo Dog
full-back portfolio photo, its responsive derivatives, media records, test count,
and visual baselines. The user authorized publication through PR #1 while retaining
the preview gate and `noindex`; the remaining final-release approvals stay external.
