<!-- Sample output: "how do I improve it?" on examples/sample-express-app, after the score card. -->

## 🛠️ Your Fix Plan

**In short:** fixes 1–6 could take you from 59 to about 90. Start with the green ones; they take minutes. ("pts" = the deduction each fix removes. The total can only pass 59 once fix 6 is done, because of the auth cap.)

### 🟢 Quick wins (15 minutes or less each)

**1. Move the API key into `.env`** · +8 pts, lifts the 69 cap · `server.js:9`
Why: anyone who sees your code on GitHub can use (and bill) your account.
> 📋 **Prompt for your AI:** "In server.js line 9, move the hard-coded API key into an environment variable named OPENAI_API_KEY. Load it with the dotenv package and read it with process.env.OPENAI_API_KEY. Create .env.example with OPENAI_API_KEY= and no value. Don't change anything else. Explain each change in one line, and tell me what I must do myself (like rotating the key)."

**2. Stop Git from uploading `.env`** · +4 pts · `.gitignore:1`
Why: your next `git push` would publish every secret in `.env`.
> 📋 **Prompt for your AI:** "Add .env to .gitignore. If .env is already tracked by Git, give me the exact command to stop tracking it without deleting my local copy."

**3. Show a message when the server is down** · +6 pts · `public/app.js:6`, `:16`
Why: right now the list just stays empty and nobody knows why.
> 📋 **Prompt for your AI:** "In public/app.js, wrap each fetch call in try/catch and check res.ok. If it fails, show a short red message on the page like 'Can't reach the server, try again'. Keep everything else the same."

**4. Add "How to run" to the README** · +2 pts · `README.md`
Why: future you (and friends) will know how to start the app in 30 seconds.
> 📋 **Prompt for your AI:** "Add a short 'How to run' section to README.md: Node.js 18+, npm install, copy .env.example to .env, npm start, open http://localhost:3000."

### 🟡 Medium (1–2 hours)

**5. Check input on the server, and hash passwords** · +6 pts · `server.js:26`, `:39`
Why: people can save empty or giant to-dos, and one leak would expose every password.
> 📋 **Prompt for your AI:** "In server.js: (1) in POST /api/todos (line 26), require text to be a string of 1–200 characters after trimming, and return 400 with a friendly JSON error otherwise; (2) in POST /api/login (line 38), store passwords as bcrypt hashes and use bcrypt.compare. Explain each change in one line."

**6. Make the login actually protect your data** · +5 pts, lifts the 59 cap · `server.js:26`, `:32`
Why: today anyone can delete any to-do, logged in or not.
> 📋 **Prompt for your AI:** "Add a small middleware in server.js that checks the token from POST /api/login (sent in an Authorization header) and returns 401 if it's missing or wrong. Apply it to POST and DELETE /api/todos only. Update public/app.js to send the token. Explain how it works."

### 🔴 Big refactors (plan first)

**7. Save to-dos in a real database** · makes data survive restarts
Why: the to-do list lives in memory (`server.js:14`), so it vanishes every restart.
> 📋 **Prompt for your AI:** "Don't change code yet. Propose a step-by-step plan to store to-dos in SQLite (or Supabase), including which files change. Wait for my OK before applying."

### ✅ Checklist
- [ ] 1. Key → `.env`
- [ ] 2. `.env` → `.gitignore`
- [ ] 3. Friendly error messages
- [ ] 4. README "How to run"
- [ ] 5. Input checks + hashed passwords
- [ ] 6. Token check on write routes
- [ ] 7. Plan a real database

🏢 **Big Tech Corner:** teams ship each fix as its own small commit ("Move API key to env var"), so any change is easy to understand and undo.

👉 **Next step:** `apply 1` (I'll make fix 1 and show you the change) · `prompt-coach` · `score` again after fixing
