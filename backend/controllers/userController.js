const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Get user score
const getUserScore = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Ensure score exists, if not initialize it
    if (!user.score) {
      user.score = {
        correct: 0,
        incorrect: 0
      };
      await user.save();
    }
    
    res.json({
      username: user.username,
      score: user.score
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if username exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Generate a unique invite code
    const inviteCode = uuidv4().substring(0, 8);
    
    // Create user with initialized score
    const user = await User.create({
      username,
      password,
      inviteCode,
      score: {
        correct: 0,
        incorrect: 0
      }
    });
    
    res.status(201).json({
      username: user.username,
      score: user.score,
      inviteCode: user.inviteCode,
      token: jwt.signToken(user._id)
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
    
    // Ensure score exists, if not initialize it
    if (!user.score) {
      user.score = {
        correct: 0,
        incorrect: 0
      };
      await user.save();
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
    
    // Ensure score exists, if not initialize it
    if (!user.score) {
      user.score = {
        correct: 0,
        incorrect: 0
      };
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
  updateScore,
  getUserScore
};