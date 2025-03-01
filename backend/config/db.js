const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    // Use the provided URI or fall back to environment variable
    const mongoUri = uri || process.env.MONGO_URI;
    
    if (mongoose.connection.readyState === 1) {
      return; // Already connected
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;