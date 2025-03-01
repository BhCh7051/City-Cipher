import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import InvitePage from './pages/InvitePage';

function App() {
  return (
    <Router>
      <GameProvider>
        <GlobalStyles />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/invite/:inviteCode" element={<InvitePage />} />
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;