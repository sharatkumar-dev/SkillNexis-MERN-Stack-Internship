const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize database
connectDB();

const app = express();

// Request logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS configuration: support Vite default port & client url
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck & root status route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Full Stack To-Do API is operational',
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// Mount modular API routers
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} does not exist on this server.`,
    errors: ['Resource not found']
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Server] To-Do backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
});

module.exports = app;
