import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80';

const CATEGORY_COLORS = {
  inside: 'bg-teal-100 text-teal-700',
  outside: 'bg-green-100 text-green-700',
};

export default function RoomCard({ room }) {
  const { _id, name, description, category, images } = room;
  const imageUrl = images && images.length > 0 ? images[0] : FALLBACK_IMAGE;
  const badge = CATEGORY_COLORS[category] ?? 'bg-stone-100 text-stone-600';

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
        <div className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full shadow capitalize ${badge}`}>
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-stone-800 mb-2">{name}</h3>

        {description && (
          <p className="text-stone-600 text-sm mb-4 line-clamp-3 flex-grow">{description}</p>
        )}

        <Link
          to={`/rooms/${_id}`}
          className="mt-auto block text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          View Photos
        </Link>
      </div>
    </div>
  );
}
