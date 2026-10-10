# Mode: features (what to build next)

## Goal

Suggest 3–5 features that fit THIS app, ranked so the user knows what to build first.
Each one comes with a starter prompt they can paste into their AI.

## Procedure

1. Work out what the app is and who uses it (Lesson 1 knowledge, routes, pages, README).
2. Look for gaps users would feel: no login, no search, no saving, no mobile layout, no feedback
   when something fails, no empty states, no undo, no sharing, no dark mode, no onboarding.
3. Prefer features that also fix weaknesses (e.g. "real database" when data lives in memory).
4. Rank by **impact ÷ effort**. Put at least one 🟢 easy idea first.
5. Fill assets/templates/features.md.

## Scales

| Impact | Meaning |
|---|---|
| ⭐ | Nice touch |
| ⭐⭐ | Users will notice and like it |
| ⭐⭐⭐ | Changes how useful the app is |

| Effort | Meaning |
|---|---|
| 🟢 | Under 1 hour with an AI helper |
| 🟡 | An afternoon |
| 🔴 | A weekend or more; plan first |

## Idea bank (pick what fits, never list all)

| Idea | Fits when | Impact | Effort |
|---|---|---|---|
| Friendly error + loading states | fetches with no feedback | ⭐⭐ | 🟢 |
| Empty-state message ("No to-dos yet — add one!") | lists | ⭐ | 🟢 |
| Dark mode toggle | any UI | ⭐ | 🟢 |
| Search / filter | lists with 20+ items | ⭐⭐ | 🟢 |
| Edit and undo | create/delete exists but no edit | ⭐⭐ | 🟡 |
| Save data in a real database | data in memory/JSON file | ⭐⭐⭐ | 🟡 |
| Real login (Supabase Auth, Clerk, NextAuth) | multiple users, fake auth | ⭐⭐⭐ | 🟡 |
| Mobile-friendly layout | fixed widths, no media queries | ⭐⭐ | 🟡 |
| Share link / export (CSV, PDF) | user-made content | ⭐⭐ | 🟡 |
| Email or push reminders | dates/tasks | ⭐⭐ | 🔴 |
| AI helper inside the app | text-heavy apps | ⭐⭐⭐ | 🟡 |
| Analytics (privacy-friendly) | public sites | ⭐ | 🟢 |
| Onboarding tour for new users | 3+ screens | ⭐⭐ | 🟡 |

## Card format

```
### 💡 1. Friendly error messages   Impact ⭐⭐  Effort 🟢
**Why users love it:** they know what went wrong instead of staring at a frozen screen.
**Where it goes:** public/app.js (the fetch calls at lines 6 and 15)
📋 Starter prompt: "In public/app.js, wrap every fetch call in try/catch. On failure, show a small
red message under the form saying what went wrong in plain words. Don't change anything else.
Explain each change in one line."
```

End with: `👉 Next step: pick a number to get a step-by-step plan, or type score to see your current health.`
