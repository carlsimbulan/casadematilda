import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80';

export default function RoomCard({ room }) {
  const { _id, name, description, price, capacity, amenities, images } = room;
  const imageUrl = images && images.length > 0 ? images[0] : FALLBACK_IMAGE;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        <div className="absolute top-3 right-3 bg-amber-500 text-stone-900 font-bold text-sm px-3 py-1 rounded-full shadow">
          ₱{price > 0 ? price.toLocaleString() : 'Included'}/night
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-stone-800 mb-1">{name}</h3>
        <p className="text-stone-500 text-sm mb-3 flex items-center gap-1.5">
          <Users className="w-4 h-4" /> Up to {capacity} guest{capacity !== 1 ? 's' : ''}
        </p>

        {description && (
          <p className="text-stone-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>
        )}

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenities.slice(0, 4).map((amenity) => (
              <span key={amenity} className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {amenity}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="bg-stone-100 text-stone-600 text-xs font-medium px-2.5 py-1 rounded-full">
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        <Link
          to={`/rooms/${_id}`}
          className="mt-auto block text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
