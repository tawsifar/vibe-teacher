# Stack pack: Node.js + Express (also Fastify, Koa, Hono, NestJS)

## What it is (5 lines)

> **Node.js** lets JavaScript run on a computer or server, not just in a browser.
> **Express** is a small helper library that turns Node into a web server with addresses (routes).
> Your server starts when someone runs `npm start` / `node server.js`.
> **npm** is the app store for packages; `package.json` is the shopping list.
> When a request arrives, Express finds the matching route and runs its function.

## Typical layout

| Path | Job |
|---|---|
| `server.js` / `index.js` / `app.js` | Front door: creates the app, adds middleware, starts listening on a port |
| `routes/` | Groups of addresses (`routes/todos.js` → `/api/todos`) |
| `controllers/` | The functions that run for each route |
| `services/` | Business rules and talking to the database or outside APIs |
| `models/` | Data shapes (Mongoose schemas, Prisma models) |
| `middleware/` | Guards run before routes: auth checks, logging, error handling |
| `public/` | Files sent straight to the browser (HTML, CSS, images) |
| `.env` | Secrets and settings, read with `process.env.NAME` |
| `package.json` | Dependencies + scripts (`start`, `dev`, `test`) |

## How a request flows

```
Browser --fetch POST /api/todos--> app.use(express.json())   (middleware reads the body)
                                --> app.post('/api/todos', handler)
                                --> handler validates + saves
                                <-- res.status(201).json(todo)
```

`app.use('/api', router)` + `router.post('/todos')` = `POST /api/todos`. Join the paths when tracing.

## Common beginner mistakes (check these)

| Mistake | Why it hurts | Fix idea |
|---|---|---|
| Key typed into `server.js` | Leaks on GitHub | `process.env.NAME` + `.env` + `dotenv` |
| `.env` not in `.gitignore` | Next push leaks it | Add `.env` to `.gitignore` |
| No validation on `req.body` | Junk or harmful data saved | Check type/length, or use `zod`/`joi` |
| `app.use(cors())` with no options | Any site can call the API | `cors({ origin: 'https://your-site.com' })` |
| Async route with no try/catch | Unhandled errors crash the server or hang requests | try/catch + an error middleware |
| `res.send(err)` | Leaks internals | Log the error, send a friendly message |
| Data in a plain array | Lost on restart | A database (SQLite, Postgres, Supabase) |
| Everything in one 500-line file | Hard to change safely | Split into `routes/` + `services/` |
| Hard-coded port 3000 | Hosts assign their own port | `process.env.PORT \|\| 3000` |
| No `start` script | Hosts don't know how to run it | `"start": "node server.js"` |

## Deployment

Usually Render, Railway, Fly.io, or a VPS. Vercel works for serverless functions but not long-running servers.
Set env vars in the host's dashboard; never upload `.env`.

## Related

- NestJS: same ideas, but organised into modules/controllers/services with decorators (`@Get()`).
- Fastify/Koa/Hono: same request → route → reply idea, different syntax.
