# Verification matrix

This matrix separates reproducible technical evidence from decisions that require
the studio operator or another authorized reviewer. The preview gate and
`noindex, nofollow` remain mandatory until explicit public-release approval.

## Automated technical verification

| Area | Automated evidence | Current result |
|---|---|---|
| HTML structure | `npm run check:html` validates all four pages with HTML Validate. | Pass |
| JavaScript syntax | `npm run check:js` checks every repository JavaScript module with Node. | Pass |
| Internal links, fragments, IDs, and assets | `npm run check:static` resolves internal references and rejects duplicate IDs or missing files. | Pass |
| External links | `npm run check:external` checks the six current HTTPS destinations with bounded timeouts. | Pass on 2026-08-13; network-dependent |
| Metadata and structured data | Static checks validate descriptions, canonicals on indexable page types, OpenGraph fields, preview robots metadata, and the `TattooParlor` JSON-LD block. | Pass |
| Preview boundary | Static and Playwright checks require the gate markup, a pre-JavaScript lock on every page, and `noindex, nofollow`. A no-JavaScript browser test confirms that page content remains visually hidden. | Pass; presentation only, not access control |
| Preview value leakage | The static check derives the implementation value without printing it and rejects copies in README, `.agent/`, `docs/`, workflow files, text files, or logs. | Pass |
| Google Maps consent | Static checks reject a pre-rendered iframe. Playwright observes no third-party request before the button is selected and only then permits the Google Maps frame. | Pass |
| Third-party requests | Playwright records runtime requests before map consent; static checks reject remote active resources in HTML and CSS. | Pass |
| External-link safety | Static checks require `noreferrer` on HTTPS links and `noopener` on every new-tab link. | Pass |
| Content Security Policy | Every page limits active content to local files, blocks background connections and objects, and permits Google only as a frame destination. | Pass |
| Mobile navigation | Playwright covers 320 px and 390 px, Escape handling, focus return, state synchronization, and horizontal overflow. | Pass |
| Responsive layout | Playwright covers 320 px, 390 px, 768 px, and 1440 px. | Pass |
| Accessibility | axe runs on the locked gate and every unlocked page; keyboard, focus, semantic portfolio-list, live error, skip-link, and reduced-motion behavior have dedicated assertions. | Pass, zero axe violations |
| Images and provenance | `npm run check:media` requires manifest coverage, intrinsic dimensions, alt-text agreement, no GPS, no upscaling, metadata-free generated files, and byte-reproducible derivatives. | Pass, 38 files |
| Visual regression | Eight reviewed Chromium baselines cover the four representative home-page sizes, preview gate, legal notice, privacy page, and 404 page. | Pass |
| Lighthouse budgets | Desktop Lighthouse checks the fully unlocked local pages for accessibility, best practices, resource/timing budgets, and performance observations. | Pass; all category scores were 1.00 on 2026-08-13 |
| Current year | Static and browser checks compare the fallback/runtime year with the current system year. | Pass |
| 404 | The local server returns HTTP 404 with the custom page; browser and visual tests verify its content. | Pass |
| Legal links | Static and browser checks verify the home-page footer and reciprocal legal-page navigation. | Pass |
| Public bundle | `npm run build:site` stages an allowlisted `_site/` directory and excludes source-control, tests, docs, manifests, and development dependencies. | Pass |
| Dependencies | `npm run check:dependencies` runs npm's moderate-or-higher vulnerability audit. | Pass, zero reported vulnerabilities on 2026-08-13 |
| CI | `.github/workflows/quality.yml` runs the release check for pull requests and as a reusable workflow; Pages deployment depends on it. | Configured; remote run pending branch push |

Run the complete local technical suite with `npm run release:check`. Its exit code
represents technical checks only. It always prints every external gate as blocked;
automation cannot approve those gates.

## Manual or external verification

The following items deliberately have no automated pass state:

- full legal name and legal form of the operator;
- actual mail infrastructure and public mailbox;
- address, telephone number, and opening hours;
- legal review of the legal notice and privacy notice;
- content, claim, trademark, photo, photographer, and person/customer approvals;
- delivery of approved original images;
- physical iOS and Android testing;
- explicit approval to remove the presentation gate and `noindex`.

The time-dependent public claims about recommendation rate and Google review count
also require owner confirmation before release. Automated link availability does not
validate those claims.
