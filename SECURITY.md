# Security Policy

## Supported versions

Only the latest release of VIBE Teacher gets fixes. Update with `npx skills update`,
re-run the install script, or enable auto-update for the Claude Code plugin.

## What VIBE Teacher does (and doesn't) do

- The scanner (`skills/vibe-teacher/scripts/scan-project.mjs`) is **read-only**, uses only Node's
  built-in modules, makes **no network requests**, and never prints a full secret (first 3 + last 3 characters at most).
- The install scripts only download this repository from GitHub and copy one folder into your skills folders.
- The skill tells your AI tool not to change code unless you say "apply". Your AI tool's own permission
  settings still apply. Review skills before use, like any agent instructions.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.
Use GitHub's private reporting instead: **Security → Report a vulnerability** on
https://github.com/tawsifar/vibe-teacher/security/advisories/new

Include what you found, how to reproduce it, and the impact. You'll get a reply within 7 days.

## Example secrets

Every secret in `examples/` is fake on purpose (for example `sk-FAKE-EXAMPLE-…`) so the scanner has
something to find. CI rejects real-looking keys in fixtures.
