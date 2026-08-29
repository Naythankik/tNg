import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-brand' : 'text-stone-600 hover:text-brand-navy'}`;

function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Take n Go Confectionery" className="h-11 w-auto rounded-md" />
          <span className="hidden text-lg font-semibold tracking-tight text-brand-navy sm:inline">
            Take n Go Confectionery
          </span>
        </NavLink>
        <nav className="flex items-center gap-5">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/menu" className={navLinkClass}>
            Menu
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
