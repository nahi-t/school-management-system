

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'https://school-management-system-swti.onrender.com',
    'https://school-management-system-1-sm6u.onrender.com',
    'https://school-management-system-theta-black-nahi.vercel.app',
    'https://*.vercel.app',
    'https://*.netlify.app',
    'http://localhost:4200'
  ],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

/* ================= API ROUTES ================= */

// Mount API routes BEFORE 404 handler
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/marks', require('./routes/marks'));

// Debug: Log registered routes
console.log('API Routes mounted:');
console.log('- /api/auth -> auth routes');
console.log('- /api/users -> user routes');
console.log('- /api/subjects -> subject routes');
console.log('- /api/grades -> grade routes');
console.log('- /api/marks -> mark routes');

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/* =============== PRODUCTION CONFIG =============== */

// Handle 404 for API routes (AFTER all other routes)
app.use('/api/*', (req, res) => {
  console.log('404 for API route:', req.url);
  res.status(404).json({ message: 'API endpoint not found' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'School Management API is running',
    timestamp: new Date().toISOString()
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});