import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Home, CalendarDays, Users, FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

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

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

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
        <p className="text-stone-500 mb-8">View and manage your Casa de Matilda bookings.</p>

        {reservations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-stone-100 p-4 rounded-2xl">
                <CalendarDays className="w-10 h-10 text-stone-400" />
              </div>
            </div>
            <p className="text-stone-500 text-xl mb-3">No reservations yet</p>
            <Link
              to="/book"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {reservations.map((res) => {
              const statusKey = res.status || 'pending';
              const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const StatusIcon = config.icon;

              return (
                <div key={res._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  {/* Status bar at top */}
                  <div className={`h-1.5 w-full ${config.bar}`} />

                  <div className="p-5 sm:p-6">
                    {/* Status badge — prominent at top */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-stone-800">Casa de Matilda</h2>
                      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${config.badge}`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </span>
                    </div>

                    <p className="text-stone-400 text-xs mb-4">
                      Entire property · 2 rooms · Pool · All amenities
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                      {/* Icon + details */}
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
                        </div>
                      </div>

                      {/* Price + action */}
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-2">
                        <div className="font-bold text-amber-600 text-xl">
                          ₱{res.totalPrice?.toLocaleString()}
                        </div>
                        {statusKey === 'pending' && (
                          <button
                            onClick={() => handleCancel(res._id)}
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}
