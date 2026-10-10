# Mode: flow "ACTION" (what happens when I click…)

**Contents:** 1. Goal · 2. How to trace · 3. Output format · 4. Stack patterns · 5. When the trail breaks

## 1. Goal

Turn one user action ("click Login", "add a to-do", "submit the form") into a numbered story
from the button to the database and back. This is the biggest "aha" moment, so make it vivid.

## 2. How to trace

1. **Find the trigger in the UI.** Search for the button or form text the user mentioned
   (e.g. `Login`), then its handler: `onClick`, `onSubmit`, `addEventListener('submit'`, `action=`, `<form`.
2. **Find the request.** Inside the handler: `fetch(`, `axios.`, `supabase.from(`, Firebase calls,
   server actions (`'use server'`), form `action` URLs.
3. **Match the URL to a route.** Use scanner `routes` (method + path) to find `file:line`.
4. **Follow the route.** Middleware → handler → services/helpers → database call.
5. **Follow the answer back.** Status code + JSON → the frontend code that reads it → what changes on screen.
6. Note risks along the way (no validation, no error handling, secrets) with `file:line`.

## 3. Output format (assets/templates/flow.md)

- `**In short:**` the whole trip in one sentence.
- A numbered steps table: # | Where | What happens (plain English) | File:line. 5–10 rows.
- An ASCII sequence diagram:

```
 You        Browser (app.js)        Server (server.js)        Data
  |  click     |                          |                     |
  |----------->|  POST /api/login         |                     |
  |            |------------------------->|  check email+pass   |
  |            |                          |-------------------->|
  |            |   200 + token (JSON)     |<--------------------|
  |            |<-------------------------|                     |
  | "Logged in"|                          |                     |
```

- "⚠️ Weak spots on this path" (up to 3 bullets with file:line).
- `❓ Quick check:` e.g. "What does the user see if step 4 fails?"
- `👉 Next step:` trace another action, `fix-plan`, `explain FILE`.

Explain on first use: **request**, **response**, **HTTP method** (GET = read, POST = create/send,
PUT/PATCH = update, DELETE = remove), **status code** (200 OK, 201 created, 400 bad input,
401 not logged in, 404 not found, 500 server broke), **JSON** (data written as labelled boxes).

## 4. Stack patterns

**Express / Node:** `fetch('/api/x', { method: 'POST' })` → `app.post('/api/x', handler)`, or
`router.post('/x')` mounted with `app.use('/api', router)` (join the two paths!) → handler →
`res.json(...)` / `res.status(...)`.

**Next.js app router:** client component `fetch('/api/x')` → `app/api/x/route.js` exported `POST()` →
`Response.json(...)` / `NextResponse.json(...)`. Server actions: a `'use server'` function called straight
from a form `action={fn}`. There's no URL; explain it as "a direct phone line to the kitchen".
Pages router: `pages/api/x.js` default export `handler(req, res)`.

**React + Supabase/Firebase (no own backend):** the browser talks straight to the hosted database:
`supabase.from('todos').insert(...)`. Explain that the database's security rules (RLS / Firebase rules)
are the only guard, and check whether they exist (see [mode-security.md](mode-security.md)).

**Flask / FastAPI:** `fetch('/login')` → `@app.route('/login', methods=['POST'])` or `@app.post('/login')` →
function → `return jsonify(...)` / `return {...}`. Django: `urls.py` path → view function → template or JSON.

**Plain HTML form:** `<form action="/subscribe" method="post">` → whatever server handles it, or a
third-party form service URL. If there's no server, say the click only changes the page in the browser.

## 5. When the trail breaks

- Can't find the button → list the 5 closest UI strings and ask which one.
- URL is built dynamically (`${API}/items`) → search for the base URL variable and say you followed it.
- Request goes to an external API → "here the order leaves your restaurant and goes to SERVICE".
- Never guess silently. Mark uncertain steps "(probably)" and say what you'd check.
