import React from 'react';
import styled from 'styled-components';
import { useGameContext } from '../contexts/GameContext';
import WelcomeScreen from '../components/WelcomeScreen';
import GameScreen from '../components/GameScreen';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
`;

const HomePage = () => {
  const { user } = useGameContext();
  
  return (
    <HomeContainer>
      {!user ? <WelcomeScreen /> : <GameScreen />}
    </HomeContainer>
  );
};

export default HomePage;