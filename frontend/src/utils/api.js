import axios from 'axios';

// Base URL for API - change based on your deployment
const API_URL = process.env.REACT_APP_API_URL || 'https://city-cipher-api.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get random destination
export const getRandomDestination = async () => {
  try {
    const response = await api.get('/destinations/random');
    return response.data;
  } catch (error) {
    console.error('Error fetching random destination:', error);
    throw error;
  }
};

// Check answer
export const checkAnswer = async (destinationId, answer) => {
  try {
    const response = await api.post('/destinations/check-answer', {
      destinationId,
      answer
    });
    return response.data;
  } catch (error) {
    console.error('Error checking answer:', error);
    throw error;
  }
};

// Register user
export const registerUser = async (username) => {
  try {
    const response = await api.post('/users/register', { username });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Get user by invite code
export const getUserByInviteCode = async (inviteCode) => {
  try {
    const response = await api.get(`/users/invite/${inviteCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by invite code:', error);
    throw error;
  }
};

// Update user score
export const updateUserScore = async (username, isCorrect) => {
  try {
    const response = await api.post('/users/update-score', {
      username,
      isCorrect
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user score:', error);
    throw error;
  }
};