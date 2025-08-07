import React, { useEffect, useState } from 'react';
import DailyMessage from './DailyMessage';

import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [totalCalories, setTotalCalories] = useState(null);
  const [totalWater, setTotalWater] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchTotals = async () => {
      try {
        const [caloriesRes, waterRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/nutrition-entries/total-calories', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://127.0.0.1:8000/api/hydration-entries/total-ml', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setTotalCalories(caloriesRes.data.total_calories);
        setTotalWater(waterRes.data.total_water_ml);
      } catch (error) {
        console.error('Greška prilikom dohvaćanja ukupnih vrednosti:', error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="dashboard-container p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to Fitness Planner</h1>
      <DailyMessage />


      <div className="dashboard-buttons mb-8 space-y-4">
        <Link
          to="/workout-schedule"
          className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
        >
          Workout Schedule
        </Link>
        <Link
          to="/track-nutrition"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
        >
          Track Nutrition
        </Link>
      </div>

      <div className="summary-info bg-gray-100 p-4 rounded shadow text-center mt-10">
        <h2 className="text-xl font-semibold mb-2">Zanimljivost do sada:</h2>
        <p className="text-lg">
          Ukupno kalorija uneto:{" "}
          <span className="font-bold">{totalCalories ?? '...'}</span> kcal
        </p>
        <p className="text-lg">
          Ukupno vode uneto:{" "}
          <span className="font-bold">{totalWater ?? '...'}</span> ml
        </p>
      </div>
    </div>
  );
}
