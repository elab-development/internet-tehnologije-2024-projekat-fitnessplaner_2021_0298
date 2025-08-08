import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav style={{ backgroundColor: '#1E40AF', padding: '10px 20px', color: 'white', display: 'flex', gap: '20px' }}>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
      <Link to="/workout-schedule" style={{ color: 'white', textDecoration: 'none' }}>Workout Schedule</Link>
      <Link to="/track-nutrition" style={{ color: 'white', textDecoration: 'none' }}>Track Nutrition</Link>
    </nav>
  );
}
