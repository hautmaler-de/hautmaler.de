# Current State

## Project goal

Maintain the static public website for Die Hautmaler in Ottobrunn with clear studio,
portfolio, contact, and legal information.

## Current status

- Default branch: `main`; inspected base commit: `95ea3b8`.
- The site is implemented as static HTML/CSS/JavaScript and currently includes a
  client-side preview gate on all pages.
- The Pages workflow for `95ea3b8` completed successfully on 2026-08-13.
- `https://hautmaler.de/` returned HTTP 200 on 2026-08-13; DNS resolved to GitHub
  Pages and GitHub reported an approved certificate with enforced HTTPS.
- No open GitHub issues were found during this handoff.

## Working

- Responsive main, legal, privacy, and 404 pages.
- Mobile menu and current-year behavior.
- Google Maps is loaded only after explicit interaction.
- GitHub Pages deployment and the custom domain are operational.

## Active work

No implementation workstream is recorded. The deployed site remains in preview
mode pending content/legal confirmation.

## Recently completed

- Removed the contact form and retained direct contact links.
- Corrected experience and portfolio copy in recent content updates.
- Added the former generic root handoff, now migrated to `.agent/`.

## Known issues

- The legal notice still lacks the confirmed full legal name of the operator.
- Privacy text and the public mailbox need confirmation against actual mail handling.
- Address, telephone number, and hours are based on previously public sources and
  need owner confirmation before final release.
- Several portfolio images are low-resolution social-feed crops rather than originals.
- The preview gate is embedded browser code and does not restrict technical access.

## Next recommended tasks

1. Obtain owner confirmation for legal identity, contact details, hours, and mail.
2. Update legal/privacy content from that authoritative input.
3. Remove the client-side preview gate only after public-release approval.

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

2026-08-13: migrated the generic root handoff and README checklist into `.agent/`,
preserved all real launch tasks, and verified Pages/domain status. No business or
legal facts were newly asserted.
