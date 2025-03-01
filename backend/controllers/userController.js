const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username } = req.body;
    
    // Check if username exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Generate a unique invite code
    const inviteCode = uuidv4().substring(0, 8);
    
    // Create user
    const user = await User.create({
      username,
      inviteCode
    });
    
    res.status(201).json({
      username: user.username,
      score: user.score,
      inviteCode: user.inviteCode
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by invite code
const getUserByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    
    const user = await User.findOne({ inviteCode });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      username: user.username,
      score: user.score
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user score
const updateScore = async (req, res) => {
  try {
    const { username, isCorrect } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update score based on answer
    if (isCorrect) {
      user.score.correct += 1;
    } else {
      user.score.incorrect += 1;
    }
    
    await user.save();
    
    res.json({
      username: user.username,
      score: user.score
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  getUserByInviteCode,
  updateScore
};