# sample-express-app

> ⚠️ **Intentionally flawed for testing.** This tiny to-do app has planted problems so
> VIBE Teacher has something to find. Every secret in it is FAKE. Do not deploy it.

Planted issues:

1. A hard-coded (fake) API key in `server.js`.
2. A `.env` file that is **not** listed in `.gitignore`.
3. `POST /api/todos` accepts any input (no validation).
4. `public/app.js` calls `fetch()` with no error handling, and renders text with `innerHTML`.
5. Plain-text password check in `POST /api/login`.
6. No tests.
