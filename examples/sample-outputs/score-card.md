<!-- Sample output: "rate my code out of 100" on examples/sample-express-app (scanned as its own project). -->

```
╔══════════════════════════════════════════════╗
║  🎓 VIBE SCORE:  59 / 100   Grade: Needs work 🔴
║  "Lots of quick wins waiting for you."
╚══════════════════════════════════════════════╝
```

**In short:** your to-do app is small, tidy and easy to read, but it has a leaked key and no real login guard, so safety drags the score down.

| Area | Score | Bar | Why (evidence) |
|---|---|---|---|
| 🔐 Security (20) | 0/20 | ░░░░░░░░░░ | Hard-coded key `server.js:9` (−8) · `.env` not in `.gitignore` (−4) · no auth on `DELETE /api/todos/:id` `server.js:32` (−5) · plain-text passwords `server.js:39` (−3) · no input check `server.js:26` (−3) · `innerHTML` `public/app.js:8` (−2) |
| 🏗️ Structure (15) | 15/15 | ██████████ | Frontend in `public/`, server in `server.js` — clean split for this size |
| 📖 Readability (15) | 15/15 | ██████████ | Short functions, clear names like `loadTodos` |
| 🧯 Error handling (10) | 4/10 | ████░░░░░░ | `fetch` with no try/catch `public/app.js:6` and `:16` (−4) · list silently fails if the server is down (−2) |
| 🧪 Testing (10) | 5/10 | █████░░░░░ | No tests found; small project, so it only costs half |
| ⚡ Performance (10) | 10/10 | ██████████ | Nothing slow for this size |
| 🧹 Maintainability (10) | 10/10 | ██████████ | Tiny, no duplication, only 1 dependency |
| 📝 Docs (5) | 3/5 | ██████░░░░ | README has no "how to run" steps (−1) · no `.env.example` (−1) |
| ⚙️ Tooling & config (5) | 3/5 | ██████░░░░ | `.gitignore` + `start` script ✅ · no linter (−1) · no formatter (−1) |
| **Total** | **65 → 59** | | capped at 59 (see below) |

⚠️ **Red-flag caps active:**
- A live-looking key is typed into `server.js:9` → max **69**.
- Your app has a login, but the token is never checked, so anyone can delete any to-do (`server.js:32`) → max **59**.

🌱 **Size note:** 4 source files is a weekend-project size, so missing tests only cost half points. That's normal.

### 🔝 Top 5 things holding the score back
| # | Issue | Where | Points lost |
|---|---|---|---|
| 1 | API key typed into the code | `server.js:9` | 8, and causes the 69 cap |
| 2 | Write routes don't check who's asking | `server.js:26`, `:32` | 5, and causes the 59 cap |
| 3 | `.env` not in `.gitignore` | `.gitignore:1` | 4 |
| 4 | Passwords compared as plain text | `server.js:39` | 3 |
| 5 | `fetch` calls with no error handling | `public/app.js:6`, `:16` | 6 |

🏆 **Best thing:** your code is genuinely easy to read — short functions, clear names, and a clean frontend/backend split. Many beginner projects are a single 500-line file!

🎯 **Most valuable fix:** move the key from `server.js:9` into `.env` and ignore `.env` in Git. It removes 12 points of deductions and a real money risk, and lifts the 69 cap. Honest note: the total stays at 59 until the login guard (fix 6 in the plan) is in place too.

🏢 **Big Tech Corner:** at big companies a key would live in a secrets manager, and a robot (CI) would block any push that contains one. Your version: `.env` + `.gitignore` + GitHub secret scanning (free for public repos).

ℹ️ This score is a teaching aid built from facts in your code, not a certified audit.

👉 **Next step:** `fix-plan` (see the quickest wins) · `security` · `explain server.js`
