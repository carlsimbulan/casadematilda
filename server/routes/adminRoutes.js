const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// GET /api/admin/reservations — get all reservations with user populated
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    console.error('Admin get reservations error:', error);
    res.status(500).json({ message: 'Server error fetching reservations' });
  }
});

// PUT /api/admin/reservations/:id — update reservation status
router.put('/reservations/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = status;
    await reservation.save();

    const updated = await Reservation.findById(reservation._id)
      .populate('user', 'name email');

    res.json(updated);
  } catch (error) {
    console.error('Admin update reservation error:', error);
    res.status(500).json({ message: 'Server error updating reservation' });
  }
});

// GET /api/admin/stats — return counts
router.get('/stats', async (req, res) => {
  try {
    const [
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      totalRooms,
      totalUsers,
    ] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'pending' }),
      Reservation.countDocuments({ status: 'confirmed' }),
      Reservation.countDocuments({ status: 'cancelled' }),
      Room.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      totalRooms,
      totalUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

module.exports = router;
