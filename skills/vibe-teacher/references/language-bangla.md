# Bangla mode (বাংলা) style guide

Turn on with `lang bn`, "Bangla te bolo", "বাংলায় বলো". Turn off with `lang en`.

## Tone and style

- Simple, everyday **চলিত ভাষা** (spoken standard Bangla), friendly like an elder sibling (ভাইয়া/আপু style), never formal সাধু ভাষা.
- Use **"তুমি"** by default. If the user writes with "আপনি", switch to "আপনি".
- Short sentences. One idea per line. Same structure rules as English: tables, cards, emoji headings, max 3-line paragraphs.
- **Keep technical terms in English**, bold, with a short Bangla gloss the first time:
  "**API** (দুই প্রোগ্রামের মধ্যে কথা বলার পথ)".
- Keep code, file names, commands, `file:line` and prompts for the AI **in English** (AI tools follow English prompts more reliably).
  Optionally add a one-line Bangla summary of the prompt below it.
- Section labels: **সংক্ষেপে:** (In short) · **✅ মূল কথা:** (Key takeaway) · **❓ ছোট্ট প্রশ্ন:** (Quick check) · **👉 পরের ধাপ:** (Next step).
- Banglish input (Bangla in Latin letters) is fine. Reply in Bangla script unless they ask for Banglish.
- Numbers can stay as 0–9 digits for scores and lines (e.g. 63/100), which is easier to match with code.

## Restaurant analogy in Bangla

| রেস্টুরেন্ট | তোমার প্রজেক্ট |
|---|---|
| খাওয়ার ঘর (ডাইনিং) | **Frontend** (ইউজার যা দেখে) |
| ওয়েটার | **API** (অর্ডার আনা-নেওয়া করে) |
| রান্নাঘর | **Backend** (আসল কাজ এখানে হয়) |
| ফ্রিজ | **Database** (তথ্য জমা থাকে) |
| তালাবদ্ধ রেসিপির সিন্দুক | **`.env`** (গোপন চাবি থাকে) |

## Core term glosses (~40)

| Term | বাংলা ব্যাখ্যা |
|---|---|
| Frontend | ইউজার যে অংশ দেখে ও ক্লিক করে |
| Backend | সার্ভারে চলা অংশ, যেখানে নিয়ম আর ডেটা থাকে |
| API | দুই প্রোগ্রামের মধ্যে কথা বলার পথ |
| Route / Endpoint | সার্ভারের একটা নির্দিষ্ট ঠিকানা, যেমন `/api/todos` |
| Server | যে কম্পিউটার/প্রোগ্রাম অনুরোধের উত্তর দেয় |
| Request | সার্ভারের কাছে কিছু চাওয়ার বার্তা |
| Response | সার্ভারের ফেরত উত্তর |
| Database | তথ্য দীর্ঘদিন জমা রাখার জায়গা |
| JSON | লেবেল আর মান দিয়ে লেখা ডেটার ফরম্যাট |
| Runtime | যে ইঞ্জিন আসলে কোড চালায় |
| Node.js | ব্রাউজারের বাইরে, কম্পিউটারে JavaScript চালানোর ইঞ্জিন |
| npm | Node-এর প্যাকেজ ডাউনলোডের "অ্যাপ স্টোর" |
| package.json | প্রজেক্টের দরকারি প্যাকেজের তালিকা |
| Package / Library | অন্যের লেখা, আবার ব্যবহারযোগ্য কোড |
| Framework | অ্যাপের কাঠামো ঠিক করে দেওয়া বড় লাইব্রেরি |
| Component | পেজের আবার-ব্যবহারযোগ্য টুকরো, LEGO ইটের মতো |
| State | কম্পোনেন্ট যা মনে রাখে এবং যা বদলাতে পারে |
| Function | নাম দেওয়া কিছু ধাপ, বারবার চালানো যায় |
| Variable | মান রাখার নাম দেওয়া বাক্স |
| Bug | কোডের ভুল, যা অনাকাঙ্ক্ষিত কাজ করে |
| Error | কোড চলার সময় কিছু ভুল হওয়ার সংকেত |
| Environment variable | কোডের বাইরে থেকে দেওয়া সেটিং, যেমন API key |
| .env | গোপন সেটিং রাখার লোকাল ফাইল, GitHub-এ যাবে না |
| .gitignore | যে ফাইলগুলো Git আপলোড করবে না তার তালিকা |
| API key | পেইড সার্ভিস ব্যবহারের গোপন পাসওয়ার্ড |
| Secret | যেকোনো গোপন মান: key, password, token |
| Authentication | তুমি কে, সেটা যাচাই করা (লগইন) |
| Authorization | তুমি কী করতে পারবে, সেটা যাচাই করা |
| Token | লগইন করা আছ, তার প্রমাণপত্র |
| Hashing | পাসওয়ার্ডকে একমুখীভাবে এলোমেলো করা, ফেরত পড়া যায় না |
| Input validation | আসা ডেটা ঠিক ধরন ও মাপের কিনা যাচাই |
| Middleware | প্রতিটি অনুরোধ যে পাহারাদারের পাশ দিয়ে যায় |
| Status code | ফলাফলের ৩-অঙ্কের কোড (200 ঠিক আছে, 404 পাওয়া যায়নি) |
| Git | কোডের "সেভ গেম" ব্যবস্থা |
| Commit | একটা সেভ পয়েন্ট, সাথে একটা বার্তা |
| Repository | Git দিয়ে ট্র্যাক করা প্রজেক্ট ফোল্ডার |
| Test | কোড ঠিক চলছে কিনা যাচাই করার কোড |
| CI | প্রতি push-এ টেস্ট চালানো রোবট |
| Deploy | অ্যাপকে ইন্টারনেটে তোলা |
| Linter | সম্ভাব্য ভুল আর অগোছালো কোড ধরিয়ে দেওয়া রোবট |
| Refactor | কাজ না বদলে কোড গুছিয়ে লেখা |
| CORS | কোন ওয়েবসাইট তোমার API ডাকতে পারবে, ব্রাউজারের সেই নিয়ম |

## Example (score card opening)

```
╔══════════════════════════════════════════════╗
║  🎓 VIBE SCORE:  63 / 100   Grade: D  🟠       ║
║  "চলে, তবে কয়েকটা ঝুঁকিপূর্ণ অভ্যাস আছে।"          ║
╚══════════════════════════════════════════════╝
**সংক্ষেপে:** তোমার অ্যাপ ঠিকঠাক কাজ করে, কিন্তু একটা গোপন **API key** (পেইড সার্ভিসের পাসওয়ার্ড) কোডের ভেতরে লেখা আছে।
```

## Grade phrases in Bangla

| Grade | Phrase |
|---|---|
| A | "দারুণ! বড় কোম্পানির মতো অভ্যাস!" |
| B | "বেশ মজবুত আর সুস্থ।" |
| C | "ভালো ভিত্তি, একটু গোছানো বাকি।" |
| D | "চলে, তবে কয়েকটা ঝুঁকিপূর্ণ অভ্যাস আছে।" |
| Needs work | "অনেকগুলো সহজ উন্নতির সুযোগ অপেক্ষা করছে।" |
