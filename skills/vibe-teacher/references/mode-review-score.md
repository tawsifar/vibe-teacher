# Mode: score / review and fix-plan

**Contents:** 1. Principles · 2. Rubric with deductions · 3. Caps · 4. Grades · 5. Size scaling ·
6. Procedure · 7. Kindness rules · 8. Fix plan · 9. Badge

## 1. Principles

- **Transparent.** Every lost point has a reason and a `file:line` (or a scanner fact).
- **Consistent.** Same project + same facts = same score. Prefer scanner facts over impressions.
- **Kind.** The goal is motivation. Celebrate, then guide.
- Based on Google's code-review focus areas, OWASP-style security basics and 12-factor config.

## 2. Rubric with deductions

Each area **starts full**. Deduct only for specific findings. An area never goes below 0.
"Each" deductions stop at the listed maximum.

### 🔐 Security — 20

| Finding | Deduct | Evidence source |
|---|---|---|
| Hard-coded live secret in source code | −8 | `secrets[]` outside `.env*` files |
| `.env` not in `.gitignore` | −4 | `env.envInGitignore == false` and `env.envFiles` not empty |
| `.env` committed to Git | −4 | `env.envTrackedByGit == true` |
| No server-side input validation on a write route (POST/PUT/PATCH/DELETE) | −3 each, max −6 | read the route handler |
| `eval` / `new Function` / `exec` on user input | −4 | `risks[type=eval]` + reading |
| SQL/NoSQL query built from user strings | −6 | `risks[type=sql-string-building]` + reading |
| Private / admin / data-changing route with no auth where users exist | −5 | reading routes |
| Open CORS (`*` or `cors()` with no options) on an API with private data | −2 | `risks[type=open-cors]` |
| User text rendered with `innerHTML` / `dangerouslySetInnerHTML` | −2 | `risks[type=innerHTML]` |
| Passwords stored or compared as plain text | −3 | reading auth code |
| Secrets exposed to the browser (`NEXT_PUBLIC_`/`VITE_` holding a secret key) | −4 | reading `.env*` names + usage |
| Supabase RLS off / Firebase rules open | −5 | rules files / migrations / asking |
| Debug mode or stack traces sent to users in production | −2 | `risks[type=debug-mode]` + reading |

### 🏗️ Structure & architecture — 15

| Finding | Deduct |
|---|---|
| A "god file" over 300 lines mixing several jobs | −3 each, max −6 (`quality.largeFiles`) |
| UI, API and data code tangled in one place | −3 |
| No clear folders once the project has 10+ source files | −2 |
| Same logic implemented in 2+ places (copy-paste architecture) | −2 |
| Circular or confusing imports | −2 |

### 📖 Readability — 15

| Finding | Deduct |
|---|---|
| Function over 50 lines | −1 each, max −5 (`quality.longFunctions`) |
| Unclear names (`data2`, `x`, `temp`, `handleStuff`) | −1 each, max −3 |
| Large blocks of commented-out or dead code | −2 |
| Inconsistent style (mixed quotes/indent/naming) across files | −2 |
| Deep nesting (4+ levels) | −1 each, max −3 |

### 🧯 Error handling — 10

| Finding | Deduct |
|---|---|
| `fetch`/async call with no error handling | −2 each, max −4 (`risks[fetch-without-error-handling]`) |
| Errors swallowed (`catch {}` with nothing inside) | −2 |
| Users see raw errors or nothing at all when something fails | −2 |
| Server returns 200 for failures / wrong status codes | −2 |

### 🧪 Testing — 10

| Fact | Points earned |
|---|---|
| Any test files exist (`quality.hasTests`) | +4 |
| Tests cover core logic (routes, main features), confirmed by reading | +3 |
| A test command exists (`quality.hasTestScript`) | +3 |

Testing is scored by earning, not deducting. Apply size scaling (section 5).

### ⚡ Performance — 10

| Finding | Deduct |
|---|---|
| Database/API call inside a loop (N+1) | −3 |
| Same data fetched repeatedly with no caching where it obviously matters | −2 |
| Huge images or assets (over 1 MB) served to users | −2 |
| Loading a whole huge library for one tiny feature | −1 |
| Blocking work on the server's main thread (sync file reads per request) | −2 |

Small apps usually keep full marks here. Don't invent performance problems.

### 🧹 Maintainability — 10

| Finding | Deduct |
|---|---|
| Duplicated code blocks (10+ similar lines) | −2 each, max −4 |
| Magic numbers/strings repeated with no name | −1 each, max −2 |
| Many `console.log` leftovers (more than 10, `quality.consoleLogCount`) | −1 |
| Many TODO/FIXME (more than 10, `quality.todoCount`) | −1 |
| Very old or unused dependencies (confirmed) | −2 |

