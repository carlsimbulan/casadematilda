import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { X } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import { guestNavItems, adminNavItems, isNavItemActive } from '../config/navItems.js';
import { useAuth } from '../context/AuthContext.jsx';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome to your Casa de Matilda portal' },
  '/book': { title: 'Book Now', subtitle: 'Reserve the entire property for your stay' },
  '/my-reservations': { title: 'My Reservations', subtitle: 'View and manage your upcoming bookings' },
  '/reservation-history': { title: 'History', subtitle: 'Your past stays at Casa de Matilda' },
  '/rooms': { title: 'Gallery', subtitle: 'Browse Casa de Matilda' },
  '/admin': { title: 'Admin Dashboard', subtitle: 'Overview of Casa de Matilda operations' },
  '/admin/rooms': { title: 'Manage Gallery', subtitle: 'Add, edit, or remove property photos' },
  '/admin/reservations': { title: 'Reservations', subtitle: 'Review and manage guest bookings' },
  '/admin/reservation-history': { title: 'History', subtitle: 'Past guest stays and completed bookings' },
};

function getPageMeta(pathname, isAdmin) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/rooms/')) {
    return { title: 'Room Details', subtitle: 'Casa de Matilda gallery' };
  }
  const items = isAdmin ? adminNavItems : guestNavItems;
  const match = items.find((item) => isNavItemActive(pathname, item.to));
  return match
    ? { title: match.label, subtitle: 'Casa de Matilda' }
    : { title: 'Casa de Matilda', subtitle: isAdmin ? 'Admin Panel' : 'Guest Portal' };
}

export default function DashboardLayout({ onLogout }) {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { title, subtitle } = getPageMeta(location.pathname, isAdmin);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    closeSidebar();
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="h-screen bg-stone-50 flex overflow-hidden">
      <div className="hidden lg:block w-64 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <Sidebar isAdmin={isAdmin} onLogout={handleLogout} />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={closeSidebar} />
          <div className="relative w-64 h-full shadow-2xl">
            <button
              type="button"
              onClick={closeSidebar}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-amber-100 hover:bg-stone-700"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar
              isAdmin={isAdmin}
              onLogout={handleLogout}
              onNavigate={closeSidebar}
            />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col h-screen min-w-0 overflow-hidden">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
