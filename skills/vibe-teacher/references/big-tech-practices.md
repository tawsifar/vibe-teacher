# Big Tech Corner: how big-company teams would do it

Use one or two of these per review in a "🏢 Big Tech Corner" box. Pick ones that match a real
finding in THEIR code. Say what they'd do and why in plain words, never "you did it wrong".

**Contents:** 1. Code review focus · 2. Config & secrets · 3. Quality habits · 4. Shipping habits · 5. Don't over-engineer

## 1. What reviewers look for (based on Google's code review guide)

| Focus | Plain question they ask |
|---|---|
| Design | Do the pieces fit together sensibly? Is this the right place for this code? |
| Functionality | Does it do what users need, including the weird cases (empty input, slow network)? |
| Complexity | Could someone new understand this quickly? Is anything more complicated than needed? |
| Tests | Are there automatic checks, written in the same change as the code? |
| Naming | Do names say what things are? (`unpaidInvoices` not `list2`) |
| Comments | Do comments explain **why**, not what? |
| Style | Does it follow one consistent style (usually enforced by a formatter)? |
| Documentation | If behaviour changed, did the README/docs change too? |

## 2. Config and secrets

- **12-factor config:** settings that change between laptop and live server (keys, URLs, ports) live in
  **environment variables**, never in code. `.env` locally, the host's settings panel in production.
- **Secrets manager:** big teams keep keys in a vault (AWS Secrets Manager, GCP Secret Manager, Doppler,
  Vercel/Netlify env settings) and **rotate** them regularly.
- **Least privilege:** each key can only do what it must (a read-only key for reading).
- `.env.example` is always committed so newcomers know which variables to set.

## 3. Quality habits

| Habit | What it means | Beginner version |
|---|---|---|
| Linting | A robot that spots likely bugs and sloppy code | Add ESLint (`npm init @eslint/config`) or Ruff for Python |
| Formatting | A robot that makes the code look consistent | Add Prettier or Black; format on save |
| Tests in the same change | Every feature arrives with a check that it works | One test per route you add |
| Code review | Another person reads every change before it ships | Ask your AI "review this diff like a senior engineer" |
| Typed code | Labels on data so mistakes show up early | TypeScript or Python type hints, later |
| Logging | The app writes a diary of what happened | Use a logger instead of random `console.log` |
| Error tracking | Crashes are reported automatically | Sentry free tier |

## 4. Shipping habits

- **Small commits** with clear messages: easy to understand, easy to undo. ("Add input validation to POST /api/todos")
- **CI (continuous integration):** robots run tests and linting on every push (GitHub Actions).
- **Branches + pull requests:** work on a copy, merge when checks pass.
- **Preview deployments:** every change gets a test URL before going live (Vercel/Netlify do this).
- **Dependency updates:** Dependabot/Renovate open update PRs automatically.
- **Backups and migrations:** database changes are written as scripts, not clicked by hand.

## 5. Don't over-engineer

Google's guide also warns against building for problems you don't have yet.
For vibe coders: no microservices, Kubernetes or complex patterns for a small app.
"Make it work, make it safe, make it clear, then make it fancy."

## Example box

```
🏢 Big Tech Corner
At big companies, a key like the one in server.js:9 would live in a secrets manager, and a robot
(CI) would block any push containing a key. Your version: put it in .env, add .env to .gitignore,
and turn on GitHub secret scanning (free for public repos).
```
