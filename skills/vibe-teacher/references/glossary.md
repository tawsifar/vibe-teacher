# Glossary (plain English, 2 lines max each)

**Contents:** A. The web basics · B. Code & runtime · C. Frontend · D. Backend & APIs · E. Data ·
F. Security · G. Tools & workflow · H. Deployment

Format when used in an answer: "**term** (plain meaning)". For a full card use assets/templates/glossary-card.md.

## A. The web basics

| Term | Plain meaning |
|---|---|
| Browser | The app (Chrome, Safari) that downloads and shows websites. |
| URL | A web address, like `https://site.com/about`. |
| Domain | The name part of the address (`site.com`), rented yearly. |
| HTTP / HTTPS | The language browsers and servers use to talk. HTTPS is the locked, encrypted version. |
| Request | A message asking a server for something (a page, data, an action). |
| Response | The server's reply: data, a page, or an error. |
| HTTP method | The kind of request: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). |
| Status code | A 3-digit result: 2xx worked, 4xx you asked wrong, 5xx the server broke. |
| 200 / 201 | OK / created successfully. |
| 400 | Bad request: the data sent was wrong or missing. |
| 401 / 403 | Not logged in / logged in but not allowed. |
| 404 | Not found: that address doesn't exist. |
| 500 | Server error: the code on the server crashed. |
| localhost | Your own computer acting as a server; only you can see it. |
| Port | A numbered door on a computer (3000, 5173, 8000) a server listens on. |
| JSON | A text format for data using labels and values: `{"name": "Ana"}`. |
| Cookie | A small note a website saves in your browser, often to remember you're logged in. |

## B. Code & runtime

| Term | Plain meaning |
|---|---|
| Runtime | The engine that actually runs your code (Node.js, Python, the browser). |
| Node.js | Lets JavaScript run on a computer or server, not just in a browser. |
| JavaScript | The main language of the web; runs in browsers and in Node.js. |
| TypeScript | JavaScript with labels on data types so mistakes show up earlier. |
| Python | A popular, readable language often used for backends, data and AI. |
| Variable | A named box that holds a value. |
| Function | A named set of steps you can run again and again. |
| Parameter / argument | The input you hand to a function. |
| Return value | What a function hands back when it's done. |
| Object | A bundle of labelled values: `{ id: 1, text: "Buy milk" }`. |
| Array / list | An ordered list of values: `[1, 2, 3]`. |
| Loop | Repeating steps for each item in a list. |
| Condition (if) | "Only do this when something is true." |
| Async / await | Waiting for slow things (network, files) without freezing everything else. |
| Promise | A "you'll get it later" ticket for a slow result. |
| Module / import | Splitting code into files and pulling pieces from one file into another. |
| Library / package | Ready-made code someone else wrote that you can reuse. |
| Framework | A big library that decides your app's structure (Next.js, Django). |
| Dependency | A package your project needs to work. |
| Bug | Code that does something you didn't intend. |
| Refactor | Rewriting code to be cleaner without changing what it does. |
| Exception / error | A signal that something went wrong while running. |
| try / catch | "Try this; if it fails, do this instead of crashing." |
| Stack trace | The list of steps the code was in when it crashed; read top-down for the cause. |
| Environment variable | A setting (like an API key) given to the app from outside the code. |

## C. Frontend

| Term | Plain meaning |
|---|---|
| Frontend | The part of the app users see and click, running in the browser. |
| HTML | The structure of a page: headings, buttons, text. |
| CSS | The styling: colours, sizes, layout. |
| DOM | The browser's live model of the page that code can change. |
| Component | A reusable piece of a page, like a LEGO brick (`Button`, `Navbar`). |
| Props | Settings passed into a component from its parent. |
| State | Data a component remembers that can change (is the menu open?). |
| Hook | A React helper starting with `use` (`useState`, `useEffect`). |
| React | A popular library for building pages out of components. |
| Single-page app (SPA) | A site that swaps content without full page reloads. |
| Rendering | Turning code and data into what you see on screen. |
| SSR | Server-side rendering: the server builds the page before sending it. |
| Responsive | A layout that adapts to phone, tablet and desktop. |
| Tailwind | A styling tool where you add small class names like `p-4` for padding. |
| Event / handler | Something that happens (a click) and the code that reacts to it. |
| fetch | The browser's built-in way to send a request to a server. |

## D. Backend & APIs

