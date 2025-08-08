import React from 'react';
import LiveClock from '../LiveClock';

export default function Footer({ onLogout }) {
  return (
    <footer className="footer">
      <div>Fitness Planner &copy; {new Date().getFullYear()}</div>

      <div className="text-center">
          <LiveClock />
        </div>

      <div>
        <a href="/support" className="text-blue-600 hover:underline mr-4">
          Podrška
        </a>
        <button
          onClick={onLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </footer>
  );
}