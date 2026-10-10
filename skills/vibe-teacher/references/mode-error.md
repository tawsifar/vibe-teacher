# Mode: error "MESSAGE" (explain this error)

## Goal

The user pastes an error. They get: what it means in plain English, the likely cause in THEIR code,
and a prompt to fix it. No panic, no wall of stack trace.

## Procedure

1. Find the **first useful line**: the error type + message (e.g. `TypeError: Cannot read properties of undefined (reading 'map')`).
2. Find the **first stack line inside their project** (skip `node_modules`, `node:internal`). That's the `file:line` to read.
3. Read that code. Work out the real cause.
4. Answer with the format below. Mask any secrets that appear in the pasted text.

## Format

```
## 🧯 Error explained
**In short:** your page tried to loop over a list that hadn't arrived yet.

| | |
|---|---|
| 🏷️ Error type | TypeError (using something the wrong way) |
| 📍 Where | src/App.jsx:14 |
| 🤔 Plain meaning | "I was told to .map() a list, but there was nothing there (undefined)." |
| 🔍 Likely cause | `todos` starts as undefined before fetch finishes |
| 🩹 Fix idea | start with an empty list: useState([]) |

📋 Prompt for your AI: "In src/App.jsx line 14, todos is undefined on first render, so .map crashes. Initialise it to an empty array and show 'Loading…' until the fetch finishes. Explain the change."

👉 Next step: paste the next error · `explain src/App.jsx` · `flow "load the page"`
```

## Common errors cheat sheet

| Error | Plain meaning | Usual cause |
|---|---|---|
| `Cannot find module 'x'` | A package or file is missing | Forgot `npm install`, or wrong path/capital letters |
| `EADDRINUSE :::3000` | The port is already taken | The server is already running in another terminal |
| `X is not defined` | Using a name that was never created | Typo, or missing import |
| `Cannot read properties of undefined` | Using data that isn't there yet | Data not loaded, wrong key name |
| `CORS policy` blocked | The server didn't allow this website to call it | Missing CORS setup, or wrong URL/port |
| `Failed to fetch` / `ECONNREFUSED` | Nobody answered | Server not running, wrong URL |
| `401 Unauthorized` | Not logged in / bad key | Missing or wrong token/API key |
| `404 Not Found` | That address doesn't exist | Route path typo, wrong method (GET vs POST) |
| `500 Internal Server Error` | The server crashed handling it | Look at the server terminal for the real error |
| `SyntaxError: Unexpected token` | The code (or JSON) has a typo | Missing bracket/comma, or HTML returned instead of JSON |
| `Hydration failed` (Next.js) | Server HTML and browser HTML differ | Using `window`/dates/random values during render |
| `ModuleNotFoundError` (Python) | Package not installed | `pip install -r requirements.txt`, or wrong virtual env |
| `IndentationError` (Python) | Spaces are off | Mixed tabs/spaces, misaligned block |
| `permission denied` (Supabase/Firebase) | Security rules said no | RLS policy or Firebase rule blocks this user |
