<div align="center">

# 🎓 VIBE Teacher (বাংলা)

**তোমার নিজের প্রজেক্টটা একজন ধৈর্যশীল বন্ধুর মতো বুঝিয়ে দেয়, তারপর স্কোর দেয়, ঝুঁকিপূর্ণ জায়গা খুঁজে বের করে,<br>আর ঠিক করার জন্য AI-কে কী বলতে হবে সেই prompt-ও লিখে দেয়।**

[English README](README.md)

</div>

---

## 🤔 এটা কার জন্য?

তুমি AI দিয়ে (Claude Code, Cursor, Copilot, Antigravity, Lovable, Bolt…) একটা অ্যাপ বা ওয়েবসাইট বানিয়েছ।
সেটা চলে, কিন্তু **কোডটা পড়ে বুঝতে পারো না**। "backend", "API route", "environment variable" শুনলে অচেনা লাগে।

VIBE Teacher একটা **Agent Skill**: একটা নির্দেশনার ফোল্ডার, যেটা তোমার AI টুল দরকারের সময় পড়ে নেয়।
কোনো অ্যাকাউন্ট লাগে না, তোমার কোড কোথাও পাঠায় না, আর তুমি **"apply"** না বললে কিছুই বদলায় না।

## ✨ কী কী করে

| | ফিচার | তুমি পাবে |
|---|---|---|
| 🗺️ | **প্রজেক্ট ট্যুর** | রেস্টুরেন্টের উদাহরণ দিয়ে ধাপে ধাপে পুরো অ্যাপের গঠন |
| 🗂️ | **প্রজেক্ট ম্যাপ** | প্রতিটা গুরুত্বপূর্ণ ফাইল কী কাজ করে |
| 🔄 | **"ক্লিক করলে কী হয়?"** | বাটন → সার্ভার → ডেটাবেস → স্ক্রিন, পুরো যাত্রা |
| 🎓 | **VIBE Score (০–১০০)** | প্রতিটা কাটা নম্বরের প্রমাণসহ স্কোর কার্ড |
| 🛡️ | **নিরাপত্তা সতর্কতা** | ফাঁস হওয়া key, `.env`-এর ভুল, খোলা ডেটাবেস |
| 🛠️ | **ঠিক করার প্ল্যান** | সহজ কাজ আগে, প্রতিটার সাথে AI-কে দেওয়ার prompt |
| 💡 | **নতুন ফিচারের আইডিয়া** | প্রভাব আর পরিশ্রম অনুযায়ী সাজানো |
| 🇧🇩 | **বাংলা মোড** | `lang bn` লিখলেই সহজ বাংলায় ব্যাখ্যা |

---

## 🚀 ১ মিনিটে ইনস্টল

> ইনস্টলের পর **তোমার AI টুলটা রিস্টার্ট করো**, প্রজেক্ট খোলো, আর লেখো **`vibe teacher`**।

### 🥇 উপায় ১: এক কমান্ডে, যেকোনো টুলে (সবচেয়ে সহজ)

[Node.js](https://nodejs.org) 18+ লাগবে।

```bash
npx skills add tawsifar/vibe-teacher
```

> 🪟 **Windows হলে শেষে `--copy` যোগ করো:**

```bash
npx skills add tawsifar/vibe-teacher -g -y --copy
```

### 🥈 উপায় ২: Claude Code প্লাগিন

Claude Code-এর ভেতরে লেখো:

```
/plugin marketplace add tawsifar/vibe-teacher
/plugin install vibe-teacher@vibe-teacher-market
```

### 🥉 উপায় ৩: এক লাইনের স্ক্রিপ্ট (Node.js ছাড়াই)

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/tawsifar/vibe-teacher/main/install/install.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/tawsifar/vibe-teacher/main/install/install.ps1 | iex
```

> 🔍 স্ক্রিপ্ট চালানোর আগে চাইলে পড়ে দেখতে পারো: [`install.sh`](install/install.sh), [`install.ps1`](install/install.ps1)।

### 🛠️ উপায় ৪: হাতে কপি

1. [ZIP ডাউনলোড](https://github.com/tawsifar/vibe-teacher/archive/refs/heads/main.zip) করে আনজিপ করো।
2. `skills/vibe-teacher` ফোল্ডারটা কপি করো `~/.claude/skills/` (Claude Code, Cursor, Copilot, OpenCode) অথবা `~/.agents/skills/` (Codex, Gemini CLI) ফোল্ডারে।
3. টুল রিস্টার্ট করো। পুরো তালিকা [English README](README.md#-install-in-1-minute)-তে আছে (Option 4)।

---

## 🧭 কীভাবে ব্যবহার করবে

| লেখো | যা পাবে |
|---|---|
| `vibe teacher` | স্বাগত কার্ড আর মেনু |
| `vibe teacher tour` | ধাপে ধাপে প্রজেক্ট ট্যুর (`next` লিখে পরের ধাপ) |
| `vibe teacher score` | ১০০-র মধ্যে স্কোর |
| `vibe teacher security` | নিরাপত্তা চেক |
| `vibe teacher fix-plan` | কী আগে ঠিক করবে |
| `lang bn` | বাংলায় ব্যাখ্যা শুরু |

## 🔒 নিরাপত্তা ও গোপনীয়তা

- শুধু পড়ে। তুমি **"apply"** না বললে কোড বদলায় না।
- গোপন key কখনো পুরো দেখায় না, শুধু প্রথম ৩ আর শেষ ৩ অক্ষর (`sk-…9f2`)।
- `VIBE_NOTES.md` বা `VIBE_MAP.md` বানানোর আগে অনুমতি চায়।
- স্কোরটা শেখার সহায়ক, সার্টিফাইড অডিট নয়।

## 📄 লাইসেন্স

[MIT](LICENSE) © tawsifar
