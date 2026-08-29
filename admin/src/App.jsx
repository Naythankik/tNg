import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST to /api/auth/login on the backend, store the JWT, redirect to dashboard.
    console.log('login attempt', { email });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 text-stone-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-semibold">Admin Login</h1>
        <p className="mb-6 text-sm text-stone-500">Confectionery MVP dashboard</p>

        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="owner@example.com"
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default App;
