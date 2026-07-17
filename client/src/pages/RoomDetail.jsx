import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, XCircle } from 'lucide-react';
import api from '../api/axios.js';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80';

const CATEGORY_LABELS = {
  rooms: 'Rooms',
  pool: 'Pool',
  amenities: 'Amenities',
};

export default function RoomDetail() {
  const { id } = useParams();

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
        setError('Item not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <XCircle className="w-12 h-12 text-stone-300" />
        <p className="text-stone-500 text-xl">{error || 'Not found'}</p>
        <Link to="/rooms" className="text-teal-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : [FALLBACK_IMAGE];
  const categoryLabel = CATEGORY_LABELS[room.category] ?? room.category;

  return (
    <div className="bg-stone-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/rooms"
          className="text-teal-600 hover:text-teal-700 font-medium mb-6 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-4">
          <div className="flex flex-col md:flex-row">

            {/* Left: Image Gallery */}
            <div className="md:w-1/2 flex flex-col bg-stone-100">
              <div className="flex items-center justify-center p-4">
                <img
                  src={images[activeImage]}
                  alt={room.name}
                  className="max-h-80 w-full object-contain rounded-xl"
                  onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setActiveImage(idx)}>
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className={`h-14 w-20 object-cover rounded-lg border-2 transition-all flex-shrink-0 ${
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

            {/* Right: Details */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-stone-800 mb-2">{room.name}</h1>
                <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 capitalize mb-6">
                  {categoryLabel}
                </span>

                {room.description && (
                  <div>
                    <h2 className="text-xl font-semibold text-stone-700 mb-2">About</h2>
                    <p className="text-stone-600 leading-relaxed">{room.description}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Gallery
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
