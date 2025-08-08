import React, { useEffect, useState } from 'react';
import DailyMessage from './DailyMessage';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [totalCalories, setTotalCalories] = useState(null);
  const [totalWater, setTotalWater] = useState(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

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

  const handleFetchSummary = async () => {
    const token = localStorage.getItem('token');
    if (!selectedDate) {
      setError('Molimo izaberite datum.');
      return;
    }

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/nutrition-hydration-summary?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(res.data);
      setError('');
    } catch (err) {
      setError('Došlo je do greške prilikom dohvaćanja podataka.');
      console.error(err);
    }
  };

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

      {/* Dodatak za izbor datuma i summary */}
            <div className="date-summary">
  <h2 className="date-summary-title">Pregled za odabrani datum</h2>

  <div className="date-summary-controls">
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="date-input"
    />
    <button
      onClick={handleFetchSummary}
      className="fetch-button"
    >
      Prikaži podatke
    </button>
  </div>

  {error && <p className="error-message">{error}</p>}

  {summary && (
    <div className="summary-results">
      <h3 className="summary-date">Datum: {summary.date}</h3>

      <div className="summary-section">
        <h4>Nutrition:</h4>
        {summary.nutrition.length > 0 ? (
          <ul>
            {summary.nutrition.map((entry, index) => (
              <li key={index}>
                {entry.meal_type}: {entry.calories} kcal
              </li>
            ))}
          </ul>
        ) : (
          <p>Nema unosa hrane za ovaj datum.</p>
        )}
      </div>

      <div className="summary-section">
        <h4>Hydration:</h4>
        {summary.hydration.length > 0 ? (
          <ul>
            {summary.hydration.map((entry, index) => (
              <li key={index}>{entry.amount_ml} ml</li>
            ))}
          </ul>
        ) : (
          <p>Nema unosa vode za ovaj datum.</p>
        )}
      </div>
    </div>
  )}
</div>


    </div>
  );
}
