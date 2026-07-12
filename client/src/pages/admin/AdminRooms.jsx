import { useEffect, useRef, useState } from 'react';
import { X, Upload, ImagePlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

const CATEGORIES = [
  { value: 'rooms', label: 'Rooms' },
  { value: 'pool', label: 'Pool' },
  { value: 'amenities', label: 'Amenities' },
];

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'rooms',
};

export default function AdminRooms() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  // imageUrls = already-saved URLs; pendingFiles = new File objects picked but not yet uploaded
  const [imageUrls, setImageUrls] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingPreviews, setPendingPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/api/rooms');
      setItems(data);
    } catch {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filtered =
    activeTab === 'all' ? items : items.filter((i) => i.category === activeTab);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, category: activeTab === 'all' ? 'rooms' : activeTab });
    setImageUrls([]);
    setPendingFiles([]);
    setPendingPreviews([]);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      name: item.name,
      description: item.description || '',
      category: item.category || 'rooms',
    });
    setImageUrls(item.images || []);
    setPendingFiles([]);
    setPendingPreviews([]);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.error('Only image files are allowed');
    }

    const previews = validFiles.map((f) => URL.createObjectURL(f));
    setPendingFiles((prev) => [...prev, ...validFiles]);
    setPendingPreviews((prev) => [...prev, ...previews]);
    // Reset input so same file can be picked again
    e.target.value = '';
  };

  const removePending = (idx) => {
    URL.revokeObjectURL(pendingPreviews[idx]);
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
    setPendingPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExisting = (idx) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      await api.delete(`/api/rooms/${id}`);
      toast.success('Deleted');
      setItems((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const uploadPendingFiles = async () => {
    const uploaded = [];
    for (const file of pendingFiles) {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      uploaded.push(data.url);
    }
    return uploaded;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload any new files first
      const newUrls = pendingFiles.length > 0 ? await uploadPendingFiles() : [];
      const allImages = [...imageUrls, ...newUrls];

      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        images: allImages,
        isAvailable: true,
      };

      if (editing) {
        await api.put(`/api/rooms/${editing}`, payload);
        toast.success('Updated');
      } else {
        await api.post('/api/rooms', payload);
        toast.success('Created');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const categoryLabel = (val) =>
    CATEGORIES.find((c) => c.value === val)?.label ?? val;

  const tabCounts = {
    all: items.length,
    rooms: items.filter((i) => i.category === 'rooms').length,
    pool: items.filter((i) => i.category === 'pool').length,
    amenities: items.filter((i) => i.category === 'amenities').length,
  };

  return (
    <div className="bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Manage Gallery</h1>
            <p className="text-stone-500 mt-1">Upload photos for Rooms, Pool, or Amenities.</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow"
          >
            + Add Item
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[{ value: 'all', label: 'All' }, ...CATEGORIES].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                activeTab === tab.value
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-teal-400'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.value ? 'bg-teal-500 text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                {tabCounts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg">No items yet.</p>
            <p className="text-sm mt-1">Click <strong>"+ Add Item"</strong> to post your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-44 object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-44 bg-stone-100 flex items-center justify-center text-stone-300 text-sm">
                    No image
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-stone-800 text-lg">{item.name}</h3>
                    <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full capitalize">
                      {categoryLabel(item.category)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-stone-500 text-sm line-clamp-2 flex-grow">{item.description}</p>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex-1 text-sm font-semibold text-teal-600 border border-teal-300 hover:bg-teal-50 rounded-xl py-1.5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 rounded-xl py-1.5 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-800">
                {editing ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-stone-700 font-medium mb-1 text-sm">Category *</label>
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat.value })}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                        form.category === cat.value
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-stone-600 border-stone-300 hover:border-teal-400'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-stone-700 font-medium mb-1 text-sm">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={`e.g. ${form.category === 'rooms' ? 'Deluxe Suite' : form.category === 'pool' ? 'Infinity Pool' : 'Free Wi-Fi'}`}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-700 font-medium mb-1 text-sm">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description shown to guests..."
                  className="w-full border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-stone-700 font-medium mb-2 text-sm">Photos</label>

                {/* Existing saved images */}
                {imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative group w-20 h-20">
                        <img
                          src={url}
                          alt={`Image ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-xl border border-stone-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExisting(idx)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending new images (not yet uploaded) */}
                {pendingPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pendingPreviews.map((src, idx) => (
                      <div key={idx} className="relative group w-20 h-20">
                        <img
                          src={src}
                          alt={`New ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-xl border-2 border-dashed border-amber-400"
                        />
                        <button
                          type="button"
                          onClick={() => removePending(idx)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-amber-500/80 text-white text-[10px] text-center py-0.5 rounded-b-xl">
                          pending
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-stone-300 hover:border-teal-400 text-stone-500 hover:text-teal-600 rounded-xl text-sm font-medium transition-colors w-full justify-center"
                >
                  <ImagePlus className="w-4 h-4" />
                  {imageUrls.length + pendingPreviews.length === 0
                    ? 'Click to upload photos'
                    : 'Add more photos'}
                </button>
                <p className="text-xs text-stone-400 mt-1.5">
                  JPG, PNG, WebP — max 10 MB each. Images will upload when you save.
                </p>
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
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-stone-900 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-stone-600 border-t-transparent" />
                      {pendingFiles.length > 0 ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>{editing ? 'Save Changes' : 'Create'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
