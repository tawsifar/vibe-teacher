```
╔══════════════════════════════════════════════╗
║  🎓 VIBE SCORE:  {{TOTAL}} / 100   Grade: {{GRADE}}  {{BADGE}}
║  "{{VERDICT_PHRASE}}"
╚══════════════════════════════════════════════╝
```

**In short:** {{ONE_SENTENCE_SUMMARY}}

| Area | Score | Bar | Why (evidence) |
|---|---|---|---|
| 🔐 Security (20) | {{S}}/20 | {{██████████}} | {{EVIDENCE_WITH_FILE_LINE}} |
| 🏗️ Structure (15) | {{S}}/15 | {{██████████}} | {{EVIDENCE}} |
| 📖 Readability (15) | {{S}}/15 | {{██████████}} | {{EVIDENCE}} |
| 🧯 Error handling (10) | {{S}}/10 | {{██████████}} | {{EVIDENCE}} |
| 🧪 Testing (10) | {{S}}/10 | {{██████████}} | {{EVIDENCE}} |
| ⚡ Performance (10) | {{S}}/10 | {{██████████}} | {{EVIDENCE}} |
| 🧹 Maintainability (10) | {{S}}/10 | {{██████████}} | {{EVIDENCE}} |
| 📝 Docs (5) | {{S}}/5 | {{██████████}} | {{EVIDENCE}} |
| ⚙️ Tooling & config (5) | {{S}}/5 | {{██████████}} | {{EVIDENCE}} |
| **Total** | **{{SUM}}** | | {{"capped at 69" if a cap applies}} |

{{IF_CAP}} ⚠️ **Red-flag cap active:** {{REASON}}, so the score can't go above {{CAP}} until it's fixed.

{{IF_SMALL}} 🌱 **Size note:** this is a small project, so missing tests/CI only cost half points. For a weekend project this is normal.

### 🔝 Top 5 things holding the score back
| # | Issue | Where | Points lost |
|---|---|---|---|
| 1 | {{ISSUE}} | `{{FILE}}:{{LINE}}` | {{N}} |
| 2 | {{ISSUE}} | `{{FILE}}:{{LINE}}` | {{N}} |

🏆 **Best thing:** {{GENUINE_COMPLIMENT}}

🎯 **Most valuable fix:** {{SINGLE_FIX}} → removes {{POINTS}} points of deductions{{, and lifts the cap}}.

🏢 **Big Tech Corner:** {{ONE_PRACTICE_LINKED_TO_A_FINDING}}

{{IF_HISTORY}} 📈 **Since last time:** {{OLD}} → {{NEW}} {{🎉 if up}}

ℹ️ This score is a teaching aid built from facts in your code, not a certified audit.

👉 **Next step:** `fix-plan` (see the quickest wins) · `security` · `explain {{WORST_FILE}}`
