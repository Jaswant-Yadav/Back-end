const mongoose = require('mongoose');
require('dotenv').config(); // ✅ Load environment variables

const dbURI = process.env.MONGO_URL;

if (!dbURI) {
  console.error("❌ MONGO_URL is undefined. Check your .env file.");
  process.exit(1); // Exit to avoid connecting with undefined URI
}

mongoose.connect(dbURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
