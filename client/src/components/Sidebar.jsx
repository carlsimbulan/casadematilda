import { NavLink, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { guestNavItems, adminNavItems, isNavItemActive } from '../config/navItems.js';
import logo from '../assets/logo.png';

export default function Sidebar({ isAdmin, onNavigate, onLogout }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const items = isAdmin ? adminNavItems : guestNavItems;

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const linkClass = (to) =>
    isNavItemActive(location.pathname, to)
      ? 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors bg-amber-500 text-stone-900'
      : 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-amber-100 hover:bg-stone-700 hover:text-amber-400';

  return (
    <aside className="flex flex-col h-full bg-stone-800 text-amber-100">
      <div className="px-5 py-5 border-b border-stone-700">
        <NavLink to={isAdmin ? '/admin' : '/dashboard'} onClick={onNavigate} className="flex items-center justify-center">
          <img src={logo} alt="Casa de Matilda" className="h-10 w-auto object-contain" />
        </NavLink>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass(to)} onClick={onNavigate}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-stone-700">
        <p className="text-stone-400 text-xs mb-3 truncate">{user?.name}</p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
