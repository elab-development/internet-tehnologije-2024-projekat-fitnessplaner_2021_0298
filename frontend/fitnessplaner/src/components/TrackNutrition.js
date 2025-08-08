import React, { useState, useEffect } from 'react';
import Button from './Reusable/Button';
import Breadcrumbs from './Reusable/Breadcrumbs';
import NoteInput from './NoteInput';
import ProteinCalculator from './ProteinCalculator';
import axios from 'axios';

function TrackNutrition() {
  const [mealType, setMealType] = useState('');
  const [calories, setCalories] = useState('');
  const [hydrationAmount, setHydrationAmount] = useState('');
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [hydrationLogs, setHydrationLogs] = useState([]);
  const [date, setDate] = useState('');

  const [nutritionPage, setNutritionPage] = useState(1);
  const [hydrationPage, setHydrationPage] = useState(1);
  const [nutritionLastPage, setNutritionLastPage] = useState(1);
  const [hydrationLastPage, setHydrationLastPage] = useState(1);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLogs();
  }, [date, nutritionPage, hydrationPage]);

  const fetchLogs = async () => {
    try {
      const responseNutrition = await axios.get('http://localhost:8000/api/nutrition-entries', {
        params: {
          ...(date && { date }),
          page: nutritionPage,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseHydration = await axios.get('http://localhost:8000/api/hydration-entries', {
        params: {
          ...(date && { date }),
          page: hydrationPage,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setNutritionLogs(responseNutrition.data.data);
      setNutritionLastPage(responseNutrition.data.meta.last_page);

      setHydrationLogs(responseHydration.data.data);
      setHydrationLastPage(responseHydration.data.meta.last_page);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };


  const handleDeleteNutrition = async (id) => {
  if (!window.confirm('Da li sigurno želiš da obrišeš ovaj unos hrane?')) return;

  try {
    await axios.delete(`http://localhost:8000/api/nutrition-entries/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLogs();
  } catch (error) {
    console.error('Greška pri brisanju nutrijenta:', error);
  }
};

const handleDeleteHydration = async (id) => {
  if (!window.confirm('Da li sigurno želiš da obrišeš ovaj unos hidratacije?')) return;

  try {
    await axios.delete(`http://localhost:8000/api/hydration-entries/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLogs();
  } catch (error) {
    console.error('Greška pri brisanju hidratacije:', error);
  }
};


  const handleNutritionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/nutrition-entries', {
        meal_type: mealType,
        calories,
        entry_date: date || null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMealType('');
      setCalories('');
      fetchLogs();
    } catch (error) {
      console.error('Error submitting nutrition:', error);
    }
  };

  const handleHydrationSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/hydration-entries', {
        amount_ml: hydrationAmount,
        entry_date: date || null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHydrationAmount('');
      fetchLogs();
    } catch (error) {
      console.error('Error submitting hydration:', error);
    }
  };

  return (
    <div className="track-nutrition-container">
      <Breadcrumbs />
      <h2>Track Nutrition & Hydration</h2>

      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <hr />

      <h3>Log a Meal</h3>
      <form onSubmit={handleNutritionSubmit}>
        <label>
          Meal Type:
          <input
            type="text"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            required
          />
        </label>
        <label>
          Calories:
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </label>
        <Button type="submit" text="Add Meal" variant="primary" />
      </form>

      <h3>Log Hydration</h3>
      <form onSubmit={handleHydrationSubmit}>
        <label>
          Amount (ml):
          <input
            type="number"
            value={hydrationAmount}
            onChange={(e) => setHydrationAmount(e.target.value)}
            required
          />
        </label>
        <Button type="submit" text="Add Hydration" variant="primary" />
      </form>

      <hr />

      <NoteInput />
      <ProteinCalculator />

      <h3>Daily Nutrition Log</h3>
      <ul>
  {nutritionLogs.map((log) => (
    <li key={log.id} className="flex justify-between items-center border p-2 mb-2 rounded">
      <span>{log.entry_date} - {log.meal_type} - {log.calories} kcal</span>
      <div className="ml-auto">
        <Button
          text="Obriši"
          onClick={() => handleDeleteNutrition(log.id)}
          variant="danger"
        />
      </div>
    </li>
  ))}
</ul>




      <div className="pagination-buttons">
        <Button
          text="Prethodna"
          onClick={() => setNutritionPage(prev => Math.max(prev - 1, 1))}
          variant="secondary"
          disabled={nutritionPage === 1}
        />
        <span style={{ margin: '0 1rem' }}>Strana {nutritionPage} od {nutritionLastPage}</span>
        <Button
          text="Sledeća"
          onClick={() => setNutritionPage(prev => Math.min(prev + 1, nutritionLastPage))}
          variant="secondary"
          disabled={nutritionPage === nutritionLastPage}
        />
      </div>

      <h3>Daily Hydration Log</h3>
      <ul>
  {hydrationLogs.map((log) => (
    <li key={log.id} className="flex justify-between items-center border p-2 mb-2 rounded">
      <span>{log.entry_date} - {log.amount_ml} ml</span>
      <div className="ml-auto">
        <Button
          text="Obriši"
          onClick={() => handleDeleteNutrition(log.id)}
          variant="danger"
        />
      </div>
    </li>
  ))}
</ul>

      <div className="pagination-buttons">
        <Button
          text="Prethodna"
          onClick={() => setHydrationPage(prev => Math.max(prev - 1, 1))}
          variant="secondary"
          disabled={hydrationPage === 1}
        />
        <span style={{ margin: '0 1rem' }}>Strana {hydrationPage} od {hydrationLastPage}</span>
        <Button
          text="Sledeća"
          onClick={() => setHydrationPage(prev => Math.min(prev + 1, hydrationLastPage))}
          variant="secondary"
          disabled={hydrationPage === hydrationLastPage}
        />
      </div>
    </div>
  );
}

export default TrackNutrition;
