import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, History } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import ReservationCard from '../components/ReservationCard.jsx';
import { filterReservations } from '../utils/reservationFilters.js';

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'cancelled', label: 'Cancelled' },
];

const EMPTY_MESSAGES = {
  upcoming: {
    title: 'No upcoming reservations',
    description: 'Book your next staycation at Casa de Matilda.',
    showBook: true,
  },
  cancelled: {
    title: 'No cancelled reservations',
    description: 'Cancelled bookings will be listed here.',
    showBook: false,
  },
};

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
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
