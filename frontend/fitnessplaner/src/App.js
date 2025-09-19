import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import NavBar from './components/Reusable/NavBar';
import Footer from './components/Reusable/Footer';

import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TrackNutrition from './components/TrackNutrition';
import WorkoutSchedule from './components/WorkoutSchedule';
import FoodLookup from './components/FoodLookup';
import CoachDashboard from './components/CoachDashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';


function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  // Rute gde NE želimo da se prikazuje NavBar
  const noNavRoutes = ['/', '/register', '/dashboard', '/forgot-password', '/reset-password', '/admin-dashboard'];
  const showNav = !noNavRoutes.includes(location.pathname) && role !== 'coach';

  // Rute gde NE želimo da se prikazuje Footer
  const noFooterRoutes = ['/', '/register', '/forgot-password', '/reset-password'];
  const showFooter = !noFooterRoutes.includes(location.pathname);

  // Logout funkcija - briše token i preusmerava na login
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {showNav && <NavBar />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/track-nutrition" element={<TrackNutrition />} />
        <Route path="/workout-schedule" element={<WorkoutSchedule />} />
        <Route path="/food-check" element={<FoodLookup  />} />
        <Route path="/coach-dashboard" element={<CoachDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>

      {showFooter && <Footer onLogout={handleLogout} token={localStorage.getItem('token')} />}

    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
