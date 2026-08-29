import { useState } from 'react';
import { getToken } from './lib/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getToken()));

  if (!loggedIn) {
    return <Login onLoggedIn={() => setLoggedIn(true)} />;
  }

  return <Dashboard onLoggedOut={() => setLoggedIn(false)} />;
}

export default App;
