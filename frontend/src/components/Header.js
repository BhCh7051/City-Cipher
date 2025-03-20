import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import { logoutUser } from '../utils/api';

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

const LoginLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
  
  &:hover {
    background: var(--primary-color);
    color: white;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: 2px solid var(--error-color);
  color: var(--error-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
  
  &:hover {
    background: var(--error-color);
    color: white;
  }
`;

const Header = () => {
  const { user } = useGameContext();

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        🌍 <span>Globetrotter</span>
      </Logo>
      
      {user ? (
        <UserInfo>
          <UserName>
            Welcome, {user.username}!
          </UserName>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </UserInfo>
      ) : (
        <LoginLink to="/login">Login</LoginLink>
      )}
    </HeaderContainer>
  );
};

export default Header;