import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { filterReservations, isHistory } from '../../utils/reservationFilters.js';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-teal-100 text-teal-800',
  cancelled: 'bg-stone-200 text-stone-600',
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'history', label: 'History' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await api.get('/api/admin/reservations');
        setReservations(data);
      } catch {
        toast.error('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { data } = await api.put(`/api/admin/reservations/${id}`, { status: newStatus });
      setReservations((prev) => prev.map((r) => (r._id === id ? data : r)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterReservations(reservations, filter);

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800">All Reservations</h1>
          <p className="text-stone-500 mt-1">
            Review upcoming bookings, past stay history, and manage guest reservations.
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filter === id
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {label}
              {id !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({filterReservations(reservations, id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
                  <tr>
                    <th className="px-5 py-3 text-left">Guest</th>
                    <th className="px-5 py-3 text-left">Property</th>
                    <th className="px-5 py-3 text-left">Dates</th>
                    <th className="px-5 py-3 text-left">Guests</th>
                    <th className="px-5 py-3 text-left">Total</th>
                    <th className="px-5 py-3 text-left">Booked</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-stone-400">
                        No reservations found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((res) => (
                      <tr key={res._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-stone-800">
                            {res.user?.name || '—'}
                          </div>
                          <div className="text-stone-400 text-xs">{res.user?.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-stone-700">Casa de Matilda</div>
                          <div className="text-stone-400 text-xs">Entire property · 2 rooms + pool</div>
                          {isHistory(res) && (
                            <div className="text-stone-500 text-xs mt-1 font-medium">Past stay</div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-stone-600">
                          <div>{format(new Date(res.checkIn), 'MMM d, yyyy')}</div>
                          <div className="text-stone-400">→ {format(new Date(res.checkOut), 'MMM d, yyyy')}</div>
                        </td>
                        <td className="px-5 py-4 text-stone-600">{res.guests}</td>
                        <td className="px-5 py-4 font-semibold text-amber-600">
                          ₱{res.totalPrice?.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-stone-500 text-xs">
                          {format(new Date(res.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={res.status}
                            disabled={updatingId === res._id}
                            onChange={(e) => handleStatusChange(res._id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${STATUS_STYLES[res.status]}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
