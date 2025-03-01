import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WhatsappShareButton, WhatsappIcon } from 'react-share';
import html2canvas from 'html2canvas';

const ShareContainer = styled(motion.div)`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-top: 1.5rem;
  max-width: 800px;
  width: 100%;
`;

const Title = styled.h3`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ShareCard = styled.div`
  background: linear-gradient(135deg, #4a6bfd 0%, #26de81 100%);
  border-radius: var(--border-radius);
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const ShareContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 2;
`;

const UserName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const ScoreInfo = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const InviteText = styled.p`
  font-size: 1.4rem;
  font-weight: 600;
  margin: 1.5rem 0;
`;

const InviteCode = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.8rem;
  border-radius: var(--border-radius);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin: 1rem 0;
  letter-spacing: 2px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CopyButton = styled(motion.button)`
  background: var(--secondary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ShareInvite = ({ user, baseUrl }) => {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const shareCardRef = useRef(null);
  
  const inviteUrl = `${baseUrl}/invite/${user.inviteCode}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const generateShareImage = async () => {
    if (shareCardRef.current && !imageUrl) {
      const canvas = await html2canvas(shareCardRef.current);
      const imgUrl = canvas.toDataURL('image/png');
      setImageUrl(imgUrl);
      return imgUrl;
    }
    return imageUrl;
  };
  
  return (
    <ShareContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Challenge Your Friends!</Title>
      
      <ShareCard ref={shareCardRef}>
        <ShareContent>
          <h3>🌍 GLOBETROTTER CHALLENGE</h3>
          <UserName>{user.username}</UserName>
          <ScoreInfo>
            Has answered {user.score.correct} questions correctly
            with {Math.round((user.score.correct / (user.score.correct + user.score.incorrect || 1)) * 100)}% accuracy
          </ScoreInfo>
          
          <InviteText>🎮 Can you beat their score?</InviteText>
          
          <InviteCode>{user.inviteCode}</InviteCode>
        </ShareContent>
      </ShareCard>
      
      <ButtonsContainer>
        <CopyButton
          onClick={handleCopyLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? '✓ Copied!' : '📋 Copy Invite Link'}
        </CopyButton>
        
        <WhatsappShareButton
          url={inviteUrl}
          title={`I challenge you to beat my score in Globetrotter! I've got ${user.score.correct} correct answers. Can you do better? 🌍`}
          beforeOnClick={generateShareImage}
          separator=" - "
        >
          <WhatsappIcon size={48} round />
        </WhatsappShareButton>
      </ButtonsContainer>
    </ShareContainer>
  );
};

export default ShareInvite;