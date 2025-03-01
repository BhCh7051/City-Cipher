import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ScoreContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  background: ${props => props.type === 'correct' ? 'rgba(29, 209, 161, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
  
  .label {
    font-size: 0.9rem;
    color: ${props => props.type === 'correct' ? 'var(--success-color)' : 'var(--error-color)'};
    font-weight: 600;
    margin-bottom: 0.3rem;
  }
  
  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${props => props.type === 'correct' ? 'var(--success-color)' : 'var(--error-color)'};
  }
`;

const TotalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  background: rgba(74, 107, 253, 0.1);
  
  .label {
    font-size: 0.9rem;
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 0.3rem;
  }
  
  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary-color);
  }
`;

const ScoreDisplay = ({ score }) => {
  const { correct, incorrect } = score;
  const total = correct + incorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return (
    <ScoreContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ScoreItem type="correct">
        <span className="label">Correct</span>
        <span className="value">{correct}</span>
      </ScoreItem>
      
      <ScoreItem type="incorrect">
        <span className="label">Incorrect</span>
        <span className="value">{incorrect}</span>
      </ScoreItem>
      
      <TotalItem>
        <span className="label">Accuracy</span>
        <span className="value">{accuracy}%</span>
      </TotalItem>
    </ScoreContainer>
  );
};

export default ScoreDisplay;