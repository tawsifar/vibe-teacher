<div align="center">

# 🎓 VIBE Teacher

**Explains your own project to you like a patient friend, then scores it, finds the dangerous parts,<br>and gives you the exact prompts to fix them.**

[![validate](https://github.com/tawsifar/vibe-teacher/actions/workflows/validate.yml/badge.svg)](https://github.com/tawsifar/vibe-teacher/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agent Skill](https://img.shields.io/badge/Agent%20Skill-open%20standard-8A2BE2)](https://agentskills.io)
[![Version](https://img.shields.io/badge/version-0.1.0-green)](CHANGELOG.md)

Works in **Claude Code · Google Antigravity · OpenCode · VS Code + GitHub Copilot · Cursor · OpenAI Codex · Gemini CLI · Windsurf**

[Install in 1 minute](#-install-in-1-minute) · [What it does](#-what-it-does) · [Modes](#-modes) · [How the score works](#-how-the-score-works) · [Troubleshooting](#-troubleshooting) · [বাংলা](README.bn.md)

</div>

---

## 🤔 Who is this for?

You built an app or website by prompting an AI (Claude Code, Cursor, Copilot, Antigravity, Lovable, Bolt…).
It works, but **you can't read the code**, and words like "backend", "API route" or "environment variable" feel like a foreign language.

VIBE Teacher is an **Agent Skill**: a folder of instructions your AI tool loads when you ask about your project.
It never needs an account, never sends your code anywhere new, and doesn't change anything unless you say **"apply"**.

## ✨ What it does

| | Feature | You get |
|---|---|---|
| 🗺️ | **Project tour** | Your architecture, lesson by lesson, using a restaurant analogy |
| 🗂️ | **Project map** | Every important file and its job in plain English |
| 🔄 | **"What happens when I click…"** | One click traced from the button → server → database → screen |
| 🧰 | **Stack explainer** | "Your app runs on Node.js. Here's what that means", in 5 lines |
| 🎓 | **VIBE Score (0–100)** | A transparent score card with evidence for every lost point |
| 🛡️ | **Security red flags** | Leaked keys, `.env` mistakes, missing validation, open databases |
| 🛠️ | **Fix plan + prompts** | Quick wins → big refactors, each with a copy-paste prompt for your AI |
| 💡 | **Feature ideas** | What to build next, ranked by impact and effort |
| ❓ | **Quizzes, glossary, XP** | Learn as you go; optional progress journal |
| 🇧🇩 | **Bangla mode** | `lang bn`: explanations in simple Bangla |

### 🎓 The score card

```
╔══════════════════════════════════════════════╗
║  🎓 VIBE SCORE:  63 / 100   Grade: D  🟠       ║
║  "Works, but has a few risky habits."         ║
╚══════════════════════════════════════════════╝

| Area                     | Score | Bar        | Why (evidence)                       |
|--------------------------|-------|------------|--------------------------------------|
| 🔐 Security (20)          | 9/20  | ████░░░░░░ | API key hard-coded in api/chat.js:7  |
| 🏗️ Structure (15)         | 12/15 | ████████░░ | Clear routes/ and components/        |
| 🧪 Testing (10)           | 2/10  | ██░░░░░░░░ | No test files found                  |
| ...                      |       |            |                                      |

⚠️ Red-flag cap active: a live secret was found, so the score can't go above 69 until it's fixed.
🏆 Best thing: your folder structure is cleaner than most beginner projects!
👉 Next: type `fix-plan` to see the 3 quickest wins.
```

### 🗺️ A tour lesson

```
## 🗺️ Lesson 1 of 6 — The Big Picture

**In short:** Your app is a to-do website: a React "dining room" (frontend)
talks to an Express "kitchen" (backend) that stores orders in a Supabase "fridge" (database).

   [Browser] --click--> [React page] --fetch /api/todos--> [Express server] --> [Supabase]
        ^                                                          |
        +------------------ JSON list of to-dos <------------------+

✅ Key takeaway: the frontend never touches the database directly; it always asks the waiter (API).
👉 Type `next` for Lesson 2: The Frontend.
```

### 🛠️ A fix plan

```
### 🟢 Quick wins (15 minutes or less each)
1. Move the API key to .env — why: anyone on GitHub can steal it.
   📋 Prompt for your AI: "Move the hard-coded key in api/chat.js into an environment
   variable named OPENAI_API_KEY, add .env to .gitignore, and create .env.example."
```

Full real examples generated from the demo app: [`examples/sample-outputs/`](examples/sample-outputs/).

---

## 🚀 Install in 1 minute

> **Easiest path:** if you have Node.js, use **Option 1**. No Node.js? Use **Option 3**.
> After installing, **restart your AI tool**, open your project, and type **`vibe teacher`**.

### 🥇 Option 1 — One command, any tool (recommended)

Needs [Node.js](https://nodejs.org) 18+. It asks which tools you use and puts the skill in the right folders.

```bash
npx skills add tawsifar/vibe-teacher
```

| Want to… | Command |
|---|---|
| Install for all projects, no questions | `npx skills add tawsifar/vibe-teacher -g -y` |
| Pick specific tools | `npx skills add tawsifar/vibe-teacher -g -a claude-code -a cursor -a codex` |
| **Windows** (avoid symlink errors) | `npx skills add tawsifar/vibe-teacher -g -y --copy` |
| Update later | `npx skills update` |

> 🪟 **Windows users: always add `--copy`.** The CLI uses symlinks by default, and those often need admin rights or Developer Mode on Windows.

### 🥈 Option 2 — Claude Code plugin (gets auto-updates)

Type these inside Claude Code:

```
/plugin marketplace add tawsifar/vibe-teacher
/plugin install vibe-teacher@vibe-teacher-market
```

Then use it with `/vibe-teacher:vibe-teacher` (or just ask "vibe teacher, give me a tour").
To get updates automatically: `/plugin` → **Marketplaces** → `vibe-teacher-market` → enable auto-update (it's off by default).

### 🥉 Option 3 — One-line script (no Node.js needed)

**macOS / Linux** (Terminal):

```bash
curl -fsSL https://raw.githubusercontent.com/tawsifar/vibe-teacher/main/install/install.sh | bash
```

**Windows** (PowerShell):

```powershell
irm https://raw.githubusercontent.com/tawsifar/vibe-teacher/main/install/install.ps1 | iex
```

These copy the skill into `~/.claude/skills`, `~/.agents/skills`, `~/.gemini/config/skills` and `~/.gemini/antigravity/skills`,
which covers every supported tool. No admin rights, no symlinks. If a copy already exists, it's kept as `vibe-teacher.bak`.

> 🔍 Piping a script into your shell is a trust decision. Feel free to read [`install.sh`](install/install.sh) / [`install.ps1`](install/install.ps1) first. They're short.

<details>
<summary>Script options (only one tool, this project only, uninstall)</summary>

| Option | macOS / Linux | Windows |
|---|---|---|
| Only one tool family | `curl -fsSL …/install.sh \| bash -s -- --only claude` | `& ([scriptblock]::Create((irm …/install.ps1))) --only claude` |
| Install into this project only | `… \| bash -s -- --project` | `… --project` |
| Uninstall | `… \| bash -s -- --uninstall` | `… --uninstall` |

`--only` accepts `claude`, `agents` or `antigravity`. `--project` installs into `./.claude/skills` and `./.agents/skills` of the current folder.
</details>

### 🛠️ Option 4 — Manual copy

1. [Download the ZIP](https://github.com/tawsifar/vibe-teacher/archive/refs/heads/main.zip) and unzip it.
2. Copy the folder `skills/vibe-teacher` into the folder for your tool (table below). Create the folder if it doesn't exist.
3. Restart your tool (or reload skills: Claude Code `/reload-skills`, Gemini CLI `/skills reload`).
4. Check it's there: `/skills` (Claude Code, Codex, VS Code chat) or `/skills list` (Gemini CLI). Then type `vibe teacher`.

| Tool | This project only | All projects (global) | How to start it |
|---|---|---|---|
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/` | `/vibe-teacher` or ask naturally |
| **OpenCode** | `.opencode/skills/` or `.claude/skills/` | `~/.config/opencode/skills/` or `~/.claude/skills/` | Ask naturally |
| **Google Antigravity** | `.agents/skills/` | `~/.gemini/config/skills/` (legacy: `~/.gemini/antigravity/skills/`) | Ask naturally |
| **Antigravity CLI** | `.agents/skills/` | `~/.gemini/antigravity-cli/skills/` | Ask naturally |
| **VS Code + Copilot** | `.github/skills/` or `.claude/skills/` | `~/.copilot/skills/` or `~/.claude/skills/` | `/vibe-teacher` in chat |
| **Cursor** | `.cursor/skills/` or `.agents/skills/` | `~/.cursor/skills/` or `~/.claude/skills/` | `/vibe-teacher` or automatic |
| **OpenAI Codex** | `.agents/skills/` | `~/.agents/skills/` | `$vibe-teacher` or `/skills` |
| **Gemini CLI** | `.gemini/skills/` or `.agents/skills/` | `~/.gemini/skills/` or `~/.agents/skills/` | Automatic (asks consent) |
| **Windsurf / Devin** | `.devin/skills/` (legacy `.windsurf/skills/`) | `~/.codeium/windsurf/skills/` | Automatic or `@vibe-teacher` |

On Windows, `~` means your user folder, e.g. `C:\Users\you\.claude\skills`.

> 💡 **Shortcut:** three folders cover almost everything. `~/.claude/skills` (Claude Code, OpenCode, Copilot, Cursor),
> `~/.agents/skills` (Codex, Gemini CLI, OpenCode, Copilot) and `~/.gemini/config/skills` (Antigravity).

> 📅 **Paths change often.** This table was checked in **October 2026**. If a tool doesn't find the skill, check its docs for the current skills folder.

---

## 🧭 Modes

Type `vibe teacher` + a mode, or just ask in your own words. In Claude Code you can also type `/vibe-teacher score`.

| Mode | Say something like | You get |
|---|---|---|
| `start` | "vibe teacher" | Welcome card + menu |
| `tour` | "give me a tour", "explain my architecture" | Lesson 1 of N (type `next` to continue) |
| `map` | "what does each file do?" | Folder tree + file table + diagram |
| `explain FILE` | "what does server.js do?" | A file card with risky lines |
| `flow "ACTION"` | "what happens when I click Login?" | Numbered request flow + diagram |
| `stack` | "what is Node.js?", "what's my tech stack?" | Stack cards |
| `score` | "rate my code out of 100" | Score card + top 5 issues |
| `fix-plan` | "how do I improve it?" | Prioritised fixes with prompts |
| `security` | "is my app safe?", "did I leak any keys?" | Red-flag report |
| `features` | "what should I add next?" | Feature idea cards |
| `quiz` | "quiz me" | 3 questions about your project, XP |
| `glossary TERM` | "what is middleware?" | A plain-English term card |
| `prompt-coach` | "how should I ask my AI to fix this?" | Better prompts |
| `error "MESSAGE"` | paste an error | Plain-English cause + fix prompt |
| `progress` | "my progress" | XP, lessons, score history |
| `level eli5` / `beginner` / `junior` | "explain simpler" | Changes how technical answers are |
| `lang bn` / `lang en` | "Bangla te bolo" | Switches language |

> 💬 **Tip:** AI tools sometimes don't pick up skills for short requests. Starting with **"vibe teacher …"** always works.

## 📊 How the score works

| Area | Points | What earns them |
|---|---|---|
| 🔐 Security | 20 | No hard-coded secrets, `.env` ignored, input validation, auth on private routes, safe CORS |
| 🏗️ Structure | 15 | Clear separation of UI / API / data, no 300+ line "god files" |
| 📖 Readability | 15 | Clear names, short functions, consistent style |
| 🧯 Error handling | 10 | try/catch on network calls, friendly errors, correct status codes |
| 🧪 Testing | 10 | Tests exist, cover core logic, have a test command |
| ⚡ Performance | 10 | No obvious slow patterns |
| 🧹 Maintainability | 10 | Little duplication, few leftovers, sensible dependencies |
| 📝 Documentation | 5 | README with setup steps, `.env.example` |
| ⚙️ Tooling | 5 | `.gitignore`, linter, formatter, scripts, CI bonus |

- Every area **starts full** and only loses points for a **specific finding with a file and line**.
- **Red-flag caps:** a live secret or committed `.env` caps the score at **69**. SQL injection or unprotected data-changing routes cap it at **59**.
- **Grades:** 90+ A 🟢 · 80–89 B 🟢 · 70–79 C 🟡 · 60–69 D 🟠 · under 60 Needs work 🔴.
- Small weekend projects get a discount on missing tests/CI.
- A zero-dependency scanner ([`scan-project.mjs`](skills/vibe-teacher/scripts/scan-project.mjs)) collects the facts first, so the same code gets the same score.

> ⚖️ The score is a **teaching aid**, not a certified audit. The security check is a beginner safety net, not a replacement for
> GitHub secret scanning, Dependabot or `npm audit`. Turn those on too!

## 🔒 Privacy & safety

| Promise | How |
|---|---|
| **Read-only** | Never edits your code unless you say **"apply"** |
| **Secrets masked** | Shows at most the first 3 and last 3 characters (`sk-…9f2`) |
| **Asks first** | Asks before creating `VIBE_NOTES.md` (progress) or `VIBE_MAP.md` (diagram) |
| **Runs locally** | The scanner runs on your machine with Node's built-in modules only; no network calls |

## 🧯 Troubleshooting

| Problem | Fix |
|---|---|
| The AI doesn't use the skill | Restart the tool. Start your message with **"vibe teacher"**. Check it's listed with `/skills`. |
| Claude Code doesn't see a new install | `/reload-skills`, or restart Claude Code |
| Gemini CLI ignores it | `/skills reload`. Project skills only load in **trusted** folders. |
| Windows: `EPERM` / symlink error with `npx skills` | Add `--copy` |
| After `npx skills update` on Windows it broke | Known issue ([vercel-labs/skills#1199](https://github.com/vercel-labs/skills/issues/1199)): update re-adds `--copy` installs as symlinks. Delete the skill folder and run `npx skills add tawsifar/vibe-teacher -g -y --copy` again. |
| Antigravity doesn't find it | Google's docs disagree on the global path. The install scripts write to both `~/.gemini/config/skills` and `~/.gemini/antigravity/skills`. |
| Copilot doesn't find it | Make sure your Copilot plan and VS Code version support Agent Skills; Copilot also reads `~/.claude/skills`. |
| "I couldn't run my scanner" | Install [Node.js](https://nodejs.org) 18+. The skill still works without it, just less precisely. |
| Claude Code plugin doesn't update | Plugin updates only arrive when the version changes; enable auto-update under `/plugin` → Marketplaces. |

### Optional: remind your agent to use the skill

Some agents forget to use skills. Paste a snippet from [`adapters/`](adapters/) into your project's
`AGENTS.md`, `.github/copilot-instructions.md`, or `.cursor/rules/`.

---

## 🗂️ What's in this repo

```
vibe-teacher/
├── .claude-plugin/           # makes this repo a Claude Code plugin + marketplace
├── skills/vibe-teacher/      # ⭐ THE skill (this is what gets installed)
│   ├── SKILL.md              # router, rules, modes
│   ├── references/           # detailed guides, loaded only when needed
│   ├── scripts/              # zero-dependency project scanner + tests
│   └── assets/templates/     # the card/table layouts every answer follows
├── adapters/                 # optional "use the skill" hints for AGENTS.md / Copilot / Cursor
├── install/                  # one-line installers (bash + PowerShell)
├── examples/                 # demo apps with planted (fake) issues + sample outputs
├── evals/                    # trigger and output evaluation sets
├── scripts-dev/              # repo validation scripts used by CI
└── .github/workflows/        # CI: tests on Ubuntu + Windows
```

## 🧑‍💻 For contributors

```bash
git clone https://github.com/tawsifar/vibe-teacher.git
cd vibe-teacher
npm test
```

`npm test` runs the scanner tests, the skill spec check and the smoke test. No `npm install` needed: there are zero dependencies.
See [CONTRIBUTING.md](CONTRIBUTING.md) to add a stack pack or a new mode.

## 🗺️ Roadmap

| Version | Scope |
|---|---|
| **v0.1** (now) | All modes, scanner, 5 stack packs, Bangla mode, 4 install routes |
| v0.2 | Richer flow tracing for monorepos, more stack packs (Rails, Laravel, Go) |
| v0.3 | Score history charts in `VIBE_NOTES.md`, "explain this diff" mode |
| v1.0 | Full eval suite results, cross-tool screenshots, directory listings |

## 📄 License

[MIT](LICENSE) © tawsifar
