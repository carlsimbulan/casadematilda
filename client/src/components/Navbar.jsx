import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, CalendarDays, LayoutDashboard, Images, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';
import AuthDrawer from './AuthDrawer.jsx';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('login');

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const openDrawer = (mode = 'login') => {
    setDrawerMode(mode);
    setDrawerOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
    <nav className="bg-stone-800 text-amber-100 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            <img src={logo} alt="Casa de Matilda" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/rooms" className="hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5">
              <Images className="w-4 h-4" />
              Gallery
            </Link>
            {!isAdmin && (
              <Link to="/book" className="hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                Book Now
              </Link>
            )}
            {user && !isAdmin && (
              <Link to="/my-reservations" className="hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4" />
                My Reservations
              </Link>
            )}
            {isAdmin && (
              <div className="relative group">
                <button className="hover:text-amber-400 transition-colors font-medium flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>
                <div className="absolute right-0 mt-1 w-52 bg-stone-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 hover:bg-stone-600 rounded-t-lg transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/admin/rooms" className="flex items-center gap-2 px-4 py-2.5 hover:bg-stone-600 transition-colors">
                    <Images className="w-4 h-4" /> Manage Gallery
                  </Link>
                  <Link to="/admin/reservations" className="flex items-center gap-2 px-4 py-2.5 hover:bg-stone-600 rounded-b-lg transition-colors">
                    <ClipboardList className="w-4 h-4" /> Reservations
                  </Link>
                </div>
              </div>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-stone-400 text-sm flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => openDrawer('login')} className="hover:text-amber-400 transition-colors font-medium">
                  Login
                </button>
                <button onClick={() => openDrawer('register')} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors">
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-amber-100 hover:text-amber-400 transition-colors p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-stone-700 border-t border-stone-600 px-4 py-4 space-y-3">
          <Link to="/rooms" onClick={closeMenu} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-medium py-1">
            <Images className="w-4 h-4" /> Gallery
          </Link>
          {!isAdmin && (
            <Link to="/book" onClick={closeMenu} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-medium py-1">
              <CalendarDays className="w-4 h-4" /> Book Now
            </Link>
          )}
          {user && !isAdmin && (
            <Link to="/my-reservations" onClick={closeMenu} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-medium py-1">
              <ClipboardList className="w-4 h-4" /> My Reservations
            </Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" onClick={closeMenu} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-medium py-1">
                <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
              </Link>
              <Link to="/admin/rooms" onClick={closeMenu} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-medium py-1">
                <Images className="w-4 h-4" /> Manage Gallery
              </Link>
              <Link to="/admin/reservations" onClick={closeMenu} className="flex items-center gap-2 hover:text-amber-400 transition-colors font-medium py-1">
                <ClipboardList className="w-4 h-4" /> All Reservations
              </Link>
            </>
          )}
          <div className="pt-2 border-t border-stone-600">
            {user ? (
              <div className="space-y-2">
                <p className="text-stone-400 text-sm flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {user.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => openDrawer('login')} className="block w-full text-center border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-stone-900 font-semibold px-4 py-2 rounded-lg transition-colors">
                  Login
                </button>
                <button onClick={() => openDrawer('register')} className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    <AuthDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} initialMode={drawerMode} />
    </>
  );
}
