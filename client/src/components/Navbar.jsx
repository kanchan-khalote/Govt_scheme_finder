import { Link, NavLink } from 'react-router-dom';
import { Landmark, LogOut } from 'lucide-react';
import { useAuth } from '../context/Authcontext.jsx';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-linear-to-r from-brand-700 to-accent-700 shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <Landmark size={22} /> Scheme Finder
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
          <span className="mx-2 hidden text-sm text-white/80 sm:inline">{user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}