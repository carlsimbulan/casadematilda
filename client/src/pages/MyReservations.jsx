import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Home, CalendarDays, Users, FileText, Clock, CheckCircle2, XCircle, History } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { filterReservations, isUpcoming } from '../utils/reservationFilters.js';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Confirmation',
    icon: Clock,
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    bar: 'bg-amber-400',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    badge: 'bg-teal-100 text-teal-700 border border-teal-200',
    bar: 'bg-teal-500',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    badge: 'bg-stone-100 text-stone-500 border border-stone-200',
    bar: 'bg-stone-300',
  },
};

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'history', label: 'History' },
  { id: 'cancelled', label: 'Cancelled' },
];

const EMPTY_MESSAGES = {
  upcoming: {
    title: 'No upcoming reservations',
    description: 'Book your next staycation at Casa de Matilda.',
    showBook: true,
  },
  history: {
    title: 'No past stays yet',
    description: 'Your completed bookings will appear here after checkout.',
    showBook: false,
  },
  cancelled: {
    title: 'No cancelled reservations',
    description: 'Cancelled bookings will be listed here.',
    showBook: false,
  },
};

function ReservationCard({ res, onCancel, cancellingId, showHistoryBadge }) {
  const statusKey = res.status || 'pending';
  const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className={`h-1.5 w-full ${config.bar}`} />

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-stone-800">Casa de Matilda</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {showHistoryBadge && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                <History className="w-4 h-4" />
                Past Stay
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${config.badge}`}>
              <StatusIcon className="w-4 h-4" />
              {config.label}
            </span>
          </div>
        </div>

        <p className="text-stone-400 text-xs mb-4">
          Entire property · 2 rooms · Pool · All amenities
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex gap-4 flex-grow">
            <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Home className="w-6 h-6 text-amber-600" />
            </div>

            <div className="text-stone-500 text-sm space-y-1.5">
              <p className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 flex-shrink-0 text-stone-400" />
                <span className="font-semibold text-stone-700">
                  {format(new Date(res.checkIn), 'MMM d, yyyy')}
                </span>
                <span className="text-stone-400">→</span>
                <span className="font-semibold text-stone-700">
                  {format(new Date(res.checkOut), 'MMM d, yyyy')}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0 text-stone-400" />
                {res.guests} guest{res.guests !== 1 ? 's' : ''}
              </p>
              {res.specialRequests && (
                <p className="flex items-center gap-2">
                  <FileText className="w-4 h-4 flex-shrink-0 text-stone-400" />
                  {res.specialRequests}
                </p>
              )}
              <p className="text-stone-400 text-xs">
                Booked {format(new Date(res.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-2">
            <div className="font-bold text-amber-600 text-xl">
              ₱{res.totalPrice?.toLocaleString()}
            </div>
            {isUpcoming(res) && statusKey === 'pending' && (
              <button
                onClick={() => onCancel(res._id)}
                disabled={cancellingId === res._id}
                className="border border-red-300 text-red-500 hover:bg-red-50 disabled:opacity-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                {cancellingId === res._id ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await api.get('/api/reservations/my');
        setReservations(data);
      } catch {
        toast.error('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    setCancellingId(id);
    try {
      await api.put(`/api/reservations/${id}/cancel`);
      toast.success('Reservation cancelled');
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = filterReservations(reservations, activeTab);
  const emptyState = EMPTY_MESSAGES[activeTab];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">My Reservations</h1>
        <p className="text-stone-500 mb-6">View upcoming stays, past history, and cancelled bookings.</p>

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === id
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs opacity-70">
                ({filterReservations(reservations, id).length})
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-stone-100 p-4 rounded-2xl">
                <CalendarDays className="w-10 h-10 text-stone-400" />
              </div>
            </div>
            <p className="text-stone-700 text-xl mb-2">{emptyState.title}</p>
            <p className="text-stone-500 mb-6">{emptyState.description}</p>
            {emptyState.showBook && (
              <Link
                to="/book"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Book Now
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((res) => (
              <ReservationCard
                key={res._id}
                res={res}
                onCancel={handleCancel}
                cancellingId={cancellingId}
                showHistoryBadge={activeTab === 'history'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
