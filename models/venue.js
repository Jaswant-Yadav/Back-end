const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  unavailableDates: { type: [String], default: [] }
});

module.exports = mongoose.model('Venue', venueSchema);
