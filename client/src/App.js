import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Calendar from './CalendarPage.js';
import Main from './MainPage.js';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/calendarpage" element={<Calendar />} />
        <Route index element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;
