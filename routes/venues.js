const express = require('express');
const router = express.Router();
const Venue = require('../models/venue');
const Booking = require('../models/booking');
const venue = require('../models/venue');

// Fetch all venues
router.get('/', async (req, res) => {
  const venues = await Venue.find();
  res.json(venues);
});

// Add a new venue
router.post('/', async (req, res) => {
  const { name, location, capacity, unavailableDates } = req.body;
  try {
    const venue = new Venue({
      name,
      location,
      capacity,
      unavailableDates: Array.isArray(unavailableDates) ? unavailableDates : [],
    });
    await venue.save();
    res.status(201).json(venue);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add venue' });
  }
});

// Block a date for a venue
router.post('/:id/block', async (req, res) => {
  const { date } = req.body;
  const venue = await Venue.findById(req.params.id);
  if (!venue.unavailableDates.includes(date)) {
    venue.unavailableDates.push(date);
    await venue.save();
  }
  res.json(venue);
});

// Book a venue
router.post('/:id/book', async (req, res) => {
  const { date, user } = req.body;
  const venue = await Venue.findById(req.params.id);

  if (venue.unavailableDates.includes(date)) {
    return res.status(400).json({ error: 'Date is unavailable' });
  }

  const existingBooking = await Booking.findOne({ venueId: venue._id, date });
  if (existingBooking) {
    return res.status(400).json({ error: 'Already booked' });
  }

  const booking = new Booking({ venueId: venue._id, date, user });
  await booking.save();

  venue.unavailableDates.push(date);
  await venue.save();

  res.json({ success: true, booking });
});

router.delete('/delete/:id', async (req, resp) => {
    const result = await venue.deleteOne({ _id: req.params.id })
    resp.send(result);
});

// PUT venues availability
router.put('/:id/availability', async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  try {
    const venue = await Venue.findById(id);
    if (!venue) return res.status(404).json({ error: "Venue not found" });

    if (!venue.unavailableDates.includes(date)) {
      venue.unavailableDates.push(date);
      await venue.save();
    }

    res.json({ message: 'Date added', venue });
  } catch (err) {
    res.status(500).json({ error: "Failed to update availability" });
  }
});


module.exports = router;
