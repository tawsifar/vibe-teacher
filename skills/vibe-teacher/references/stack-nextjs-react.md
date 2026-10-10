# Stack pack: Next.js, React and Vite (also Vue, Svelte, Angular, Astro)

**Contents:** 1. React · 2. Vite · 3. Next.js · 4. Request flow · 5. Common mistakes · 6. Deployment

## 1. React (5 lines)

> **React** is a library for building web pages out of reusable pieces called **components**.
> Each component is a function that returns what the page should look like (JSX, which looks like HTML).
> Components remember things with **state** (`useState`) and get settings through **props**.
> When state changes, React redraws just that part of the page.
> React only handles the page; it needs a server or a hosted backend for data.

## 2. Vite

> **Vite** is a fast build tool: `npm run dev` gives a live-reloading local site (usually port 5173),
> `npm run build` makes optimised files in `dist/`. Vite apps are frontend-only unless paired with a server.

| Path | Job |
|---|---|
| `index.html` | The single HTML page everything loads into |
| `src/main.jsx` | Front door: mounts the React app into the page |
| `src/App.jsx` | The top-level component |
| `src/components/` | Reusable building blocks |
| `vite.config.js` | Build tool settings (proxy to backend, plugins) |
| `.env` with `VITE_*` | **Public** settings baked into the browser bundle |

## 3. Next.js (5 lines)

> **Next.js** is a framework built on React that adds pages, routing and a built-in backend.
> Each folder in `app/` becomes a web address; `page.jsx` is what shows there.
> Files named `route.js` inside `app/api/` are backend endpoints (they run on the server).
> Components run on the server by default; `'use client'` marks ones that run in the browser.
> It's frontend and backend in one project, usually deployed to Vercel.

| Path | Job |
|---|---|
| `app/page.jsx` | Home page (`/`) |
| `app/about/page.jsx` | The `/about` page |
| `app/layout.jsx` | Shared frame around pages (header, fonts) |
| `app/api/hello/route.js` | Backend endpoint `GET/POST /api/hello` |
| `app/(group)/` | Folder in brackets: organises files, doesn't change the URL |
| `app/[id]/page.jsx` | Dynamic page: `[id]` is filled from the URL |
| `pages/` | Older "pages router": `pages/api/*.js` are endpoints |
| `middleware.js` | Runs before requests (often auth redirects) |
| `next.config.js` | Framework settings |
| `.env.local` | Secrets (server-only unless prefixed `NEXT_PUBLIC_`) |

## 4. Request flow

```
Client component (button) --fetch('/api/todos')--> app/api/todos/route.js  export async function POST()
                                                --> database / outside API
                          <--- Response.json(...) ---
Server component --> reads the database directly while building the page (no fetch needed)
Form action={serverAction} --> 'use server' function runs on the server
```

## 5. Common beginner mistakes

| Mistake | Why it hurts | Fix idea |
|---|---|---|
| Secret in `NEXT_PUBLIC_*` / `VITE_*` / `REACT_APP_*` | These are shipped to every visitor | Keep secrets server-only; call them from a route/server action |
| Calling OpenAI/Stripe straight from a client component | Key ends up in the browser | Move the call into `app/api/.../route.js` |
| `'use client'` on everything | Bigger, slower pages; secrets risk | Only on components that need clicks/state |
| No loading/error state around fetch | Blank or frozen screen | `loading.jsx`, `error.jsx`, try/catch |
| `useEffect` fetch with no dependency array | Infinite request loop | Add `[]` or the right dependencies |
| Huge images via `<img>` | Slow pages | Next's `<Image>` or compressed images |
| Route handler with no input checks | Junk data saved | Validate with `zod` |
| Using `window` during server render | Hydration errors | Use it in `useEffect` or a client component |
| `dangerouslySetInnerHTML` with user text | XSS | Render as text, or sanitise |

## 6. Deployment

Next.js → Vercel (or Netlify). Vite/React → Netlify, Vercel, GitHub Pages, Cloudflare Pages.
Env vars go in the host's settings. Remember: anything public-prefixed is visible to everyone.

**Vue / Svelte / Angular / Astro:** same ideas. Components + build tool; SvelteKit and Nuxt add
file-based routing and server endpoints like Next (`+server.js` in SvelteKit, `server/api/` in Nuxt).
