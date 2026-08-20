# Decisions

## 2026-08-11 - Static GitHub Pages delivery

**Decision:** Keep the site in plain HTML, CSS, and JavaScript and deploy the
repository root from `main` through GitHub Pages.

**Reason:** The site stays fast and maintainable without a build toolchain.

**Consequences:** Browser checks and JavaScript syntax validation are the primary
technical validation path.

## 2026-08-11 - Explicit map loading

**Decision:** Create the Google Maps iframe only after the visitor selects the map
load action.

**Reason:** Avoid contacting Google merely by opening the page.

**Consequences:** Preserve this boundary unless content and privacy documentation
are deliberately updated together.

## 2026-08-13 - Repository task authority

**Decision:** `.agent/TODO.md` replaces both the generic root handoff and README
checklist as the only maintenance task source.

**Reason:** Launch tasks must not drift across multiple files.

## 2026-08-13 - Static site with development-only quality tooling

**Decision:** Keep the delivered site in plain HTML, CSS, and JavaScript. Use pinned
Node dependencies only for tests, media derivatives, readiness reporting, and the
deployment bundle.

**Reason:** Browser-level verification and deterministic media processing are needed
without introducing a public runtime framework.

**Consequences:** `npm run release:check` is the technical authority. `node_modules/`
and all development files remain outside the Pages artifact.

## 2026-08-13 - Allowlisted Pages artifact

**Decision:** Build `_site/` from an explicit list of public files and make Pages wait
for the reusable quality workflow instead of uploading the repository root.

**Reason:** Tests, handoff records, rights manifests, and development tooling should
not become public web content merely because they are versioned.

**Consequences:** New public assets must be deliberately added to `scripts/build-site.mjs`.

## 2026-08-13 - Preview crawl policy

**Decision:** Let crawlers fetch pages through `robots.txt` while every page declares
`noindex, nofollow`.

**Reason:** Blocking crawling would prevent compliant crawlers from observing the
page-level noindex directive.

**Consequences:** The preview gate remains presentation only and must not be treated
as confidentiality. Removing `noindex` still requires explicit approval.

## 2026-08-13 - Conservative image derivatives

**Decision:** Generate AVIF/WebP only from suitable existing sources, never upscale,
retain the original format as fallback, and keep low-resolution social crops marked
for replacement instead of manufacturing larger files.

**Reason:** Responsive delivery must not misrepresent source quality or media rights.

**Consequences:** Every used media file and derivative is tracked in
`media-manifest.json`; all permission states remain externally pending.

## 2026-08-13 - Self-hosted deterministic web fonts

**Decision:** Serve the intended Latin subsets of Inter and DM Mono locally alongside
the existing Cinzel Decorative font, with license and attribution files committed.

**Reason:** Layout, responsive overflow checks, and visual baselines must not depend
on host-installed fallback fonts, and opening the site must not contact a font CDN.

**Consequences:** Font changes require license review, Lighthouse-budget review, and
intentional regeneration plus visual inspection of affected Playwright baselines.
