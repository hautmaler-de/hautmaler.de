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
