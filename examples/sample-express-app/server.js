// To-do app server (intentionally flawed for testing VIBE Teacher)
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// PLANTED ISSUE: hard-coded key (FAKE value, safe to publish)
const OPENAI_API_KEY = "sk-FAKE-EXAMPLE-0000000000000000";

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [
  { id: 1, text: 'Learn what an API is', done: false },
  { id: 2, text: 'Ask VIBE Teacher for a tour', done: true },
];

const users = [{ email: 'demo@example.com', password: 'demo1234' }];

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// PLANTED ISSUE: no input validation
app.post('/api/todos', (req, res) => {
  const todo = { id: Date.now(), text: req.body.text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  res.status(204).end();
});

// PLANTED ISSUE: plain-text password check, fake token
app.post('/api/login', (req, res) => {
  const user = users.find((u) => u.email === req.body.email && u.password === req.body.password);
  if (!user) return res.status(401).json({ error: 'Wrong email or password' });
  res.json({ token: 'demo-token-' + user.email });
});

app.get('/api/ai-tip', (req, res) => {
  console.log('Using key', OPENAI_API_KEY.slice(0, 3));
  res.json({ tip: 'Small commits make mistakes easy to undo.' });
});

app.listen(PORT, () => {
  console.log(`To-do app running on http://localhost:${PORT}`);
});
