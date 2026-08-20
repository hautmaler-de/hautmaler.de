# TODO

This file is the authoritative repository task list. `README.md` links here rather
than keeping a competing checklist.

## Now

- [x] Add a minimal Node-based development and CI toolchain without converting the
  public site to a framework. Cover HTML and JavaScript syntax, internal/external
  links, assets, duplicate IDs, metadata, preview/noindex invariants, current year,
  404 behavior, legal links, map consent, and unexpected third-party requests.
- [x] Add Playwright browser tests and axe accessibility checks for the preview gate,
  mobile navigation, portfolio, contact, map consent, legal pages, and 404 page.
  Exercise 320 px, 390 px, tablet, and desktop layouts plus reduced motion; add a
  maintainable visual-regression strategy and Lighthouse resource/timing budgets.
- [x] Implement one reproducible release-readiness command that reports technical
  checks separately from external approvals and never marks an external approval as
  completed automatically.
- [x] Create a versioned machine-readable media manifest plus `docs/MEDIA_MANIFEST.md`.
  Record provenance, permission state, source/derivative status, dimensions,
  metadata/GPS state, alt text, and replacement need for every referenced image.
- [x] Add a reproducible responsive-image derivative script for suitable existing
  higher-resolution sources only. Keep compatible fallbacks, never upscale or
  overwrite originals, and strip metadata from every generated derivative.
- [x] Improve portfolio presentation accessibility with a native list, persistent
  captions, intrinsic image dimensions, and tested keyboard/focus behavior. A detail
  dialog was unnecessary and was not added.
- [x] Add or correct technical SEO and static security controls: canonical and
  OpenGraph metadata, image metadata, sitemap, preview-aware robots policy, complete
  titles/descriptions, structured-data validation, safe external-link referrers, and
  a practical static Content Security Policy. Preserve `noindex`.
- [x] Create `docs/VERIFICATION_MATRIX.md`, `docs/RELEASE_CHECKLIST.md`, and
  `docs/NICE_TO_HAVE.md`; update README and the affected `.agent/` files with verified
  results. Nice-to-have capabilities must remain documentation only, with no stubs or
  dependencies.
- [x] Run the complete static, external-link, E2E, axe, media, responsive, visual,
  and Lighthouse validation suite; inspect `git diff --check` and the final diff.
- [x] After implementation is complete, commit the coherent changes, push
  `agent/hautmaler-quality-and-readiness`, and open a draft pull request. Do not merge
  or change Pages/DNS/public-release state.
- [ ] Obtain and apply the operator's confirmed full legal name for the legal notice.
- [ ] Confirm the actual mail infrastructure and whether the public mailbox exists,
  then align the privacy notice and contact details.
- [ ] Reconfirm address, telephone number, and opening hours with the operator.

## Next

- [ ] Remove the client-side preview gate from all pages, CSS, and JavaScript after
  explicit approval for public release.
- [ ] Review the deployed site on physical mobile devices.

## Later

- [ ] Replace low-resolution social-feed portfolio crops with approved originals
  when those files are available.

## Blocked

- [ ] Final legal and content sign-off depends on authoritative operator input.

## Recently completed

- [x] Replace uneven portfolio masonry with equal 3:4 cards, centered incomplete rows,
  presentation-only cropping, and responsive layout regression coverage.
- [x] Add the user-supplied Foo Dog full-back photo to the portfolio with responsive,
  metadata-free derivatives, media records, and updated automated/visual tests.
- [x] Confirm draft PR #1's remote `Website quality / verify` check passes without
  merging or triggering a public release.
- [x] Inspect the clean base branch, recent commits, repository instructions,
  GitHub Pages configuration, open issues/PRs, all current HTML/CSS/JavaScript, and
  initial image dimensions/metadata for the quality/readiness workstream.
- [x] Create the local branch `agent/hautmaler-quality-and-readiness` without changing
  the deployed site.
- [x] Add the linked `website made by itmitalles.de` footer credit.
- [x] Deploy the static site at `hautmaler.de` with enforced HTTPS.
- [x] Remove the unused contact form.
- [x] Replace the old root handoff with `.agent/` state and tasks.
