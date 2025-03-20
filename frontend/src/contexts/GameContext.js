import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getRandomDestination, 
  checkAnswer, 
  updateUserScore,
  loginUser,
  registerUser,
  logoutUser,
  getUserScore
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
    setIsLoading(true);
    
    try {
      const data = await checkAnswer(currentQuestion.id, selectedOption);
      setResult(data);
      
      // Update local score
      if (data.isCorrect) {
        setScore(prev => ({
          correct: (prev.correct || 0) + 1,
          incorrect: prev.incorrect || 0
        }));
      } else {
        setScore(prev => ({
          correct: prev.correct || 0,
          incorrect: (prev.incorrect || 0) + 1
        }));
      }
      
      // Update server score if user is logged in
      if (user && user.username) {
        try {
          const updatedScore = await updateUserScore(user.username, data.isCorrect);
          if (updatedScore && updatedScore.score) {
            setScore(updatedScore.score);
          }
        } catch (error) {
          console.error('Error updating score on server:', error);
        }
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
      
      // If userData already has score, use it
      if (userData.score && userData.score.correct !== undefined) {
        setScore(userData.score);
        return;
      }
      
      // Otherwise try to fetch score
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

  // Load first question on mount
  useEffect(() => {
    loadQuestion();
  }, []);

  return (
    <GameContext.Provider value={{
      currentQuestion,
      options,
      isLoading,
      result,
      score,
      user,
      authError,
      loadQuestion,
      submitAnswer,
      updateUser,
      resetGame,
      handleLogin,
      handleRegister,
      handleLogout
    }}>
      {children}
    </GameContext.Provider>
  );
};