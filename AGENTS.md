# Repository Agent Guide

## Operating model

The repository is persistent project memory. A chat or agent session is temporary
working memory. Store durable, verified continuation context in `.agent/`.

Assume the next session has no useful memory of the current conversation.

## Startup

1. Inspect `git status` and preserve unrelated worktree changes.
2. Read `.agent/STATE.md`.
3. Read `.agent/TODO.md` when continuing work.
4. Read `.agent/DECISIONS.md` and `.agent/ARCHITECTURE.md` only when relevant.
5. Inspect recent relevant commits and only the implementation area needed.

For an unspecified continuation request, take the highest-priority supported item
from `.agent/TODO.md`. Do not redo completed work or guess business facts.

## Project map

- `index.html`: public content, metadata, structured data, portfolio, and contact.
- `styles.css`: responsive site and preview-gate styling.
- `script.js`: mobile navigation, lazy map loading, year, and preview gate.
- `impressum.html`, `datenschutz.html`, `404.html`: legal and secondary pages.
- `img/`: logo, studio, artist, and portfolio assets.
- `.github/workflows/pages.yml`, `CNAME`: Pages deployment and custom domain.
- `README.md`: stable publishing and content provenance notes.
- `.agent/`: current state, authoritative tasks, decisions, and architecture map.

## Scope and safety

- This is static HTML/CSS/JavaScript with no build or dependency-install step.
- The client-side preview gate is presentation only, not access control; never
  treat its embedded code as a secret or security boundary.
- Do not silently invent legal names, contact details, hours, or service claims.
- Preserve image provenance notes and do not add media without confirmed rights.
- Keep Google Maps lazy-loaded through the existing explicit user action unless a
  privacy decision deliberately changes that boundary.
- Do not add credentials, tokens, customer data, or private source media.

## Context hygiene

- Use targeted `rg`, narrow reads, scoped history, and focused diffs.
- Do not load the image library or all page copy when a targeted check is enough.
- Avoid giant logs and unnecessary rereads of understood files.
- Run syntax and path checks before broader browser review.
- Use isolated or subagent investigations, where supported, only for large
  independent explorations.
- Put durable findings in `.agent/STATE.md`, not only in the conversation.

## Validation

- Run `node --check script.js`.
- Run `git diff --check`.
- Confirm changed links and asset paths resolve to repository files.
- For behavior or layout changes, serve with `python3 -m http.server 8000` and
  inspect representative mobile and desktop widths.
- Test the preview flow without recording its embedded value in agent documents.
- Verify runtime deployment separately from workflow configuration when it matters.

## Handoff

Before ending substantial work:

1. Validate the coherent change.
2. Update `.agent/STATE.md` with verified current reality.
3. Update `.agent/TODO.md`; it is the only repository task authority.
4. Record only durable, non-trivial decisions.
5. Update architecture only if the implemented structure changed.

At roughly 50-70% visible context usage, prefer a coherent stopping point, update
the handoff, and continue in a fresh session. Do not stop halfway through an
atomic change merely to satisfy a percentage.

Inspect the final diff and handoff so a fresh Codex or Claude Code session can
continue without this conversation.
