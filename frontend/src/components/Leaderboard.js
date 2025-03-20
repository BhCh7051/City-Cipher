import React from 'react';
import styled from 'styled-components';
import { useGameContext } from '../contexts/GameContext';
import LoadingSpinner from './LoadingSpinner';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const LeaderboardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 1rem;
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;

  &:last-child {
    text-align: right;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  text-align: ${props => props.align || 'left'};
`;

const TableRow = styled.tr`
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const Leaderboard = () => {
  const { leaderboard, isLeaderboardLoading, isLeaderboardOpen, toggleLeaderboard } = useGameContext();

  if (!isLeaderboardOpen) return null;

  if (isLeaderboardLoading) {
    return (
      <Overlay>
        <LoadingSpinner text="Loading leaderboard..." />
      </Overlay>
    );
  }

  return (
    <Overlay>
      <LeaderboardContainer>
        <CloseButton onClick={toggleLeaderboard}>×</CloseButton>
        <Title>Global Leaderboard</Title>
        <Table>
          <thead>
            <tr>
              <TableHeader>Rank</TableHeader>
              <TableHeader>Username</TableHeader>
              <TableHeader>Correct Answers</TableHeader>
              <TableHeader>Win Rate</TableHeader>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <TableRow key={user.username}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.correct}</TableCell>
                <TableCell align="right">{user.winRate}%</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </LeaderboardContainer>
    </Overlay>
  );
};

export default Leaderboard; 