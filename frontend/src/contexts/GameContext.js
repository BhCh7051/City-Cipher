import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getRandomDestination, 
  checkAnswer, 
  updateUserScore 
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
        setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
      
      // Update server score if user is logged in
      if (user) {
        await updateUserScore(user.username, data.isCorrect);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    setScore(userData.score);
  };

  // Reset game state
  const resetGame = () => {
    setCurrentQuestion(null);
    setOptions([]);
    setResult(null);
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
      loadQuestion,
      submitAnswer,
      updateUser,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};