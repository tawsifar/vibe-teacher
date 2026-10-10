# Prompt Coach ("Ask your AI better")

**Contents:** 1. Why · 2. The recipe · 3. Rules · 4. Ten examples · 5. Improving the user's own prompt

## 1. Why

Vibe coders don't need to write the fix. They need to **ask well**.
A precise prompt gets a small, safe change. A vague one ("fix my code") gets chaos.

## 2. The recipe (CGCE)

| Part | What to include | Example |
|---|---|---|
| **C**ontext | Exact file(s) and line(s), what the code does now | "In server.js line 9 there is a hard-coded API key." |
| **G**oal | The result in plain words | "Read it from an environment variable instead." |
| **C**onstraints | What must NOT change; scope limits | "Don't change any other behaviour. No new packages." |
| **E**xplain | Ask for a summary and a check | "Explain each change in one line and tell me how to test it." |

## 3. Rules

- One problem per prompt. Big refactors → ask for a plan first, then apply step by step.
- Always name files and lines. Always say "don't change anything else".
- Ask the AI to explain what it changed and how to test it.
- Never put real secrets in a prompt. Refer to them by name (`OPENAI_API_KEY`).
- Put prompts in a quote block starting with 📋 so they're easy to copy.

## 4. Ten examples

1. **Move a secret**
   > 📋 "In server.js line 9, move the hard-coded API key into an environment variable named OPENAI_API_KEY. Read it with process.env.OPENAI_API_KEY, add .env to .gitignore, and create .env.example with the name but no value. Don't change anything else. Explain each change in one line."

2. **Ignore .env**
   > 📋 "Add .env and .env.local to .gitignore. If .env is already tracked by Git, tell me the exact command to stop tracking it without deleting my local file."

3. **Validate input**
   > 📋 "In server.js, the POST /api/todos route (line 26) saves req.body.text without checks. Add server-side validation: text must be a string, 1–200 characters, trimmed. Return status 400 with a friendly JSON error if invalid. No new packages. Explain the change."

4. **Handle fetch errors**
   > 📋 "In public/app.js, wrap each fetch call in try/catch and check res.ok. On failure, show a short message on the page instead of failing silently. Keep the current behaviour when it works."

5. **Hash passwords**
   > 📋 "In the login code (server.js line 38), passwords are compared as plain text. Switch to bcrypt: hash passwords when users are created and use bcrypt.compare on login. Tell me which package to install and why."

6. **Add the first tests**
   > 📋 "Add 3 small tests for the /api/todos routes using Node's built-in test runner (node:test) and no extra packages if possible. Add an npm test script. Explain how to run them."

7. **Split a big file**
   > 📋 "server.js is 400 lines. Don't change code yet: propose a plan to split it into routes/ and services/ folders, listing which functions go where. Wait for my OK before applying."

8. **Fix XSS**
   > 📋 "In public/app.js line 8, to-do text is inserted with innerHTML. Change it to build list items with document.createElement and textContent so user text can't run as code. Same look as before."

9. **Add auth to a route**
   > 📋 "The DELETE /api/todos/:id route has no login check. Add a simple middleware that requires a valid session token and returns 401 otherwise. Apply it only to routes that change data. Explain how it works."

10. **Add a README setup section**
    > 📋 "Add a 'How to run' section to README.md: requirements, install command, how to create .env from .env.example, and the start command. Keep it short and beginner-friendly."

## 5. Improving the user's own prompt (`prompt-coach` with their text)

Show a before/after table:

| | Prompt |
|---|---|
| ❌ Before | "fix the login" |
| ✅ After | "In server.js, POST /api/login (line 38) compares plain-text passwords. Switch to bcrypt hashing… Explain each change." |

Then list what you added in 3 bullets (file + line, clear goal, limits + explanation request).
