import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  span {
    margin-left: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-weight: 600;
`;

const Header = () => {
  const { user } = useGameContext();

  return (
    <HeaderContainer>
      <Logo to="/">
        🌍 <span>Globetrotter</span>
      </Logo>
      
      {user && (
        <UserInfo>
          <UserName>
            Welcome, {user.username}!
          </UserName>
        </UserInfo>
      )}
    </HeaderContainer>
  );
};

export default Header;