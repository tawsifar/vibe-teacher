# Stack pack: Supabase and Firebase (hosted backends)

## What they are (5 lines)

> **Supabase** and **Firebase** are "backend in a box": a hosted database, login, file storage and APIs.
> Your frontend talks to them directly with a small library, so you may have no server of your own.
> That means the database's **security rules** are your only bouncer.
> Supabase uses a Postgres (SQL) database with **Row Level Security (RLS)** policies.
> Firebase uses Firestore (documents) with **Security Rules** written in `firestore.rules`.

## Keys explained (the #1 confusion)

| Key | Safe in the browser? | Why |
|---|---|---|
| Supabase `anon` / publishable key | ✅ Yes, **only if RLS is on** with policies | It's meant to be public; RLS limits what it can do |
| Supabase `service_role` / secret key | ❌ Never | It bypasses RLS: full read/write of everything |
| Firebase web config (`apiKey`, `projectId`) | ✅ Yes, **only if rules are locked** | It identifies the project; rules do the protecting |
| Firebase Admin SDK service account JSON | ❌ Never | Full admin access |

## Typical layout

| Path | Job |
|---|---|
| `src/lib/supabase.js` / `firebase.js` | Creates the client with the project URL + public key |
| `supabase/migrations/*.sql` | Table definitions and RLS policies |
| `supabase/functions/` | Edge functions (your own small backend) |
| `firestore.rules` / `database.rules.json` | Firebase security rules |
| `firebase.json` | Firebase hosting/functions config |
| `functions/` | Firebase Cloud Functions (server code) |

## How a request flows

```
Button --> supabase.from('todos').insert({ text })   (browser, with anon key + user's session)
       --> Supabase checks RLS policy: "user_id = auth.uid()"?
       --> saved, or "permission denied"
```

## Common beginner mistakes (security first)

| Mistake | Why it hurts | How to spot / fix |
|---|---|---|
| RLS disabled on a table | Anyone with the public key can read/write all rows | No `enable row level security` in migrations; enable it + add policies |
| RLS on but no policies | Everything is blocked (confusing "empty results") | Add `create policy` for select/insert/update/delete |
| Policy `using (true)` for writes | Same as no protection | Use `auth.uid() = user_id` |
| `service_role` key in frontend or `NEXT_PUBLIC_*` | Total database takeover | Move to server-only code; rotate it |
| Firebase `allow read, write: if true;` | Whole database public | `if request.auth != null && request.auth.uid == userId` |
| Firebase test-mode rules left on | They expire, then break, or stay open | Write real rules before launch |
| Trusting data from the client (prices, roles) | Users can edit requests | Check on the server (Edge/Cloud Function) |
| Admin SDK JSON committed | Full admin leak | `.gitignore` it; rotate the service account |

If you can't see the rules in the repo, ask: "Can you open Supabase → Authentication → Policies (or
Firebase → Firestore → Rules) and paste what's there?" Don't assume they're safe or unsafe.

## Deployment

The frontend is hosted anywhere (Vercel, Netlify, Firebase Hosting). The database is already online.
Use separate projects for development and production when possible.