| Term | Plain meaning |
|---|---|
| Backend | The part of the app running on a server: rules, data, secrets. |
| Server | A computer (or program) that waits for requests and answers them. |
| API | A set of addresses a program offers so other programs can ask it for things. |
| Endpoint / route | One address in an API, like `POST /api/todos`. |
| REST | A common style of API using URLs + HTTP methods for each action. |
| Express | A small, popular Node.js library for building servers and APIs. |
| Middleware | Code every request passes through first (checks, logging, parsing). |
| Handler / controller | The function that runs when a route is called. |
| Request body | The data sent along with a POST/PUT request. |
| Query string | Extra info after `?` in a URL: `/search?q=cats`. |
| Webhook | A service calling YOUR server when something happens (e.g. Stripe payment done). |
| Rate limiting | Allowing only so many requests per minute, to stop abuse. |
| CORS | Browser rules about which websites may call your API. |
| Serverless function | A small piece of backend code that runs only when called (Vercel/Netlify functions). |
| Server action | A Next.js function that runs on the server but is called like a normal function from a form. |

## E. Data

| Term | Plain meaning |
|---|---|
| Database | Organised long-term storage for app data. |
| SQL | A language for asking questions of table-based databases. |
| Table / row / column | A spreadsheet-like sheet / one record / one field. |
| NoSQL / document | Databases that store flexible JSON-like documents (MongoDB, Firestore). |
| Query | A question or command sent to the database. |
| Schema | The planned shape of your data (which fields, which types). |
| Migration | A script that changes the database's shape in a tracked way. |
| ORM | A translator that lets you use code instead of SQL (Prisma, SQLAlchemy). |
| Primary key / ID | The unique number or code for each record. |
| Index | A catalogue that makes finding records fast. |
| CRUD | Create, Read, Update, Delete: the four basic data actions. |
| Supabase | A hosted Postgres database with login, storage and APIs built in. |
| Firebase | Google's hosted backend: Firestore database, auth, hosting. |
| In-memory | Kept only while the program runs; gone after a restart. |

## F. Security

| Term | Plain meaning |
|---|---|
| Authentication (auth) | Checking who you are (login). |
| Authorization | Checking what you're allowed to do. |
| Session / token | A pass proving you already logged in. |
| JWT | A signed token format that carries login info. |
| Hashing | Scrambling a password one-way so even you can't read it back (bcrypt). |
| Encryption | Scrambling data so only someone with the key can read it. |
| API key | A secret password that lets your app use a paid service. |
| Secret | Any value that must stay private: keys, passwords, tokens. |
| `.env` file | A local file holding environment variables and secrets; must never be committed. |
| `.gitignore` | The list of files Git must not upload. |
| Input validation | Checking incoming data is the right type, size and shape. |
| SQL injection | Tricking a database by typing code into a form field. |
| XSS | Getting malicious script to run in other users' browsers. |
| RLS | Row Level Security: database rules that limit each user to their own rows. |
| Rotate a key | Making a new key and killing the old one after a leak. |
| OWASP Top 10 | A famous list of the most common web security mistakes. |

## G. Tools & workflow

| Term | Plain meaning |
|---|---|
| Terminal | The text window where you type commands. |
| npm | Node's package manager: installs libraries ("the app store"). |
| `package.json` | The project's shopping list of packages and its commands. |
| `node_modules` | The folder of downloaded packages; never edit or commit it. |
| pip | Python's package manager. |
| Virtual env (venv) | A private package box for one Python project. |
| Git | A save-game system for code. |
| Commit | One save point with a message. |
| Branch | A parallel copy of the code to try changes safely. |
| Pull request (PR) | A request to merge a branch, usually reviewed first. |
| Repository (repo) | A project folder tracked by Git. |
| Linter | A robot that points out likely bugs and messy code (ESLint, Ruff). |
| Formatter | A robot that makes code look consistent (Prettier, Black). |
| Test | Code that checks other code works. |
| CI | Robots that run tests on every push (GitHub Actions). |
| Build | Turning source code into optimised files ready to serve. |
| Bundler | A build tool that packs many files into a few (Vite, webpack). |

## H. Deployment

| Term | Plain meaning |
|---|---|
| Deploy | Putting your app on the internet. |
| Hosting | The service that keeps your app running online (Vercel, Netlify, Render). |
| Production | The live version real users see. |
| Development | Your local, work-in-progress version. |
| Staging / preview | A test copy online before going live. |
| CDN | Servers around the world that keep copies of your files close to users. |
| DNS | The internet's phone book: turns `site.com` into a server address. |
| SSL certificate | What makes the padlock (HTTPS) work. |
| Logs | The diary a server writes about what happened. |
| Uptime | How much of the time your app is working. |
