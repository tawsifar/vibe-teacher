# Mode: tour (architecture lessons)

**Contents:** 1. Goal · 2. Before the first lesson · 3. Lesson plan · 4. Lesson recipe ·
5. The restaurant mapping · 6. Lesson-by-lesson notes · 7. The `next` protocol · 8. Quick checks

## 1. Goal

The user finishes the tour able to say, in their own words:
"My app has a ___ that users see, a ___ that does the work, and keeps data in ___."

## 2. Before the first lesson

1. Run the scanner (Step 0 in SKILL.md) if you haven't yet.
2. Read the entry points (`entryPoints`) and the main route file(s).
3. Decide the lesson count:
   - `summary.teachInLessons` true → the 7-lesson plan below.
   - Otherwise → 2–3 lessons: (1) Big picture, (2) How the parts talk, (3) Recap + quiz.
4. Show the plan in a small table, then start Lesson 1 right away.

## 3. Lesson plan (big projects)

| # | Title | Must answer |
|---|---|---|
| 1 | The Big Picture | What is this app? What are its main parts? |
| 2 | The Frontend | What does the user see? Which files draw it? |
| 3 | The Backend | What runs on the server? What are the routes? |
| 4 | API & Data Flow | How does a click travel to the server and back? |
| 5 | Database / Storage | Where is data kept? How is it read and saved? |
| 6 | Config, Secrets & Deployment | What is `.env`? How does the app go live? |
| 7 | Recap + Quiz | What did we learn? 3 questions, XP. |

Skip lessons that don't apply (a static site has no backend or database). Say so in one line:
"Your site has no backend — it's like a printed menu, no kitchen needed. Skipping to Lesson 6."

## 4. Lesson recipe (use assets/templates/lesson.md)

Every lesson has these parts, in this order, in 40 lines or fewer:

1. `## 🗺️ Lesson N of M — TITLE`
2. `**In short:**` one sentence.
3. An analogy table (up to 6 rows): Real-world thing | Your project | Folder/file.
4. One ASCII diagram (up to 8 lines, 80 characters wide).
5. "📂 Where it lives": 2–5 bullets, each a path plus its plain job.
6. `✅ Key takeaway:` one bold line.
7. `❓ Quick check:` one question (answer it only if they reply).
8. `👉 Type next for Lesson N+1: TITLE` plus 1–2 other options.

## 5. The restaurant mapping (default analogy)

| Restaurant | Software term | Typical place in code |
|---|---|---|
| Dining room | **Frontend** (what users see) | `src/`, `public/`, `app/`, `pages/`, `*.html` |
| Menu | **UI / pages** | components, pages |
| Waiter | **API** (carries requests and answers) | `fetch()` calls → `/api/*` routes |
| Order ticket | **Request** (what the browser asks for) | the URL + data sent |
| Kitchen | **Backend / server** (does the work) | `server.js`, `app.py`, `app/api/` |
| Chef's recipes | **Business logic** (the rules) | services, helpers |
| Fridge / pantry | **Database** (keeps data) | Supabase, Firebase, Postgres, MongoDB, a JSON file |
| Locked recipe safe | **`.env`** (secret settings) | `.env` (must stay off GitHub) |
| Opening the restaurant | **Deployment** (putting it online) | Vercel, Netlify, Render, Railway |

See [analogies.md](analogies.md) when this one doesn't fit (post office, phone call, library).

## 6. Lesson-by-lesson notes

**Lesson 1 – Big picture.** Guess what the app is from page titles, route names and README.
Name the stack in one line ("built with React and Express"). Draw the full loop:
browser → frontend → API → backend → database → back.

**Lesson 2 – Frontend.** List the pages users can visit and which file draws each.
Explain **component** (a reusable piece of the page, like a LEGO brick) for React/Vue/Svelte.

**Lesson 3 – Backend.** Show the scanner `routes` as: Address | What it does | File:line.
Explain **route** and **server**. Mention the runtime (see SKILL.md "Explaining the runtime").

**Lesson 4 – API & data flow.** Trace ONE real action end-to-end with numbered steps
(a short version of [mode-flow.md](mode-flow.md)). Explain **JSON** and **status code**.

**Lesson 5 – Database.** Name where data lives. If it's an in-memory array, say plainly:
"Your to-dos vanish when the server restarts — like writing orders on a whiteboard."

**Lesson 6 – Config & deployment.** Explain `.env` and **environment variables** using scanner `env` facts.
If `.env` isn't ignored or secrets were found, flag it gently with 🔴 and point to `security` mode.
Mention how this stack is usually deployed.

**Lesson 7 – Recap + quiz.** A 5-row recap table (Part | What it does | Where),
then a 3-question quiz (assets/templates/quiz.md). Award XP.

## 7. The `next` protocol

- Keep track of the current lesson and the total in the conversation.
- `next` → current + 1. `back` → current − 1 (repeat it, shorter). `lesson N` → jump.
- After the last lesson: congratulate, show XP, offer `score`, `flow`, `quiz`.
- If the user asks a side question mid-tour, answer it briefly, then:
  "👉 Type next to continue with Lesson N+1."

## 8. Quick checks (examples)

- "If the kitchen is closed (server off), what will the user see?"
- "Which file would you open to change the page title?"
- "Where should a secret API key live: in `app.js` or in `.env`?"
- "When you click Add, does the browser talk to the database directly?" (No, it goes through the API.)
