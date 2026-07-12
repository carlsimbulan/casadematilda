import {
  LayoutDashboard,
  Images,
  CalendarDays,
  ClipboardList,
  History,
} from 'lucide-react';

export const guestNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/rooms', label: 'Gallery', icon: Images },
  { to: '/book', label: 'Book Now', icon: CalendarDays },
  { to: '/my-reservations', label: 'My Reservations', icon: ClipboardList },
  { to: '/reservation-history', label: 'History', icon: History },
];

export const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/rooms', label: 'Manage Gallery', icon: Images },
  { to: '/admin/reservations', label: 'Reservations', icon: ClipboardList },
  { to: '/admin/reservation-history', label: 'History', icon: History },
  { to: '/rooms', label: 'View Gallery', icon: Images },
];

export function isNavItemActive(pathname, to) {
  if (to === '/admin' || to === '/dashboard') {
    return pathname === to;
  }
  if (to === '/rooms') {
    return pathname === '/rooms' || pathname.startsWith('/rooms/');
  }
  if (to === '/my-reservations' || to === '/reservation-history' || to === '/admin/reservations' || to === '/admin/reservation-history') {
    return pathname === to;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}
