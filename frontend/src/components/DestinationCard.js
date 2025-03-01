import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  width: 100%;
`;

const ClueContainer = styled.div`
  margin-bottom: 2rem;
`;

const ClueTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ClueText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid var(--primary-color);
  padding-left: 1rem;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const OptionButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  background: white;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : '#ddd'};
  color: ${props => props.selected ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: 600;
  border-radius: var(--border-radius);
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .city {
    font-size: 1.2rem;
    margin-bottom: 0.2rem;
  }
  
  .country {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const DestinationCard = ({ 
  clues, 
  options, 
  selectedOption, 
  onOptionSelect,
  isDisabled
}) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ClueContainer>
        <ClueTitle>Where in the world is this place?</ClueTitle>
        {clues.map((clue, index) => (
          <ClueText key={index}>"{clue}"</ClueText>
        ))}
      </ClueContainer>
      
      <OptionsContainer>
        {options.map((option, index) => (
          <OptionButton
            key={index}
            selected={selectedOption && 
              selectedOption.city === option.city && 
              selectedOption.country === option.country}
            onClick={() => onOptionSelect(option)}
            disabled={isDisabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="city">{option.city}</span>
            <span className="country">{option.country}</span>
          </OptionButton>
        ))}
      </OptionsContainer>
    </Card>
  );
};

export default DestinationCard;