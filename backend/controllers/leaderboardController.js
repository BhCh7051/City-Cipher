const User = require('../models/User');

const getLeaderboard = async (req, res) => {
  try {
    // Get top 10 users sorted by correct answers
    const leaderboard = await User.find()
      .select('username score correct')
      .sort({ 'score.correct': -1 })
      .limit(10)
      .lean();

    // Calculate win rate for each user
    const leaderboardWithStats = leaderboard.map(user => ({
      username: user.username,
      correct: user.score.correct,
      incorrect: user.score.incorrect,
      winRate: user.score.correct + user.score.incorrect > 0 
        ? ((user.score.correct / (user.score.correct + user.score.incorrect)) * 100).toFixed(1)
        : 0
    }));

    res.json(leaderboardWithStats);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

module.exports = {
  getLeaderboard
}; 