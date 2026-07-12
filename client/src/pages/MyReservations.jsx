import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Home, CalendarDays, Users, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-teal-100 text-teal-800',
  cancelled: 'bg-stone-200 text-stone-600 line-through',
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
            {reservations.map((res) => (
              <div key={res._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Home className="w-7 h-7 text-amber-600" />
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h2 className="text-xl font-bold text-stone-800">Casa de Matilda</h2>
                        <p className="text-stone-400 text-xs mt-0.5">
                          Entire property · 2 rooms · Pool · All amenities
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_STYLES[res.status]}`}
                      >
                        {res.status}
                      </span>
                    </div>

                    <div className="text-stone-500 text-sm space-y-1.5 mt-3">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium text-stone-700">
                          {format(new Date(res.checkIn), 'MMM d, yyyy')}
                        </span>
                        <span>—</span>
                        <span className="font-medium text-stone-700">
                          {format(new Date(res.checkOut), 'MMM d, yyyy')}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        {res.guests} guest{res.guests !== 1 ? 's' : ''}
                      </p>
                      {res.specialRequests && (
                        <p className="flex items-center gap-2">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          {res.specialRequests}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="font-bold text-amber-600 text-lg">
                        ₱{res.totalPrice?.toLocaleString()}
                      </div>

                      {res.status === 'pending' && (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
