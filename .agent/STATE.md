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

## Working

- Responsive main, legal, privacy, and 404 pages.
- Mobile menu and current-year behavior.
- Google Maps is loaded only after explicit interaction.
- GitHub Pages deployment and the custom domain are operational.

## Active work

Quality and release-readiness work was started from the autonomous website audit
request. Only repository/GitHub orientation and a source audit have been completed;
no website, tooling, media, workflow, or public-deployment changes have been made.
Continue from the detailed unchecked items in `.agent/TODO.md`.

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
- There is no automated HTML/link/media/readiness test suite, browser E2E suite,
  accessibility audit, or Lighthouse budget yet.
- Canonical metadata is absent, OpenGraph metadata is incomplete outside the home
  page, and sitemap/preview-aware robots files do not yet exist.
- Image elements do not declare intrinsic dimensions or responsive sources. The
  existing `img/storefront.jpg` contains a non-location EXIF software tag; no GPS
  metadata was found during the initial file inspection.
- Portfolio captions are hover-only and there is no automated keyboard/focus test.
- The preview gate is embedded browser code and does not restrict technical access.

## Next recommended tasks

1. Implement the quality/readiness workstream in `.agent/TODO.md` while preserving
   the preview gate, `noindex`, lazy map loading, and all existing operator facts.
2. Run all static, browser, accessibility, media, link, and performance checks.
3. Update the handoff, push the completed branch, and open a draft pull request.
4. Obtain the external operator confirmations listed in `.agent/TODO.md`; automation
   must continue to report these as blocked rather than completed.

## Relevant files

- `index.html`, `styles.css`, `script.js`
- `impressum.html`, `datenschutz.html`, `404.html`
- `img/`, `README.md`
- `.github/workflows/pages.yml`, `CNAME`

## Validation

- `node --check script.js`
- `git diff --check`
- Local browser preview: `python3 -m http.server 8000`
- Inspect representative mobile and desktop widths for visual changes.

## Last handoff

2026-08-13: created `agent/hautmaler-quality-and-readiness`, verified the clean
base, GitHub/Pages state, local instructions, existing source files, and initial
media metadata. Paused before implementation at the user's request; all remaining
work is recorded in `.agent/TODO.md`.
