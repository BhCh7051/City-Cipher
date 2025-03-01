import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGameContext } from '../contexts/GameContext';
import DestinationCard from './DestinationCard';
import AnswerFeedback from './AnswerFeedback';
import ScoreDisplay from './ScoreDisplay';
import ShareInvite from './ShareInvite';
import LoadingSpinner from './LoadingSpinner';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const SubmitButton = styled(motion.button)`
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  
  svg {
    margin-left: 0.5rem;
  }
`;

const ShareButton = styled(motion.button)`
  margin-top: 1.5rem;
  background: var(--secondary-color);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GameScreen = () => {
  const { 
    currentQuestion, 
    options, 
    isLoading, 
    result, 
    score, 
    user,
    submitAnswer, 
    loadQuestion 
  } = useGameContext();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [showShare, setShowShare] = useState(false);
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };
  
  const handleSubmit = () => {
    if (selectedOption) {
      submitAnswer(selectedOption);
    }
  };
  
  const handleNextQuestion = () => {
    setSelectedOption(null);
    loadQuestion();
    setShowShare(false);
  };
  
  const toggleShare = () => {
    setShowShare(!showShare);
  };
  
  if (isLoading && !currentQuestion) {
    return (
      <GameContainer>
        <LoadingSpinner text="Loading the next destination..." />
      </GameContainer>
    );
  }
  
  if (!currentQuestion) {
    return (
      <GameContainer>
        <p>Something went wrong. Please try again.</p>
      </GameContainer>
    );
  }
  
  return (
    <GameContainer>
      <ScoreDisplay score={score} />
      
      <DestinationCard 
        clues={currentQuestion.clues}
        options={options}
        selectedOption={selectedOption}
        onOptionSelect={handleOptionSelect}
        isDisabled={!!result || isLoading}
      />
      
      {!result && !isLoading && (
        <SubmitButton 
          onClick={handleSubmit}
          disabled={!selectedOption}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit Answer
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </SubmitButton>
      )}
      
      {isLoading && <LoadingSpinner text="Checking your answer..." />}
      
      {result && (
        <>
          <AnswerFeedback result={result} onNext={handleNextQuestion} />
          
          {user && !showShare && (
            <ShareButton 
              onClick={toggleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Challenge a Friend
            </ShareButton>
          )}
          
          {user && showShare && (
            <ShareInvite 
              user={user}
              baseUrl={window.location.origin}
            />
          )}
        </>
      )}
    </GameContainer>
  );
};

export default GameScreen;