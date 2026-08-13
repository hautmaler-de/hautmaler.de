# Release checklist

This checklist distinguishes technically verified state from approvals that only an
authorized person can provide. A green technical command does not authorize public
release.

## Technical readiness

- [x] CI workflow runs the reproducible readiness suite.
- [x] HTML and JavaScript syntax checks pass.
- [x] Internal assets, links, fragment targets, and IDs pass.
- [x] External HTTPS destinations were reachable during the latest verification.
- [x] Browser E2E and axe checks pass.
- [x] 320 px, 390 px, tablet, and desktop layouts pass without horizontal overflow.
- [x] Reviewed visual baselines cover home, gate, legal pages, privacy, and 404.
- [x] Lighthouse category thresholds and resource/timing budgets pass.
- [x] Image references, dimensions, alt text, manifest coverage, metadata, and generated outputs pass.
- [x] Canonical/OpenGraph metadata, structured data, sitemap, and preview robots policy pass.
- [x] Preview gate and `noindex, nofollow` remain on every page.
- [x] Google Maps remains unloaded until explicit interaction.
- [x] CSP, referrer policy, safe external links, and zero pre-consent third-party requests pass.
- [x] The Pages bundle includes only allowlisted public site files.
- [x] Dependency audit reports no moderate-or-higher vulnerabilities.

## External release gates

These boxes must only be updated from authoritative evidence. Automation always
reports them as `pending-external` in `release-gates.json`.

- [ ] Confirm the operator's full legal name and legal form.
- [ ] Confirm the actual mail infrastructure and public mailbox.
- [ ] Confirm the address.
- [ ] Confirm the telephone number.
- [ ] Confirm opening hours.
- [ ] Complete legal review of the legal notice and privacy notice.
- [ ] Approve all content, claims, trademarks, photos, and required person/customer releases.
- [ ] Supply approved original images for the low-resolution social crops and other replacements.
- [ ] Complete physical iOS and Android review.
- [ ] Give explicit approval to remove the presentation gate and `noindex`.

The recommendation-rate and Google-review-count claims are time-dependent and form
part of content approval.

## Publication boundary

- Keep the preview gate and `noindex, nofollow` until every applicable approval is documented.
- Treat the browser gate as presentation only; page source and static assets remain public.
- Do not change DNS, merge the draft pull request, or trigger a manual Pages release as part of technical verification.
- After approval, update legal/privacy content and media records before removing the preview boundary.
- Repeat the complete readiness suite and physical-device review after those release changes.
