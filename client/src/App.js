import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calendar from './CalendarPage.js';
import Main from './MainPage.js';
import Home from './HomePage.js';
import RegisterPage from './Registration.js';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/calendarpage" element={<Calendar />} />
        <Route path="/onTrack" element={<Main />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/registerpage" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
