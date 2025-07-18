const express = require("express");
const cors = require('cors');
const session = require('express-session');
require('./db/config');

const venueRoutes = require('./routes/venues');
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://front-end-seven-gilt.vercel.app'
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: 'venue-secret',
  resave: false,
  saveUninitialized: false,
}));

// Hardcoded Users
const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'owner', password: 'owner123', role: 'owner' },
];

// Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid username & password' });

  req.session.user = { username: user.username, role: user.role };
  res.json({ role: user.role });
});

// ✅ Wrap route mount in try-catch
try {
  app.use('/api/venues', venueRoutes);
} catch (err) {
  console.error("❌ Error mounting /api/venues routes:", err);
}

// ✅ Debug: Print all registered routes
setTimeout(() => {
  console.log("\n📋 Registered Routes:");
  app._router.stack
    .filter(r => r.route)
    .forEach(r => {
      console.log(`➡️  ${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
    });
}, 500); // Delay a bit so all routes are loaded

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
