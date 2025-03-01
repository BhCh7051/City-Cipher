import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const FeedbackContainer = styled(motion.div)`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-top: 1.5rem;
  max-width: 800px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0 0 0 1rem;
    color: ${props => props.isCorrect ? 'var(--success-color)' : 'var(--error-color)'};
  }
  
  .emoji {
    font-size: 2rem;
  }
`;

const FactsContainer = styled.div`
  margin-top: 1.5rem;
`;

const FactTitle = styled.h4`
  color: var(--primary-color);
  margin-bottom: 0.8rem;
`;

const FactText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  border-left: 3px solid var(--secondary-color);
`;

const DestinationName = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--primary-color);
`;

const Button = styled(motion.button)`
  margin-top: 1.5rem;
  font-size: 1.1rem;
  padding: 0.8rem 1.5rem;
`;

const AnswerFeedback = ({ result, onNext }) => {
  const { isCorrect, destination } = result;
  
  // Filter out facts to show (randomly select one fun fact and one trivia)
  const funFact = destination.fun_fact[Math.floor(Math.random() * destination.fun_fact.length)];
  const trivia = destination.trivia[Math.floor(Math.random() * destination.trivia.length)];
  
  useEffect(() => {
    // Scroll to feedback when it appears
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, []);
  
  return (
    <AnimatePresence>
      <FeedbackContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {isCorrect && <Confetti recycle={false} numberOfPieces={200} />}
        
        <ResultHeader isCorrect={isCorrect}>
          <span className="emoji">{isCorrect ? '🎉' : '😢'}</span>
          <h3>{isCorrect ? 'Correct Answer!' : 'Not quite right!'}</h3>
        </ResultHeader>
        
        <DestinationName>
          {destination.city}, {destination.country}
        </DestinationName>
        
        <FactsContainer>
          <FactTitle>Fun Fact</FactTitle>
          <FactText>{funFact}</FactText>
          
          <FactTitle style={{ marginTop: '1.5rem' }}>Did You Know?</FactTitle>
          <FactText>{trivia}</FactText>
        </FactsContainer>
        
        <Button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Another Destination
        </Button>
      </FeedbackContainer>
    </AnimatePresence>
  );
};

export default AnswerFeedback;