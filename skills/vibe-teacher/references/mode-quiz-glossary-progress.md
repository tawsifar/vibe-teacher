# Modes: quiz, glossary and progress

**Contents:** 1. Quiz · 2. XP rules · 3. Glossary · 4. Progress view · 5. VIBE_NOTES.md rules

## 1. Quiz (assets/templates/quiz.md)

- Exactly **3 questions** per round, about THEIR project (not general trivia).
- Mix: 1 "where is it?" (which file), 1 "what happens if…?", 1 concept (route, API, `.env`…).
- Multiple choice A/B/C. One clearly right answer. Wrong options should be believable, not silly.
- Show all 3 at once. Wait for answers ("1A 2C 3B" or one at a time).
- Then: ✅/❌ per question, a 1-line explanation each (point to `file:line`), XP earned, total XP.
- A wrong answer is a teaching moment: "Close! It's actually B, because…". Never mock.
- After the tour's last lesson, the quiz covers the whole tour.

Example question:
```
**2.** If you stop the server (close the terminal running `node server.js`), what happens when you click Add?
A) The to-do is saved anyway   B) Nothing is saved and the page can't load the list   C) The browser saves it to the database
```

## 2. XP rules

| Action | XP |
|---|---|
| Finish a lesson | +10 |
| Correct quiz answer | +5 |
| Apply a fix from the fix plan | +20 |
| Learn a new glossary term (asked about it) | +2 |
| Score goes up since last time | +1 per point gained |

Levels for fun: 0–49 🌱 Seedling · 50–149 🌿 Sprout · 150–299 🌳 Builder · 300+ 🚀 Shipper.

## 3. Glossary (assets/templates/glossary-card.md)

- `glossary TERM` → one card: plain meaning (1 line), analogy (1 line), where it appears in THEIR
  project (`file:line` if found), a "don't confuse with" line if useful.
- Look the term up in [glossary.md](glossary.md) first. If it's missing, write a card in the same style.
- `glossary` alone → table of terms already explained in this conversation (and in `VIBE_NOTES.md` if it exists).
- New jargon used in any answer counts as "learned" once explained.

## 4. Progress view

```
## 📈 Your progress
| | |
|---|---|
| Level | 🌿 Sprout (85 XP) |
| Lessons | 4 of 7 done ✅✅✅✅⬜⬜⬜ |
| Terms learned | 12 (API, route, JSON, …) |
| Last score | 71/100 (C 🟡), up from 54 🎉 |
| Fixes applied | 3 |
👉 Next step: `next` (Lesson 5) · `quiz` · `score`
```

## 5. VIBE_NOTES.md rules

- Only with permission (ask once). Use assets/templates/notes-journal.md.
- Location: the project root. Remind the user they can add it to `.gitignore` if they want it private.
- Update it after each lesson, quiz, score or applied fix. Keep score history as a table with dates (YYYY-MM-DD).
- Never store secrets, full code, or personal data in it.
- If it exists when a conversation starts, read it to restore level, language, lesson and XP,
  and greet them: "Welcome back! Last time you finished Lesson 3 and scored 71."
