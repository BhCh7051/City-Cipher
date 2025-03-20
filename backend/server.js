require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
// add logger
const logger = require('morgan');
const app = express();
app.use(logger('dev'));

// Connect to database only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB(process.env.MONGODB_URI);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;