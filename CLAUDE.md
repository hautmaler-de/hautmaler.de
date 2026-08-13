# Claude Code Guide

Read `AGENTS.md` first. It is the repository-local operating guide.

## Continuation startup

1. Inspect `git status` and recent relevant commits.
2. Read `.agent/STATE.md`.
3. Read `.agent/TODO.md`.
4. Demand-load `.agent/DECISIONS.md` and `.agent/ARCHITECTURE.md` only as needed.
5. Continue the highest-priority unfinished task unless the user gives another.

Do not guess legal or business information. The preview gate is client-side
presentation, not authentication; never copy its embedded value into handoff docs
or describe it as secure.

## Useful commands

```bash
node --check script.js
python3 -m http.server 8000
git diff --check
```

There is no package installation or build command. The repository root deploys to
GitHub Pages on pushes to `main`.

Before finishing substantial work, validate and update the affected `.agent/`
files. Assume the next session has no useful memory of this conversation.
