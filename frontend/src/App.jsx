import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Menu from './pages/Menu';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="menu" element={<Menu />} />
      </Route>
    </Routes>
  );
}

export default App;
