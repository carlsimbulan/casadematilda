const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { protect } = require('../middleware/authMiddleware');

// Whole-property nightly rate
const NIGHTLY_RATE = 5000; // ₱5,000 per night — adjust as needed

// POST /api/reservations — create a whole-property reservation (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { checkIn, checkOut, guests, specialRequests } = req.body;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    // Check for conflicting reservations on those dates
    const conflict = await Reservation.findOne({
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
      ],
    });

    if (conflict) {
      return res.status(400).json({
        message: 'Casa de Matilda is already reserved for those dates. Please choose different dates.',
      });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOutDate - checkInDate) / msPerDay);
    const totalPrice = NIGHTLY_RATE * nights;

    const reservation = await Reservation.create({
      user: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || 1,
      totalPrice,
      specialRequests: specialRequests || '',
      includesWholeProperty: true,
    });

    const populated = await reservation.populate('user', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: 'Server error creating reservation' });
  }
});

// GET /api/reservations/my — get current user's reservations (protected)
router.get('/my', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    console.error('Get my reservations error:', error);
    res.status(500).json({ message: 'Server error fetching reservations' });
  }
});

// GET /api/reservations/availability — check availability for a date range (public)
router.get('/availability', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'checkIn and checkOut query params required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const conflict = await Reservation.findOne({
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
      ],
    });

    res.json({ available: !conflict });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ message: 'Server error checking availability' });
  }
});

// PUT /api/reservations/:id/cancel — cancel own reservation (protected)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation is already cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ message: 'Server error cancelling reservation' });
  }
});

module.exports = router;
