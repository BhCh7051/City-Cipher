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

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to set token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

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
export const registerUser = async (username, password) => {
  try {
    const response = await api.post('/users/register', { username, password });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
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

// Get user score
export const getUserScore = async (username) => {
  try {
    const response = await api.get(`/users/score/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user score:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (username, password) => {
  try {
    // Clear any existing token before login
    setAuthToken(null);
    
    const response = await api.post('/users/login', { username, password });
    if (response.data && response.data.token) {
      setAuthToken(response.data.token);
      
      try {
        // Fetch updated user data including score
        const userData = await getUserScore(username);
        return {
          ...response.data,
          ...userData
        };
      } catch (scoreError) {
        console.error('Error fetching user score after login:', scoreError);
        // Return the login data even if score fetch fails
        return {
          ...response.data,
          score: { correct: 0, incorrect: 0 } // Default score
        };
      }
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  try {
    // Clear token from localStorage
    setAuthToken(null);
    // Clear axios default headers
    delete api.defaults.headers.common['Authorization'];
    
    // Redirect to login page without full page reload
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  } catch (error) {
    console.error('Error during logout:', error);
    // Force redirect if there's an error
    window.location.href = '/login';
  }
};