// Frontend: runs in the browser (intentionally flawed for testing VIBE Teacher)
const list = document.getElementById('todo-list');

async function loadTodos() {
  // PLANTED ISSUE: no error handling if the server is down
  const res = await fetch('/api/todos');
  const todos = await res.json();
  list.innerHTML = todos
    .map((t) => `<li class="${t.done ? 'done' : ''}">${t.text}</li>`)
    .join('');
}

document.getElementById('todo-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('todo-text').value;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  loadTodos();
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    }),
  });
  const data = await res.json();
  localStorage.setItem('token', data.token);
  alert(data.token ? 'Logged in!' : data.error);
});

loadTodos();
