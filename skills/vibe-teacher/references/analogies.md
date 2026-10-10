# Analogies library

Use the analogy first, then the real term in **bold**, then where it lives in their code.
Stick to ONE main analogy per lesson (default: restaurant) so the user isn't juggling metaphors.

## 🍽️ Restaurant (default for whole-app architecture)

| Restaurant | Software |
|---|---|
| Dining room | **Frontend**: what users see and click |
| Menu | **UI**: the buttons and pages on offer |
| Customer's order | **Request** |
| Waiter | **API**: carries orders to the kitchen and food back |
| Order window address ("table 4 → grill station") | **Route / endpoint** (`/api/todos`) |
| Kitchen | **Backend / server** |
| Head chef's rulebook | **Business logic** |
| Fridge / pantry | **Database** |
| Locked recipe safe | **`.env`** with secrets |
| Bouncer at the door | **Authentication** (who are you?) |
| VIP list | **Authorization** (what are you allowed to do?) |
| Health inspector | **Tests / CI** |
| Opening night | **Deployment** |
| Food delivery partner | **Third-party API** (Stripe, OpenAI) |

## 📮 Post office (for HTTP, requests and responses)

| Post office | Web |
|---|---|
| Letter | **Request** |
| Address on the envelope | **URL** |
| "Send", "Ask for", "Update", "Cancel" stamps | **HTTP methods**: POST, GET, PUT/PATCH, DELETE |
| Reply letter | **Response** |
| "Delivered", "Address unknown", "Refused" stickers | **Status codes**: 200, 404, 401 |
| Standard form layout | **JSON** |
| Return-to-sender note | **Error message** |

## 📞 Phone call (for real-time features and connections)

- Normal web request = sending a text and waiting for one reply.
- **WebSocket** = an open phone call; both sides can talk anytime (chat, live updates).
- **Port** (3000, 5173) = the extension number at the company's phone line.
- **localhost** = calling yourself; only your computer can answer.

## 📚 Library (for databases)

| Library | Database |
|---|---|
| The library | **Database** |
| A bookshelf section | **Table / collection** |
| One book | **Row / document** |
| Info on the book card (title, author) | **Columns / fields** |
| Library catalogue | **Index** (finds things fast) |
| Librarian you ask | **ORM / query** (Prisma, Mongoose, SQL) |
| Members-only rooms | **Row Level Security (RLS)** / security rules |

## 🏠 House (for project structure and files)

- Rooms = **folders**; each room has a job (kitchen = `api/`, living room = `pages/`).
- Furniture = **files**.
- Blueprints = **config files** (`next.config.js`, `vite.config.js`).
- Front door = **entry point** (`server.js`, `index.html`).
- Toolbox from the hardware store = **packages** in `node_modules/`.
- Shopping list for the toolbox = **`package.json`**.

## 🚗 Car (for runtime and build tools)

- Engine = **runtime** (Node.js, Python, the browser): what actually runs the code.
- Fuel = your code.
- Factory assembly line = **build step** (Vite/Next turns your code into fast, small files).
- Dashboard warning lights = **linter** and **errors**.
- Test drive = **tests**.

## 🧱 LEGO (for components)

- Each brick = a **component** (`Button`, `TodoItem`).
- Instructions passed to a brick = **props**.
- What the brick remembers (is it on or off?) = **state**.
- A built model = a **page**.

## Quick one-liners

| Term | One-liner |
|---|---|
| Git | A save-game system for code; every commit is a save point |
| GitHub | A cloud shelf where save games are shared |
| Cache | Keeping a copy on your desk so you don't walk to the archive again |
| Middleware | A security guard every request passes on the way in |
| Environment variable | A setting written on a sticky note next to the machine, not in the code |
| Async / await | Ordering food and doing other things until the buzzer goes |
| Bug | A recipe step that makes the dish come out wrong |
| Refactor | Reorganising the kitchen without changing the menu |
