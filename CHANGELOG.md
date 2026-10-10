# Changelog

All notable changes to this project are documented here. This project follows [Semantic Versioning](https://semver.org).
When releasing, bump the version in **both** `skills/vibe-teacher/SKILL.md` (`metadata.version`) and
`.claude-plugin/plugin.json` (`version`). CI fails if they differ.

## [0.1.0] - 2026-10-10

### Added
- `vibe-teacher` Agent Skill following the open Agent Skills standard (works in Claude Code, Antigravity,
  OpenCode, VS Code/Copilot, Cursor, Codex CLI, Gemini CLI and Windsurf).
- Modes: `start`, `tour` (+ `next`/`back`/`lesson N`), `map`, `explain FILE`, `flow "ACTION"`, `stack`,
  `score`/`review`, `fix-plan`, `security`, `features`, `quiz`, `glossary`, `prompt-coach`, `progress`,
  `error`, `badge`, `level eli5|beginner|junior`, `lang en|bn`.
- Transparent 100-point rubric with evidence-based deductions, red-flag caps and size scaling.
- Zero-dependency project scanner (`scripts/scan-project.mjs`) with masked secret detection, stack and
  route detection, `.env`/Git checks and quality signals. 13 unit tests live in `tests/` so user installs stay lean.
- Stack packs: Node/Express, Next.js/React/Vite, Python (Flask/FastAPI/Django/Streamlit), Supabase/Firebase, static HTML.
- 14 output templates, 80+ term glossary, analogies library, Bangla style guide.
- Claude Code plugin + marketplace manifests, `npx skills` support, install scripts for macOS/Linux and Windows.
- Example apps with planted (fake) issues, sample outputs, trigger and output eval sets.
- CI on Ubuntu and Windows (Node 20 and 22), official `skills-ref` and `claude plugin validate` checks, and
  real end-to-end installs from GitHub (script, `npx skills`, Claude Code plugin) on Linux, macOS and Windows.
- SECURITY.md, Dependabot for GitHub Actions, issue and PR templates.
