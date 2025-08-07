import React, { useState, useEffect } from 'react';
import Button from './Reusable/Button';
import NoteInput from './NoteInput';
import axios from 'axios';

function TrackNutrition() {
  const [mealType, setMealType] = useState('');
  const [calories, setCalories] = useState('');
  const [hydrationAmount, setHydrationAmount] = useState('');
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [hydrationLogs, setHydrationLogs] = useState([]);
  const [date, setDate] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLogs();
  }, [date]);

  const fetchLogs = async () => {
    try {
      const responseNutrition = await axios.get('http://localhost:8000/api/nutrition-entries', {
        params: date ? { date } : {},
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseHydration = await axios.get('http://localhost:8000/api/hydration-entries', {
        params: date ? { date } : {},
        headers: { Authorization: `Bearer ${token}` },
      });

      setNutritionLogs(responseNutrition.data.data); // <-- ovde uzimamo samo niz iz paginacije
      setHydrationLogs(responseHydration.data.data); // <-- isto ovde
    } catch (error) {
      console.error('Error fetching logs:', error);
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
        {/* <button type="submit">Add Meal</button> */}
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
        {/* <button type="submit">Add Hydration</button> */}
        <Button type="submit" text="Add Hydration" variant="primary" />
      </form>

      <hr />

      <NoteInput />

      <h3>Daily Nutrition Log</h3>
      <ul>
        {nutritionLogs.map((log) => (
          <li key={log.id}>
            {log.entry_date} - {log.meal_type} - {log.calories} kcal
          </li>
        ))}
      </ul>

      <h3>Daily Hydration Log</h3>
      <ul>
        {hydrationLogs.map((log) => (
          <li key={log.id}>
            {log.entry_date} - {log.amount_ml} ml
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackNutrition;
