'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  async function sayHello() {
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage('Could not reach the server. Try again.');
    }
  }

  return (
    <main>
      <h1>Hello App</h1>
      <button onClick={sayHello}>Say hello</button>
      <p>{message}</p>
    </main>
  );
}
