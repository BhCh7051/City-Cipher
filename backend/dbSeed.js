const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Destination = require('./models/Destination');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
    
    // Check if data already exists
    const count = await Destination.countDocuments();
    if (count > 0) {
      console.log(`Database already contains ${count} destinations.`);
      console.log('Skipping seed process to avoid duplicates.');
      await mongoose.disconnect();
      return;
    }
    
    // Read and parse destination data
    const filePath = path.resolve(__dirname, 'destinations.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const destinations = JSON.parse(rawData);
    
    // Insert destinations into MongoDB
    await Destination.insertMany(destinations);
    console.log(`Seeded ${destinations.length} destinations successfully!`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
  }
};

seedDatabase();
