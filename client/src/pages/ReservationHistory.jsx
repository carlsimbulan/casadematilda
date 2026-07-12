import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import ReservationCard from '../components/ReservationCard.jsx';
import { filterReservations } from '../utils/reservationFilters.js';

export default function ReservationHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await api.get('/api/reservations/my');
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
        {history.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <div className="flex justify-center mb-4">
              <div className="bg-stone-100 p-4 rounded-2xl">
                <History className="w-10 h-10 text-stone-400" />
              </div>
            </div>
            <p className="text-stone-700 text-xl mb-2">No past stays yet</p>
            <p className="text-stone-500">Your completed bookings will appear here after checkout.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {history.map((res) => (
              <ReservationCard key={res._id} res={res} showHistoryBadge />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