### 📝 Documentation — 5

| Fact | Deduct |
|---|---|
| No README | −3 |
| README without setup/run steps (`quality.readmeHasSetup == false`) | −1 |
| Uses env vars but no `.env.example` | −1 |

### ⚙️ Tooling & config — 5

| Fact | Deduct |
|---|---|
| No `.gitignore` | −2 |
| No linter (`quality.hasLinter == false`) | −1 |
| No formatter (`quality.hasFormatter == false`) | −1 |
| No run scripts in `package.json` (Node projects) | −1 |
| CI (`quality.hasCI`) | bonus +1, up to the max of 5 |

## 3. Caps (applied after adding up)

| Red flag | Max total |
|---|---|
| Live secret in source code, or a committed `.env` with real values | **69** |
| SQL/NoSQL injection, or an admin/data-changing route with no auth where users exist | **59** |

- Show the cap notice: "⚠️ Red-flag cap active: … so the score can't go above 69 until it's fixed."
- Fake/example values that are clearly labelled (`FAKE`, `example`, `test`) still count in demo
  fixtures, but say "this looks like a placeholder; if it's real, rotate it".

## 4. Grades

| Score | Grade | Badge | Phrase |
|---|---|---|---|
| 90–100 | A | 🟢 | "Excellent — big-tech habits!" |
| 80–89 | B | 🟢 | "Solid and healthy." |
| 70–79 | C | 🟡 | "Good base, a few things to tidy." |
| 60–69 | D | 🟠 | "Works, but has a few risky habits." |
| 0–59 | Needs work | 🔴 | "Lots of quick wins waiting for you." |

## 5. Size scaling

- **Tiny prototype** (10 or fewer source files, or under 500 lines): missing tests and CI cost **half**.
  Testing earns at least 5/10 even with no tests. Say "for a weekend project this is normal".
- **Big project** (100+ source files): sample. Read entry points, all routes, auth, the 5 largest files
  and config. Say what you sampled.

## 6. Procedure

1. Run the scanner. Note `secrets`, `env`, `risks`, `quality`, `routes`.
2. Read: entry points, every write route, auth code, the largest files, `.gitignore`, README.
3. Go area by area. Write each deduction as: area, points, `file:line`, a 1-line plain-English reason.
4. Add up. Apply size scaling, then caps. **Check the areas add up to the total.**
5. Pick the 🏆 best genuine thing and the 🎯 single most valuable fix: the one with the biggest real-world
   risk (a leaked secret beats everything). If a **lower** cap is also active, say honestly that the total
   won't move past it until that fix is done too.
   - "Points lost" per issue = the deduction size. When an area is already at 0 or a cap is active, the
     total rises less than the sum of the fixes; never promise "+N" to the total without doing the maths.
6. Fill assets/templates/score-card.md. The "Why" column holds the most important evidence for each area.
7. Show the top 5 issues below the card, most valuable first.
8. If a previous score is known (`VIBE_NOTES.md`), show the change: "54 → 71 🎉".
9. Ask (once) whether to save the score to `VIBE_NOTES.md`.

Bars: 10 blocks, filled = round(score / max × 10). Use █ for filled and ░ for empty.

## 7. Kindness rules

- Never "bad", "terrible", "wrong". Use "needs work", "risky", "can be better".
- Lead with the score, then immediately something good.
- Frame fixes as wins: "3 quick wins could add about 15 points."
- Add one "🏢 Big Tech Corner" line from [big-tech-practices.md](big-tech-practices.md).

## 8. Fix plan (assets/templates/fix-plan.md)

Turn deductions into 3 buckets:

| Bucket | Rule of thumb |
|---|---|
| 🟢 Quick wins | Under 15 minutes each, little risk: move a secret, add `.gitignore` lines, add try/catch, write `.env.example` |
| 🟡 Medium | 1–2 hours: input validation, auth on routes, first tests, error messages |
| 🔴 Big refactors | Plan first: split god files, add a database, restructure folders |

Each fix has: title, **why** (1 line, user impact), points it could win back, `file:line`,
and a 📋 copy-paste prompt built with [prompt-coach.md](prompt-coach.md).
Order: biggest cap-lifting fix first, then most points per minute.
Never apply fixes unless the user says "apply". If they do, change one fix at a time and show before/after.

## 9. Badge (assets/templates/readme-badge.md)

Only when asked, or offered once after a score of 70+. Ask before editing README.md.
Colours: A/B `brightgreen`, C `yellow`, D `orange`, under 60 `red`.
