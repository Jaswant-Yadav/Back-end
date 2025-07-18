const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  date: String, // ISO string
  user: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
