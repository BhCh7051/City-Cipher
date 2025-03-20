import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, isLoading, authError } = useGameContext();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types
    setValidationError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setValidationError('Username is required');
      return false;
    }
    if (!formData.password) {
      setValidationError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await handleLogin(formData.username, formData.password);
      navigate('/game'); // Redirect to game page after successful login
    } catch (error) {
      // Error is already handled in the context
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p className="subtitle">Login to continue your globetrotting adventure</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          {(validationError || authError) && (
            <div className="error-message">
              {validationError || authError}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 