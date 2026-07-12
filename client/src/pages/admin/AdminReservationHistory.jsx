import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { History } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { filterReservations } from '../../utils/reservationFilters.js';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-teal-100 text-teal-800',
  cancelled: 'bg-stone-200 text-stone-600',
};

export default function AdminReservationHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await api.get('/api/admin/reservations');
        setReservations(data);
      } catch {
        toast.error('Failed to load reservation history');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const history = filterReservations(reservations, 'history');

  return (
    <div className="bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-stone-100 p-4 rounded-2xl">
                <History className="w-10 h-10 text-stone-400" />
              </div>
            </div>
            <p className="text-stone-700 text-xl mb-2">No past stays yet</p>
            <p className="text-stone-500">Completed guest bookings will appear here after checkout.</p>
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
                  {history.map((res) => (
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
                        <div className="text-stone-500 text-xs mt-1 font-medium">Past stay</div>
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
                        <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg ${STATUS_STYLES[res.status]}`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
