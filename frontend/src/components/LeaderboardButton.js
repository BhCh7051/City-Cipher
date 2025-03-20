import React from 'react';
import styled from 'styled-components';
import { useGameContext } from '../contexts/GameContext';

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const LeaderboardButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isOpen ? 'var(--secondary-color)' : 'var(--primary-color)'};
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LeaderboardButtonComponent = () => {
  const { toggleLeaderboard, isLeaderboardOpen } = useGameContext();

  return (
    <ButtonContainer>
      <LeaderboardButton
        onClick={toggleLeaderboard}
        isOpen={isLeaderboardOpen}
      >
        {isLeaderboardOpen ? '×' : '🏆'}
      </LeaderboardButton>
    </ButtonContainer>
  );
};

export default LeaderboardButtonComponent; 