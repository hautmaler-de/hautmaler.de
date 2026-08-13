# Architecture

## Overview

The repository is a static multi-page site hosted directly by GitHub Pages. It has
no backend, build process, database, or server-side authentication.

## Components

- `index.html`: marketing content, structured metadata, portfolio, and contact.
- `impressum.html`, `datenschutz.html`, `404.html`: secondary pages.
- `styles.css`: shared responsive design and preview presentation.
- `script.js`: mobile navigation, year, explicit map loading, and preview gate.
- `img/`: logo, storefront, artist, and portfolio media.

## Data flow and persistence

The browser loads static files. A local browser flag remembers whether the preview
screen was dismissed. This is convenience state only and must not be treated as
authorization. No form submits business or customer data.

## External systems

- GitHub Pages hosts `hautmaler.de`.
- Google Maps is requested only after user interaction.
- Instagram, Facebook, WhatsApp, telephone, and email are outbound actions.

## Deployment

`.github/workflows/pages.yml` deploys the repository root from `main`; `CNAME`
declares the custom domain.

## Testing

Use JavaScript syntax checks, link/asset checks, and browser review at mobile and
desktop sizes. There is no automated application test suite.
