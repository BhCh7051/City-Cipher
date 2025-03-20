import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getRandomDestination, 
  checkAnswer, 
  updateUserScore,
  loginUser,
  registerUser,
  logoutUser,
  getUserScore,
  getLeaderboard
} from '../utils/api';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      // Try to fetch user data
      const fetchUserData = async () => {
        try {
          const userData = await getUserScore(storedUsername);
          setUser({
            username: storedUsername,
            ...userData
          });
          setScore(userData.score || { correct: 0, incorrect: 0 });
        } catch (error) {
          console.error('Error fetching stored user data:', error);
          // Clear invalid token or username
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }
      };
      fetchUserData();
    }
  }, []);

  // Load question
  const loadQuestion = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const data = await getRandomDestination();
      setCurrentQuestion(data.questionData);
      setOptions(data.options);
    } catch (error) {
      console.error('Error loading question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle answer submission
  const submitAnswer = async (selectedOption) => {
    if (!currentQuestion) {
      console.error('No question loaded');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const data = await checkAnswer(currentQuestion.id, selectedOption);
      setResult(data);
      
      // Update score automatically from the response
      if (data.score) {
        setScore(data.score);
      } else {
        // Fallback for non-logged in users or if score is not in response
        setScore(prev => ({
          correct: data.isCorrect ? (prev.correct || 0) + 1 : prev.correct || 0,
          incorrect: data.isCorrect ? prev.incorrect || 0 : (prev.incorrect || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = async (userData) => {
    if (!userData) {
      setUser(null);
      setScore({ correct: 0, incorrect: 0 });
      return;
    }
    
    setUser(userData);
    
    if (userData.username) {
      // Store username for session persistence
      localStorage.setItem('username', userData.username);
      
      // Fetch user's current score
      try {
        const userScore = await getUserScore(userData.username);
        if (userScore && userScore.score) {
          setScore(userScore.score);
        } else {
          setScore({ correct: 0, incorrect: 0 });
        }
      } catch (error) {
        console.error('Error fetching user score:', error);
        setScore({ correct: 0, incorrect: 0 });
      }
    }
  };

  // Reset game state
  const resetGame = () => {
    setCurrentQuestion(null);
    setOptions([]);
    setResult(null);
  };

  // Handle login
  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const userData = await loginUser(username, password);
      if (!userData || !userData.username) {
        throw new Error('Invalid login response');
      }
      await updateUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (username, password) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const userData = await registerUser(username, password);
      if (!userData || !userData.username) {
        throw new Error('Invalid registration response');
      }
      await updateUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // First clear local state
    setUser(null);
    setScore({ correct: 0, incorrect: 0 });
    resetGame();
    localStorage.removeItem('username');
    // Then call API logout function
    logoutUser();
  };

  // Load leaderboard
  const loadLeaderboard = async () => {
    setIsLeaderboardLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  // Load first question on mount
  useEffect(() => {
    loadQuestion();
  }, []);

  // Load leaderboard on mount and after each answer
  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Toggle leaderboard visibility
  const toggleLeaderboard = () => {
    setIsLeaderboardOpen(!isLeaderboardOpen);
    if (!isLeaderboardOpen) {
      loadLeaderboard();
    }
  };

  return (
    <GameContext.Provider value={{
      currentQuestion,
      options,
      isLoading,
      result,
      score,
      user,
      authError,
      leaderboard,
      isLeaderboardLoading,
      isLeaderboardOpen,
      loadQuestion,
      submitAnswer,
      updateUser,
      resetGame,
      handleLogin,
      handleRegister,
      handleLogout,
      loadLeaderboard,
      toggleLeaderboard
    }}>
      {children}
    </GameContext.Provider>
  );
};