# Sample outputs

What VIBE Teacher produces for [`../sample-express-app`](../sample-express-app), following
`SKILL.md`, the rubric in `references/mode-review-score.md` and the templates in `assets/templates/`.

| File | Prompt |
|---|---|
| [score-card.md](score-card.md) | "rate my code out of 100" |
| [tour-lesson-1.md](tour-lesson-1.md) | "give me a tour" |
| [fix-plan.md](fix-plan.md) | "how do I improve it?" |
| [flow-login.md](flow-login.md) | "what happens when I click Login?" |
| [features.md](features.md) | "what should I add next?" |

The sample app is scanned **as its own project** (as if it were its own repo), so the
`.env` is "not ignored" but not "committed". Inside this repo the fixture `.env` is committed on
purpose so the tests can find it; every value in it is fake.

The score arithmetic is: 0 + 15 + 15 + 4 + 5 + 10 + 10 + 3 + 3 = 65, capped to 59 because data-changing
routes have no auth even though the app has users.
