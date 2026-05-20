import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import BottomNav from './components/BottomNav';
import MembersPage from './pages/Members';
import CohortsPage from './pages/Cohorts';
import MatchingPage from './pages/Matching';
import RelationsPage from './pages/Relations';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
        <Routes>
          <Route path="/" element={<MembersPage />} />
          <Route path="/cohorts" element={<CohortsPage />} />
          <Route path="/matching" element={<MatchingPage />} />
          <Route path="/relations" element={<RelationsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
