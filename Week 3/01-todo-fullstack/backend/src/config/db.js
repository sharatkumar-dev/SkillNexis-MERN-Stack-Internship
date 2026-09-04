const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo_fullstack';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Connection Notice] Could not connect to MongoDB at: ${mongoUri}`);
    console.error(`[Database Tip] To connect to MongoDB:`);
    console.error(`  1. If running MongoDB locally, ensure MongoDB service is active (e.g., 'net start MongoDB' or run 'mongod').`);
    console.error(`  2. Or if using MongoDB Atlas, configure MONGO_URI in your .env file with your connection string:`);
    console.error(`     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo_fullstack?retryWrites=true&w=majority`);
    console.error(`  3. The server will remain active to serve healthcheck and diagnostic endpoints.`);
  }
};

module.exports = connectDB;
