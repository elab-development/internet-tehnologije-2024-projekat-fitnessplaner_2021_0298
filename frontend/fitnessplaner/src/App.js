
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TrackNutrition from './components/TrackNutrition';
import WorkoutSchedule from './components/WorkoutSchedule';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track-nutrition" element={<TrackNutrition />} />
          <Route path="/workout-schedule" element={<WorkoutSchedule />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
