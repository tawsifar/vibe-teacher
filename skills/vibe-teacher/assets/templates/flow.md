## 🔄 What happens when you {{ACTION}}

**In short:** {{WHOLE_TRIP_IN_ONE_SENTENCE}}

| # | Where | What happens | File:line |
|---|---|---|---|
| 1 | 🖱️ You | {{USER_DOES}} | `{{FILE}}:{{LINE}}` |
| 2 | 🌐 Browser | {{HANDLER_RUNS}} | `{{FILE}}:{{LINE}}` |
| 3 | 📨 Request | {{METHOD}} `{{URL}}` with {{DATA}} | `{{FILE}}:{{LINE}}` |
| 4 | 🍳 Server | {{ROUTE_HANDLER}} | `{{FILE}}:{{LINE}}` |
| 5 | 🧊 Data | {{READ_OR_SAVE}} | `{{FILE}}:{{LINE}}` |
| 6 | 📬 Response | {{STATUS}} + {{JSON}} | `{{FILE}}:{{LINE}}` |
| 7 | ✨ Screen | {{WHAT_CHANGES}} | `{{FILE}}:{{LINE}}` |

```
 You        Browser ({{FRONT_FILE}})     Server ({{BACK_FILE}})      Data
  |  {{act}}  |                          |                         |
  |---------->|  {{METHOD}} {{URL}}       |                         |
  |           |------------------------->|  {{work}}               |
  |           |                          |------------------------>|
  |           |   {{STATUS}} + JSON      |<------------------------|
  |           |<-------------------------|                         |
  | {{result}}|                          |                         |
```

📖 **New words:** **request** (the browser asking) · **response** (the server answering) · **{{TERM}}** ({{MEANING}})

⚠️ **Weak spots on this path**
- `{{FILE}}:{{LINE}}` — {{ISSUE}}

❓ **Quick check:** {{WHAT_IF_QUESTION}}

👉 **Next step:** `flow "{{OTHER_ACTION}}"` · `explain {{BACK_FILE}}` · `fix-plan`
