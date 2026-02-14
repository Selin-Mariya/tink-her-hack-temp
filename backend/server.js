const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const interestRoutes = require('./routes/interestRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const matchRoutes = require('./routes/matchRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/teams', teamRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Campus Skill-Match Engine API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Campus Skill-Match Engine API running on port ${PORT}`);
});
