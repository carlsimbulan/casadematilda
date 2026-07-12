import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import api from '../api/axios.js';
import RoomCard from '../components/RoomCard.jsx';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get('/api/rooms');
        setRooms(data);
      } catch {
        setError('Failed to load rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-stone-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold text-amber-400 mb-3">Our Rooms</h1>
        <p className="text-stone-300 text-lg max-w-xl mx-auto">
          Two private rooms included when you book the entire Casa de Matilda property.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="bg-stone-100 p-4 rounded-2xl">
                <Home className="w-10 h-10 text-stone-400" />
              </div>
            </div>
            <p className="text-stone-500 text-xl">No rooms available at the moment.</p>
            <p className="text-stone-400 mt-2">Check back soon!</p>
          </div>
        )}

        {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
