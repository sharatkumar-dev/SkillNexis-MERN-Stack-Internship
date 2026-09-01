const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[Server] To-Do List API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[Health] http://localhost:${PORT}/api/health`);
      console.log(`[API]    http://localhost:${PORT}/api/tasks`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Fatal] Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Handle Graceful Termination
    process.on('SIGTERM', () => {
      console.info('[Server] SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] Process terminated.');
      });
    });
  } catch (error) {
    console.error(`[Fatal] Server initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
