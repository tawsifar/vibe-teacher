## 🛡️ Safety Check — {{PROJECT_NAME}}

**In short:** {{ONE_SENTENCE — e.g. "One leaked key needs fixing today; the rest are easy upgrades."}}

`🛡️ {{N_RED}} 🔴 fix now · {{N_YELLOW}} 🟡 fix soon · {{N_GREEN}} 🟢 already good`

### 🔴 Fix now
| # | Problem | Where | What a stranger could do | Fix time |
|---|---|---|---|---|
| 1 | {{PROBLEM}} (`{{MASKED_PREVIEW}}`) | `{{FILE}}:{{LINE}}` | {{IMPACT}} | {{MINUTES}} |

> 📋 **Prompt for your AI:** "{{FIX_PROMPT}}"

{{IF_KEY_COMMITTED}} 🔁 **Important:** this key was committed, so it may already be copied. **Rotate it** (make a new key and delete the old one in the provider's dashboard). Deleting the file is not enough.

### 🟡 Fix soon
| # | Problem | Where | Why it matters | Fix time |
|---|---|---|---|---|
| 2 | {{PROBLEM}} | `{{FILE}}:{{LINE}}` | {{WHY}} | {{TIME}} |

### 🟢 Already good
- ✅ {{GOOD_THING}}
- ✅ {{GOOD_THING}}

🔎 **Real scanners:** for extra safety, turn on GitHub secret scanning and Dependabot, and run `npm audit` (or `pip-audit`). I'm a beginner safety net, not a full audit.

👉 **Next step:** `apply 1` · `fix-plan` · `explain .gitignore`
