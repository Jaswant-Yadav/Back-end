const express = require("express");
const cors = require('cors');
const app = express();
require('./db/config');
const session = require('express-session');

const venueRoutes = require('./routes/venues')

app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL
  credentials: true
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

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid username & password' });
  req.session.user = { username: user.username, role: user.role };
  res.json({ role: user.role });
});


app.use('/api/venues', venueRoutes);

app.use('/api/venues', venueRoutes)


app.listen(5000, () => console.log('Server running on http://localhost:5000'));