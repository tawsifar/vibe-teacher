<!-- Sample output: "what should I add next?" on examples/sample-express-app. -->

## 💡 What to build next

**In short:** your to-do app works; these ideas make it something people keep using (and fix a weak spot or two on the way).

| # | Idea | Impact | Effort | Why users love it |
|---|---|---|---|---|
| 1 | Friendly error + loading messages | ⭐⭐ | 🟢 | They know what's happening instead of staring at a blank list |
| 2 | Tick off and edit to-dos | ⭐⭐ | 🟢 | Right now you can add and delete, but not mark done from the page |
| 3 | Save to-dos in a real database | ⭐⭐⭐ | 🟡 | Their list survives a server restart |
| 4 | Real login with per-user lists | ⭐⭐⭐ | 🟡 | Everyone gets their own private list |
| 5 | Dark mode | ⭐ | 🟢 | Easier on the eyes at night |

### 💡 1. Friendly error + loading messages   Impact ⭐⭐  Effort 🟢
**Why users love it:** a "Loading…" or "Can't reach the server" message beats a frozen screen.
**Where it goes:** `public/app.js` (fetch calls at lines 6, 16, 26), `public/index.html`
> 📋 **Starter prompt:** "In public/app.js, show 'Loading…' while to-dos load, and a short red message if any fetch fails (use try/catch and res.ok). Add an empty-state line 'No to-dos yet — add one!'. Don't change anything else. Explain each change in one line."

### 💡 2. Tick off and edit to-dos   Impact ⭐⭐  Effort 🟢
**Why users love it:** checking things off is the whole joy of a to-do list.
**Where it goes:** `server.js` (new `PATCH /api/todos/:id` route), `public/app.js`
> 📋 **Starter prompt:** "Add a PATCH /api/todos/:id route in server.js that can change text and done (validate both). In public/app.js, add a checkbox and an edit button to each item that call it. Build list items with textContent, not innerHTML. Explain each change."

### 💡 3. Save to-dos in a real database   Impact ⭐⭐⭐  Effort 🟡
**Why users love it:** nothing disappears when the server restarts.
**Where it goes:** `server.js:14` (the in-memory `todos` array)
> 📋 **Starter prompt:** "Don't change code yet. Propose a plan to store to-dos in SQLite using better-sqlite3, keeping the same API routes. List the files that change. Wait for my OK."

🔑 **Legend:** Impact ⭐ nice · ⭐⭐ noticed · ⭐⭐⭐ game-changer — Effort 🟢 under 1 hour · 🟡 an afternoon · 🔴 a weekend+

👉 **Next step:** pick a number for a step-by-step plan · `fix-plan` (fix the leaked key first!) · `score`
