import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { registerUser } from '../utils/api';
import { useGameContext } from '../contexts/GameContext';

const WelcomeContainer = styled(motion.div)`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 2.5rem;
`;

const Subtitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 2rem;
  font-size: 1.2rem;
  opacity: 0.8;
`;

const GameRules = styled.div`
  margin: 2rem 0;
  text-align: left;
  
  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    
    &:before {
      content: '🌍';
      margin-right: 0.8rem;
    }
  }
`;

const Form = styled.form`
  margin-top: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: var(--border-radius);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Button = styled(motion.button)`
  margin-top: 1.5rem;
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  margin-top: 1rem;
`;

const WelcomeScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useGameContext();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const userData = await registerUser(username, password);
      updateUser(userData);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <WelcomeContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>🌍 Globetrotter</Title>
      <Subtitle>The Ultimate Travel Guessing Game!</Subtitle>
      
      <GameRules>
        <h3>How to Play:</h3>
        <ul>
          <li>Read the clues about a famous destination</li>
          <li>Choose the correct city from the options</li>
          <li>Learn fun facts and trivia about each place</li>
          <li>Challenge your friends to beat your score!</li>
        </ul>
      </GameRules>
      
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Choose your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
        />
        
        <Input
          type="password"
          placeholder="Choose your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Starting Your Journey...' : 'Start Your Journey!'}
        </Button>
      </Form>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;