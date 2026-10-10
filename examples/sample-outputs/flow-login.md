<!-- Sample output: 'what happens when I click Login?' on examples/sample-express-app. -->

## 🔄 What happens when you click Login

**In short:** your browser sends your email and password to the kitchen at `/api/login`, the kitchen compares them with its list, and sends back a "pass" (token) that the browser keeps.

| # | Where | What happens | File:line |
|---|---|---|---|
| 1 | 🖱️ You | Type email + password, click **Login** | `public/index.html:15` |
| 2 | 🌐 Browser | The form's submit handler runs and stops the page from reloading | `public/app.js:24` |
| 3 | 📨 Request | **POST** `/api/login` with `{ email, password }` as **JSON** | `public/app.js:26` |
| 4 | 🍳 Server | Express reads the JSON body and finds the matching route | `server.js:11`, `server.js:38` |
| 5 | 🧊 Data | Looks for a user with the same email **and** the same plain-text password | `server.js:39` |
| 6 | 📬 Response | Match → **200** + `{ token }`. No match → **401** + `{ error }` | `server.js:40–41` |
| 7 | ✨ Screen | Saves the token in `localStorage` and pops up "Logged in!" or the error | `public/app.js:35–36` |

```
 You        Browser (app.js)          Server (server.js)        users list
  | click     |                          |                         |
  |---------->|  POST /api/login         |                         |
  |           |------------------------->|  find email + password  |
  |           |                          |------------------------>|
  |           |   200 + token (JSON)     |<------------------------|
  |           |<-------------------------|                         |
  | "Logged in!"                         |                         |
```

📖 **New words:** **request** (the browser asking) · **response** (the server answering) · **status code** (a 3-digit result: 200 = OK, 401 = not logged in) · **token** (a pass that proves you logged in)

⚠️ **Weak spots on this path**
- `server.js:39` — passwords are stored and compared as plain text; one leak exposes them all. 🔴
- `server.js:41` — the "token" is just `demo-token-` + your email, so anyone can fake it, and no route ever checks it. 🔴
- `public/app.js:26` — no try/catch: if the server is off, the click silently does nothing. 🟡

❓ **Quick check:** what does the user see if step 4 never happens because the server is off?

👉 **Next step:** `flow "click Add"` · `explain server.js` · `fix-plan`
