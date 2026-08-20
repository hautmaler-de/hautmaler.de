# Architecture

## Overview

The repository is a static multi-page site hosted by GitHub Pages. It has no backend,
database, server-side authentication, or public runtime framework. A development-only
Node toolchain validates the source and stages an allowlisted static artifact.

## Components

- `index.html`: marketing content, structured metadata, portfolio, and contact.
- `impressum.html`, `datenschutz.html`, `404.html`: secondary pages.
- `styles.css`: shared responsive design and preview presentation.
- `fonts/`: locally served web fonts plus their OFL license and attribution.
- `preview-bootstrap.js`, `script.js`: pre-paint preview state, mobile navigation,
  year, explicit map loading, and accessible gate behavior.
- `img/`, `media-manifest.json`: source media, generated derivatives, dimensions,
  provenance, metadata state, alt text, and external permission state.
- `scripts/`: static server, deployment bundling, image generation, validation,
  Lighthouse, and release-readiness orchestration.
- `tests/`: Playwright behavior, axe accessibility, responsive, and reviewed visual
  regression coverage.
- `docs/`: verification, media, release, and deliberately unimplemented feature
  documentation.

## Data flow and persistence

The browser loads static files. Every HTML document starts visually locked; a local
browser flag remembers whether the preview screen was dismissed and the head script
removes the lock before rendering. This is convenience state only and must not be
treated as authorization. No form submits business or customer data.

## External systems

- GitHub Pages hosts `hautmaler.de`.
- Google Maps is requested only after user interaction.
- Instagram, Facebook, WhatsApp, telephone, and email are outbound actions.

## Deployment

`.github/workflows/quality.yml` runs the complete technical readiness suite for pull
requests and as a reusable workflow. `.github/workflows/pages.yml` calls that workflow
for `main`, builds an explicit `_site/` allowlist, and deploys only that directory.
`CNAME` declares the custom domain.

## Testing

`npm run release:check` orchestrates HTML/JavaScript, link/asset, media, browser E2E,
axe, visual regression, Lighthouse budget, dependency, and public-bundle checks. It
reports external approvals separately and never marks them complete.
