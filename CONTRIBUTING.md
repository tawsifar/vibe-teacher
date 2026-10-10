# Contributing to VIBE Teacher

Thanks for helping beginners understand their code! 🎓

## Quick start

```bash
git clone https://github.com/tawsifar/vibe-teacher.git
cd vibe-teacher
npm test          # scanner tests + skill spec check + smoke test (no install needed)
```

Requirements: Node.js 18+ (CI uses 20 and 22). There are **zero npm dependencies**. Please keep it that way.

## Repo layout (why it looks like this)

- `skills/vibe-teacher/` is the **only** thing users install. `npx skills` finds it in `skills/`, and the
  Claude Code plugin finds it because `.claude-plugin/marketplace.json` points `source` at the repo root (`./`).
- Only `plugin.json` and `marketplace.json` live in `.claude-plugin/`. Never put skills there.
- If a future Claude Code version rejects `"source": "./"`, the fallback is
  `plugins/vibe-teacher/.claude-plugin/plugin.json` + `plugins/vibe-teacher/skills/vibe-teacher/` with
  `"source": "./plugins/vibe-teacher"`, keeping a copy at `skills/vibe-teacher/` for `npx skills`, plus a CI
  check that both copies are identical.

## Rules for the skill

- `SKILL.md` frontmatter may only use spec fields: `name`, `description`, `license`, `metadata`
  (plus optional `compatibility`, `allowed-tools`). No angle brackets in frontmatter.
- `name` stays `vibe-teacher` forever (renaming breaks installs). Use `displayName` in `plugin.json` for labels.
- Keep the `SKILL.md` body under 400 lines. Put details in `references/` (one level deep, linked from `SKILL.md`).
- Reference files: 60–250 lines, with a short contents list at the top if over 100 lines.
- Teaching voice: short sentences, everyday words, analogy first, never shame the user.
- Fixtures must use obviously fake secrets (`sk-FAKE-EXAMPLE-…`). CI rejects real-looking keys.

## Add a stack pack

1. Create `skills/vibe-teacher/references/stack-NAME.md` using an existing pack as the model:
   "What it is (5 lines)", typical layout table, request flow, common beginner mistakes, deployment.
2. Add detection to `scripts/scan-project.mjs` (`FRAMEWORK_DEPS`, `PY_FRAMEWORKS` or `CONFIG_HINTS`).
3. Add a row to the "Stack packs" table in `SKILL.md`.
4. Add a test in `tests/scan-project.test.mjs` (use `tempProject()` for a tiny fixture).
5. Run `npm test`.

## Add a mode

1. Write `references/mode-NAME.md` (goal, procedure, output format).
2. If it has a fixed layout, add `assets/templates/NAME.md` with `{{PLACEHOLDERS}}`.
3. Add a row to the mode router table in `SKILL.md`, then update `README.md` and `evals/evals.json`.

## Releasing

1. Bump the version in `SKILL.md` `metadata.version` **and** `.claude-plugin/plugin.json` (CI checks they match;
   don't put a version in `marketplace.json`). Claude Code users only get updates when this version changes.
2. Update `CHANGELOG.md`.
3. Tag and release: `git tag v0.x.y && git push --tags && gh release create v0.x.y --notes-file CHANGELOG.md`.

## Testing triggers by hand

Automated trigger evals can under-report for skills, so also try the queries in `evals/trigger-queries.json`
by hand in at least Claude Code and one other tool, and run `tour`, `score` and `flow` on `examples/sample-express-app`.
