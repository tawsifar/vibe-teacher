# Mode: security (red flags for vibe coders)

**Contents:** 1. Tone · 2. Procedure · 3. Red-flag catalogue · 4. Report format · 5. After a leak

## 1. Tone

Calm and practical: "Here's what a stranger could do, and here's the 5-minute fix."
Never scary for its own sake. Never print a full secret: show at most the first 3 and last 3 characters.

## 2. Procedure

1. Run the scanner. Start from `secrets`, `env`, `risks` and `routes`.
2. Read every write route (POST/PUT/PATCH/DELETE), the auth/login code, the `.gitignore`,
   and `.env*` **variable names** (not values) to see what is exposed to the browser.
3. For Supabase/Firebase projects, look for RLS policies (`supabase/migrations/*.sql`, `create policy`)
   or `firestore.rules` / `database.rules.json`. If you can't see them, ask the user to check the dashboard.
4. Go through the catalogue below. Only report what you found, with `file:line`.
5. Fill assets/templates/security-report.md: 🔴 fix now → 🟡 fix soon → 🟢 good things already in place.
6. Every finding gets a 📋 fix prompt (see [prompt-coach.md](prompt-coach.md)).

## 3. Red-flag catalogue

| # | Red flag | How to spot it | Why it matters (1 line) | Severity |
|---|---|---|---|---|
| 1 | **Hard-coded key** | `secrets[]` in a source file | Anyone who sees the code (GitHub, the browser) can use your paid account | 🔴 |
| 2 | **`.env` not ignored** | `env.envInGitignore == false` | The next `git push` uploads every secret | 🔴 |
| 3 | **`.env` committed** | `env.envTrackedByGit == true` | Secrets are already in Git history, even if you delete the file now | 🔴 |
| 4 | **Secret in frontend code** | key used in `src/`, `public/`, client components, or in `NEXT_PUBLIC_*` / `VITE_*` / `REACT_APP_*` vars | Everything in the frontend is downloaded by every visitor | 🔴 |
| 5 | **No server-side validation** | write route uses `req.body.x` / `request.json()` directly | People can send empty, huge or harmful data that your app saves | 🟡→🔴 |
| 6 | **SQL injection** | `risks[sql-string-building]`, query built with `+` or `${}` | Typing `' OR 1=1 --` into a form could read or delete your whole database | 🔴 |
| 7 | **NoSQL injection** | `find(req.body)` / `findOne({ email: req.body.email })` with no type check | Sending `{"$ne": null}` can log in as anyone | 🔴 |
| 8 | **`eval` / `exec`** | `risks[eval]` | Lets text from users run as code on your server | 🔴 |
| 9 | **Open CORS** | `risks[open-cors]` | Any website can call your API from a visitor's browser | 🟡 |
| 10 | **Missing auth on routes** | routes that change or read private data with no session/token check | Anyone who guesses the URL can delete or read data | 🔴 |
| 11 | **Plain-text passwords** | passwords saved or compared directly | One leak exposes every user's password (people reuse them) | 🔴 |
| 12 | **Supabase RLS off** | tables with no `enable row level security` / no policies; anon key in frontend | The public anon key can read and write every row | 🔴 |
| 13 | **Firebase rules open** | `allow read, write: if true;` or test-mode rules | Anyone can read/write your whole database | 🔴 |
| 14 | **Verbose error leaks** | `res.send(err)` / stack traces / `debug=True` | Error details hand attackers a map of your app | 🟡 |
| 15 | **XSS via innerHTML** | `risks[innerHTML]` with user data | A to-do named `<img onerror=…>` can run code in other users' browsers | 🟡 |
| 16 | **Outdated dependencies** | very old versions in `package.json`; suggest `npm audit` | Known holes in old packages are public knowledge | 🟡 |
| 17 | **Tokens in localStorage** | `localStorage.setItem('token'` | Any injected script can steal the login token | 🟡 |
| 18 | **No rate limiting on login** | login route with no limiter | Bots can try thousands of passwords | 🟡 |

Good things to praise when present: `.env` ignored, `.env.example`, validation library (zod, joi, pydantic),
hashed passwords (bcrypt, argon2), auth middleware, RLS policies, helmet, rate limiting.

## 4. Report format (assets/templates/security-report.md)

- Header badge: `🛡️ Safety check: 2 🔴 · 3 🟡 · 4 🟢`.
- One table per severity: # | Problem | Where (`file:line`) | What a stranger could do | Fix time.
- Under each 🔴: the 📋 fix prompt.
- A "Real scanners" line: "For extra safety, turn on GitHub secret scanning and Dependabot, and run `npm audit` (or `pip-audit`)."
- `👉 Next step:` `fix-plan`, `apply fix 1`, `explain .gitignore`.

## 5. After a leak (always include when a real key was committed or pushed)

1. **Rotate the key** (make a new one, delete the old one) in the provider's dashboard. Deleting the file is not enough.
2. Move the new key into `.env`, add `.env` to `.gitignore`, add `.env.example` with empty values.
3. Use `process.env.NAME` (Node) / `os.environ["NAME"]` (Python) in code.
4. Optional: clean Git history with `git filter-repo` or BFG. Explain that rotation matters more.

Prompt to offer:
> "Move the hard-coded key in FILE:LINE into an environment variable named NAME. Read it with
> process.env.NAME, add .env to .gitignore, create .env.example with NAME= and no value, and tell me
> which steps I must do myself (like rotating the key). Explain each change in one line."
