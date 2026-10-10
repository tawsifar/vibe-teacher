<!-- Sample output: "give me a tour" on examples/sample-express-app. Small project (4 source files), so the tour has 3 lessons. -->

📚 **Your tour plan** (small project, so 3 short lessons)

| # | Lesson |
|---|---|
| 1 | The Big Picture |
| 2 | How the parts talk (one click, start to finish) |
| 3 | Recap + quiz |

## 🗺️ Lesson 1 of 3 — The Big Picture

**In short:** your app is a to-do website: a browser "dining room" (frontend) talks to an Express "kitchen" (backend) that keeps the to-dos on a whiteboard (memory).

🍽️ **The restaurant analogy**

| Restaurant | Your project | Where |
|---|---|---|
| Dining room | **Frontend** (what users see) | `public/index.html`, `public/style.css` |
| Waiter | **API** (carries requests and answers) | `fetch('/api/todos')` in `public/app.js` |
| Kitchen | **Backend** (does the work) | `server.js` |
| Whiteboard | **In-memory data** (wiped when the kitchen closes) | `let todos = [...]` in `server.js:14` |
| Recipe safe | **`.env`** (secret settings) | `.env` |

```
 [Browser] --click Add--> [public/app.js] --POST /api/todos--> [server.js]
     ^                                                            |
     |                                                     saves to todos[]
     +------------------ JSON list of to-dos <--------------------+
```

📂 **Where it lives**
- `server.js` — starts the kitchen and answers 5 addresses like `/api/todos` and `/api/login`
- `public/app.js` — the waiter code in the browser: sends orders, shows the list
- `public/index.html` — the page layout: login form, add form, list
- `package.json` — the shopping list: just **Express** (a helper that turns Node.js into a web server)

📖 **New words:** **Node.js** (lets JavaScript run on a computer, not just in a browser; `npm start` runs `node server.js` with it) · **route** (an address on your server, like `/api/todos`)

✅ **Key takeaway:** the browser never touches the data directly; it always asks the waiter (API) at `/api/...`.

❓ **Quick check:** if you stop the server, what happens to your to-dos?

👉 **Next step:** type `next` for Lesson 2: How the parts talk · or `explain server.js` · or `score`
