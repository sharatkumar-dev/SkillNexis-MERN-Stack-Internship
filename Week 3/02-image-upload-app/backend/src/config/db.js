const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/image_upload_app';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Connection Notice] Could not connect to MongoDB at: ${mongoUri}`);
    console.error(`[Database Tip] To connect to MongoDB:`);
    console.error(`  1. Ensure MongoDB service is active locally (e.g. 'net start MongoDB' or 'mongod').`);
    console.error(`  2. Or configure MONGO_URI in backend/.env with your MongoDB Atlas URI.`);
    console.error(`  3. The server remains active to serve healthcheck and diagnostic endpoints.`);
  }
};

module.exports = connectDB;
