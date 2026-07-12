const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const PRICING_KEY = 'nightlyRate';
const DEFAULT_RATE = 5000;

// GET /api/settings/pricing — public, returns current nightly rate
router.get('/pricing', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: PRICING_KEY });
    const nightlyRate = setting ? setting.value : DEFAULT_RATE;
    res.json({ nightlyRate });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ message: 'Server error fetching pricing' });
  }
});

// PUT /api/settings/pricing — admin only, updates nightly rate
router.put('/pricing', protect, adminOnly, async (req, res) => {
  try {
    const { nightlyRate } = req.body;

    if (nightlyRate === undefined || isNaN(Number(nightlyRate)) || Number(nightlyRate) < 0) {
      return res.status(400).json({ message: 'nightlyRate must be a non-negative number' });
    }

    const setting = await Settings.findOneAndUpdate(
      { key: PRICING_KEY },
      { value: Number(nightlyRate) },
      { upsert: true, new: true }
    );

    res.json({ nightlyRate: setting.value });
  } catch (error) {
    console.error('Update pricing error:', error);
    res.status(500).json({ message: 'Server error updating pricing' });
  }
});

module.exports = router;
