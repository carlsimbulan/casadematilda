import { Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardHeader({ title, subtitle, onMenuClick }) {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-stone-800 truncate">{title}</h1>
          {subtitle && <p className="text-stone-500 text-xs sm:text-sm truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 text-stone-600 text-sm flex-shrink-0">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{user?.name}</span>
        <span className="hidden md:inline text-stone-400">·</span>
        <span className="hidden md:inline text-stone-400 capitalize">{isAdmin ? 'Admin' : 'Guest'}</span>
      </div>
    </header>
  );
}
