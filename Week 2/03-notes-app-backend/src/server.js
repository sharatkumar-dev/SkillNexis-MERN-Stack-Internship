require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Set port from environment or fallback to 5002
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
connectDB();

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`[Server] Notes App API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle unexpected exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Uncaught Exception] ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('[SIGTERM] Termination signal received. Closing HTTP server...');
  server.close(() => {
    console.log('[Server] Process terminated gracefully');
  });
});

process.on('SIGINT', () => {
  console.log('[SIGINT] Interrupt signal received. Closing HTTP server...');
  server.close(() => {
    console.log('[Server] Process terminated gracefully');
    process.exit(0);
  });
});
