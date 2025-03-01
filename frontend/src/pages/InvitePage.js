import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getUserByInviteCode, registerUser } from '../utils/api';
import { useGameContext } from '../contexts/GameContext';
import LoadingSpinner from '../components/LoadingSpinner';

const InviteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
`;

const InviteCard = styled(motion.div)`
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
`;

const UserInfo = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(74, 107, 253, 0.1);
  border-radius: var(--border-radius);
`;

const UserName = styled.h2`
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const ScoreInfo = styled.p`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
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

const InvitePage = () => {
  const [invitedUser, setInvitedUser] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useGameContext();
  
  useEffect(() => {
    const fetchInvitedUser = async () => {
      try {
        const userData = await getUserByInviteCode(inviteCode);
        setInvitedUser(userData);
      } catch (error) {
        setError('Invalid invite code. Please check and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (inviteCode) {
      fetchInvitedUser();
    } else {
      setIsLoading(false);
      setError('No invite code provided');
    }
  }, [inviteCode]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username to continue');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const userData = await registerUser(username);
      updateUser(userData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <InviteContainer>
        <LoadingSpinner text="Loading invitation..." />
      </InviteContainer>
    );
  }
  
  if (error && !invitedUser) {
    return (
      <InviteContainer>
        <InviteCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Invitation Error</Title>
          <ErrorMessage>{error}</ErrorMessage>
          <Button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Homepage
          </Button>
        </InviteCard>
      </InviteContainer>
    );
  }
  
  return (
    <InviteContainer>
      <InviteCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>🌍 You've Been Challenged!</Title>
        
        {invitedUser && (
          <UserInfo>
            <UserName>{invitedUser.username}</UserName>
            <ScoreInfo>
              Has answered {invitedUser.score.correct} questions correctly
              with {Math.round((invitedUser.score.correct / (invitedUser.score.correct + invitedUser.score.incorrect || 1)) * 100)}% accuracy
            </ScoreInfo>
            <p>Can you beat their score?</p>
          </UserInfo>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter your username to start"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? 'Starting Your Journey...' : 'Accept the Challenge!'}
          </Button>
        </Form>
      </InviteCard>
    </InviteContainer>
  );
};

export default InvitePage;