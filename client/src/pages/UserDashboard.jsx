import { Link } from 'react-router-dom';
import { CalendarDays, ClipboardList, Images, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const quickLinks = [
  {
    to: '/book',
    label: 'Book a Stay',
    description: 'Reserve the entire property for your group',
    icon: CalendarDays,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    to: '/my-reservations',
    label: 'My Reservations',
    description: 'View upcoming stays and past history',
    icon: ClipboardList,
    color: 'bg-teal-100 text-teal-700',
  },
  {
    to: '/rooms',
    label: 'Browse Gallery',
    description: 'See photos of Casa de Matilda',
    icon: Images,
    color: 'bg-stone-100 text-stone-700',
  },
];

export default function UserDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Guest';

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-amber-500/20 p-3 rounded-2xl">
              <Home className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {firstName}!</h2>
              <p className="text-stone-300 leading-relaxed">
                Manage your bookings, explore the gallery, and plan your next staycation at Casa de Matilda.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map(({ to, label, description, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-800 text-lg mb-1">{label}</h3>
              <p className="text-stone-500 text-sm">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
