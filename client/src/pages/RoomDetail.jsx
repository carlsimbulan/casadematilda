import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/api/rooms/${id}`);
        setRoom(data);
      } catch {
        setError('Room not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <XCircle className="w-12 h-12 text-stone-300" />
        <p className="text-stone-500 text-xl">{error || 'Room not found'}</p>
        <Link to="/rooms" className="text-teal-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Rooms
        </Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : [FALLBACK_IMAGE];

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/rooms"
          className="text-teal-600 hover:text-teal-700 font-medium mb-6 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Rooms
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
          {/* Image Gallery */}
          <div className="relative">
            <img
              src={images[activeImage]}
              alt={room.name}
              className="w-full h-80 sm:h-96 object-cover"
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
            />
            {images.length > 1 && (
              <div className="flex gap-2 px-4 py-3 bg-stone-50 overflow-x-auto">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)}>
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className={`h-16 w-24 object-cover rounded-lg border-2 transition-all ${
                        activeImage === idx
                          ? 'border-amber-500 opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-stone-800 mb-2">{room.name}</h1>
                <p className="text-stone-500 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Up to {room.capacity} guest{room.capacity !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-stone-400 mb-1">Included in property booking</div>
                <div className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${
                  room.isAvailable ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-600'
                }`}>
                  {room.isAvailable
                    ? <><CheckCircle2 className="w-4 h-4" /> Available</>
                    : <><XCircle className="w-4 h-4" /> Unavailable</>
                  }
                </div>
              </div>
            </div>

            {room.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-stone-700 mb-2">About This Room</h2>
                <p className="text-stone-600 leading-relaxed">{room.description}</p>
              </div>
            )}

            {room.amenities && room.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-stone-700 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-amber-100 text-amber-800 font-medium text-sm px-3 py-1.5 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-stone-600 text-sm">
              This room is included when you book the entire Casa de Matilda property.{' '}
              {user ? (
                <Link to="/book" className="text-amber-600 font-semibold hover:underline">
                  Book the whole property
                </Link>
              ) : (
                <Link to="/login" className="text-amber-600 font-semibold hover:underline">
                  Login to book
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
