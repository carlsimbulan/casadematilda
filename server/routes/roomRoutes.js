const express = require('express');
const router = express.Router();
const { del } = require('@vercel/blob');
const Room = require('../models/Room');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Helper — delete an array of Vercel Blob URLs (ignores errors so it never blocks the main op)
const deleteBlobUrls = async (urls = []) => {
  const blobUrls = urls.filter((u) => u && u.includes('vercel-storage.com'));
  if (!blobUrls.length) return;
  try {
    await del(blobUrls);
  } catch (err) {
    console.error('Blob delete error (non-fatal):', err.message);
  }
};

// GET /api/rooms — public, list all available items (optionally filter by category)
router.get('/', async (req, res) => {
  try {
    const filter = { isAvailable: true };
    if (req.query.category) filter.category = req.query.category;
    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error fetching rooms' });
  }
});

// GET /api/rooms/:id — public, get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error fetching room' });
  }
});

// POST /api/rooms — admin only, create room
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, category, price, capacity, images, isAvailable } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const room = await Room.create({
      name,
      description,
      category: category || 'rooms',
      price: price || 0,
      capacity,
      images,
      isAvailable,
    });

    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error creating room' });
  }
});

// PUT /api/rooms/:id — admin only, update room
// Auto-deletes removed images from Vercel Blob
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Find images that were removed (in old list but not in new list)
    const oldImages = room.images || [];
    const newImages = req.body.images || [];
    const removedImages = oldImages.filter((url) => !newImages.includes(url));

    // Delete removed images from Blob storage
    await deleteBlobUrls(removedImages);

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedRoom);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error updating room' });
  }
});

// DELETE /api/rooms/:id — admin only, delete room + its blob images
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Delete all images from Blob storage first
    await deleteBlobUrls(room.images);

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error deleting room' });
  }
});

module.exports = router;
