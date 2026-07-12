import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  capacity: 2,
  amenities: '',
  images: '',
  isAvailable: true,
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    try {
      const { data } = await api.get('/api/rooms');
      setRooms(data);
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (room) => {
    setEditing(room._id);
    setForm({
      name: room.name,
      description: room.description || '',
      price: room.price,
      capacity: room.capacity,
      amenities: (room.amenities || []).join(', '),
      images: (room.images || []).join(', '),
      isAvailable: room.isAvailable,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/rooms/${id}`);
      toast.success('Room deleted');
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error('Failed to delete room');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      capacity: Number(form.capacity),
      amenities: form.amenities
        ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      images: form.images
        ? form.images.split(',').map((i) => i.trim()).filter(Boolean)
        : [],
      isAvailable: form.isAvailable,
    };

    try {
      if (editing) {
        await api.put(`/api/rooms/${editing}`, payload);
        toast.success('Room updated');
      } else {
        await api.post('/api/rooms', payload);
        toast.success('Room created');
      }
      setShowModal(false);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Manage Rooms</h1>
            <p className="text-stone-500 mt-1">Add, edit, or remove accommodation listings.</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow"
          >
            + Add Room
          </button>
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
                    <th className="px-5 py-3 text-left">Room</th>
                    <th className="px-5 py-3 text-left">Price/Night</th>
                    <th className="px-5 py-3 text-left">Capacity</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rooms.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-stone-400">
                        No rooms found. Add your first room!
                      </td>
                    </tr>
                  ) : (
                    rooms.map((room) => (
                      <tr key={room._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {room.images?.[0] && (
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-12 h-10 object-cover rounded-lg flex-shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <div>
                              <div className="font-semibold text-stone-800">{room.name}</div>
                              <div className="text-stone-400 text-xs line-clamp-1 max-w-xs">
                                {room.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-amber-600">
                          {room.price > 0 ? `₱${room.price.toLocaleString()}` : 'Included'}
                        </td>
                        <td className="px-5 py-4 text-stone-600">{room.capacity} guests</td>
                        <td className="px-5 py-4">
                          {room.isAvailable ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-200 text-stone-500">
                              <XCircle className="w-3.5 h-3.5" /> Unavailable
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEdit(room)}
                              className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(room._id)}
                              className="text-red-500 hover:text-red-700 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-800">
                {editing ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1 text-sm">Room Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1 text-sm">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1 text-sm">Price/Night</label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1 text-sm">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1 text-sm">
                  Amenities <span className="text-stone-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                  placeholder="WiFi, AC, Pool, Hot Shower"
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1 text-sm">
                  Image URLs <span className="text-stone-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://example.com/img1.jpg"
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="w-4 h-4 accent-teal-600"
                />
                <label htmlFor="isAvailable" className="text-stone-700 font-medium text-sm">
                  Available for booking
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-stone-300 text-stone-600 hover:bg-stone-50 font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-stone-900 font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
