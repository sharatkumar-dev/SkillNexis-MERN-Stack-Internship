const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notes App API is operational',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// 404 handler for unrecognized routes
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
