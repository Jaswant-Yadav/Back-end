const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: String,
  location: String,
  capacity: Number,
  unavailableDates: [String], // ISO date strings
});

module.exports = mongoose.model('Venue', venueSchema);
