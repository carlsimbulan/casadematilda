import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProtectedLink from './ProtectedLink.jsx';
import { Menu, X, Images, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { openAuthDrawer } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleOpenAuth = (mode = 'login') => {
    openAuthDrawer(mode);
    setMenuOpen(false);
  };

  return (
    <nav className="relative z-50 bg-stone-800 text-amber-100 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <img src={logo} alt="Casa de Matilda" className="h-10 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/rooms" className="hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5">
              <Images className="w-4 h-4" />
              Gallery
            </Link>
            <ProtectedLink to="/book" className="hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              Book Now
            </ProtectedLink>
            <button onClick={() => handleOpenAuth('login')} className="hover:text-amber-400 transition-colors font-medium">
              Login
            </button>
            <button onClick={() => handleOpenAuth('register')} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors">
              Register
            </button>
          </div>

          <button
            className="md:hidden text-amber-100 hover:text-amber-400 transition-colors p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-stone-700 border-t border-stone-600 px-4 py-4 space-y-3">
          <Link to="/rooms" onClick={closeMenu} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-medium py-1">
            <Images className="w-4 h-4" /> Gallery
          </Link>
          <ProtectedLink to="/book" onClick={closeMenu} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-medium py-1">
            <CalendarDays className="w-4 h-4" /> Book Now
          </ProtectedLink>
          <div className="pt-2 border-t border-stone-600 space-y-2">
            <button onClick={() => handleOpenAuth('login')} className="block w-full text-center border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-stone-900 font-semibold px-4 py-2 rounded-lg transition-colors">
              Login
            </button>
            <button onClick={() => handleOpenAuth('register')} className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
