const Destination = require('../models/Destination');

// Get a random destination with limited info (just clues)
const getRandomDestination = async (req, res) => {
  try {
    // Count total destinations
    const count = await Destination.countDocuments();
    // Get random destination
    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);
    
    // Extract only necessary info for the question
    const questionData = {
      id: destination._id,
      clues: destination.clues
    };
    
    // Get 3 more random destinations for multiple choice options
    const otherOptions = await Destination.aggregate([
      { $match: { _id: { $ne: destination._id } } },
      { $sample: { size: 3 } },
      { $project: { city: 1, country: 1 } }
    ]);
    
    // Combine correct answer with decoys
    const options = [
      { city: destination.city, country: destination.country },
      ...otherOptions
    ];
    
    // Shuffle options
    const shuffledOptions = options.sort(() => 0.5 - Math.random());
    
    res.json({
      questionData,
      options: shuffledOptions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify answer and return full destination info
const checkAnswer = async (req, res) => {
  try {
    const { destinationId, answer } = req.body;
    
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    const isCorrect = 
      destination.city.toLowerCase() === answer.city.toLowerCase() && 
      destination.country.toLowerCase() === answer.country.toLowerCase();
    
    // Return full destination data with answer result
    res.json({
      isCorrect,
      destination: {
        city: destination.city,
        country: destination.country,
        fun_fact: destination.fun_fact,
        trivia: destination.trivia
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRandomDestination,
  checkAnswer
};