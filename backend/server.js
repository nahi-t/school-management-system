

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
    'https://your-frontend-domain.vercel.app',
    'https://your-frontend-domain.netlify.app',
    'http://localhost:4200'
  ],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

/* ================= API ROUTES ================= */

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/marks', require('./routes/marks'));

/* =============== PRODUCTION CONFIG =============== */

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist/school-management');

  // Serve Angular static files
  app.use(express.static(frontendPath));

  // Angular SPA fallback (VERY IMPORTANT)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});