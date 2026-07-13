import { useEffect, useState } from 'react';
import { Home, Trees } from 'lucide-react';
import api from '../api/axios.js';
import RoomCard from '../components/RoomCard.jsx';

const TABS = [
  { value: 'inside', label: 'Inside', Icon: Home },
  { value: 'outside', label: 'Outside', Icon: Trees },
];

export default function Rooms() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('inside');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await api.get('/api/rooms');
        setItems(data);
      } catch {
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filtered = items.filter((i) => i.category === activeTab);

  const activeTabInfo = TABS.find((t) => t.value === activeTab);

  return (
    <div className="bg-stone-50">
      <div className="bg-stone-800 text-white py-16 text-center">
        <h1 className="text-4xl font-bold text-amber-400 mb-3">Our Gallery</h1>
        <p className="text-stone-300 text-lg max-w-xl mx-auto">
          Explore inside and outside of Casa de Matilda.
        </p>
      </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {TABS.map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === value
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

      {/* Content */}
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

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="bg-stone-100 p-4 rounded-2xl">
                {activeTabInfo && <activeTabInfo.Icon className="w-10 h-10 text-stone-400" />}
              </div>
            </div>
            <p className="text-stone-500 text-xl">No {activeTabInfo?.label} listed yet.</p>
            <p className="text-stone-400 mt-2">Check back soon!</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <RoomCard key={item._id} room={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
