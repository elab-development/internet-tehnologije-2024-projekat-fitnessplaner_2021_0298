import React, { useState, useEffect } from 'react';
import Button from './Reusable/Button';
import Breadcrumbs from './Reusable/Breadcrumbs';
import axios from 'axios';

const exerciseOptions = [
  { label: "Grudi", videoUrl: "https://www.youtube.com/embed/fGm-ef-4PVk" },
  { label: "Ledja", videoUrl: "https://www.youtube.com/embed/jLvqKgW-_G8" },
  { label: "Biceps", videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo" },
  { label: "Noge", videoUrl: "https://www.youtube.com/embed/H6mRkx1x77k" },
  { label: "Kardio", videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI" },
  { label: "Triceps", videoUrl: "https://www.youtube.com/embed/OpRMRhr0Ycc" },
  { label: "Trbušnjaci", videoUrl: "https://www.youtube.com/embed/1G0y8D5rFDc" },
  { label: "Ramena", videoUrl: "https://www.youtube.com/embed/21lYP86dHW4" },
];

export default function WorkoutSchedule() {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('');
  const [duration, setDuration] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [coachId, setCoachId] = useState('');
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    fetchAllWorkouts();
  }, []);

  const fetchAllWorkouts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:8000/api/workouts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllWorkouts(response.data.data); // paginacija
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};


const handleDeleteWorkout = async (id) => {
  const confirmDelete = window.confirm("Da li ste sigurni da želite da obrišete ovaj trening?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://127.0.0.1:8000/api/workouts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Osveži listu treninga
    fetchAllWorkouts();
    if (selectedDay) {
      fetchWorkoutsForDay(selectedDay);
    }

    alert("Trening uspešno obrisan.");
  } catch (error) {
    console.error("Greška pri brisanju treninga:", error);
    alert("Greška pri brisanju treninga.");
  }
};


  const fetchWorkoutsForDay = async (day) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://127.0.0.1:8000/api/workouts/by-day/${day}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFilteredWorkouts(response.data.data); // direktno sve za taj dan sa backend-a
    setSelectedDay(day);
  } catch (error) {
    console.error("Error fetching workouts for day:", error);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem('token');  // Dodaj ovo da uzmeš token

    await axios.post(
      'http://127.0.0.1:8000/api/workouts',
      {
        title,
        day,
        duration,
        workout_date: workoutDate,
        exercises: selectedExercises,
        coach_id: coachId !== '' ? parseInt(coachId) : null,
      },
      {
        headers: { Authorization: `Bearer ${token}` },  // I prosledi ga u header
      }
    );

    setSuccessMsg("Workout successfully added!");
    setTitle('');
    setDay('');
    setDuration('');
    setWorkoutDate('');
    setSelectedExercises([]);
    setCoachId('');

    // Re-fetch all workouts
    fetchAllWorkouts();
    // Optional: ako hoćeš da odmah vidiš novi trening ako je na izabran dan
    if (day === selectedDay) {
      fetchWorkoutsForDay(day);
    }

  } catch (error) {
    console.error("Error submitting workout:", error);
  }
  finally {
    setLoading(false); // ⬅️ loading gotov
  }
};


  return (
    <div className="workout-container p-4 max-w-4xl mx-auto">
      <Breadcrumbs />
      <h2 className="text-2xl font-bold mb-4">Kreiraj novi trening</h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Naziv treninga"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Izaberi dan</option>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Trajanje u minutima"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
  type="number"
  placeholder="ID trenera (opciono)"
  value={coachId}
  onChange={(e) => setCoachId(e.target.value)}
  className="w-full border p-2 rounded"
/>

        <input
          type="date"
          value={workoutDate}
          onChange={(e) => setWorkoutDate(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <label className="block mb-2 font-semibold">Izaberi vežbe:</label>
<div className="flex flex-wrap gap-4 mb-4">
  {exerciseOptions.map((exercise) => (
    <label key={exercise.label} className="checkbox-label flex items-center space-x-2">
      <input
        type="checkbox"
        value={exercise.label}
        checked={selectedExercises.includes(exercise.label)}
        onChange={(e) => {
          const value = e.target.value;
          if (e.target.checked) {
            setSelectedExercises(prev => [...prev, value]);
          } else {
            setSelectedExercises(prev => prev.filter(ex => ex !== value));
          }
        }}
      />
      <span>{exercise.label}</span>
    </label>
  ))}
</div>


        {/* <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sačuvaj trening
        </button> */}

        <Button
  type="submit"
  text={loading ? "Sačekajte..." : "Sačuvaj trening"}
  variant="primary"
  disabled={loading}
/>
        

      </form>

      <h3 className="text-xl font-semibold mb-2">View Workouts by Day:</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
          // <button
          //   key={d}
          //   onClick={() => fetchWorkoutsForDay(d)}
          //   className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          // >
          //   {d}
          // </button>
          <Button
    key={d}
    onClick={() => fetchWorkoutsForDay(d)}
    text={d}
    variant="secondary"
    className="mr-2 mb-2"  // dodaj ako želiš razmak između dugmadi
  />
        ))}
      </div>

      {selectedDay && (
        <div>
          <h4 className="text-lg font-bold mb-2">Treninzi za: {selectedDay}</h4>
          {filteredWorkouts.length === 0 ? (
            <p>Nema treninga za izabrani dan.</p>
          ) : (
            <ul className="space-y-2">
  {filteredWorkouts.map((w) => (
    <li
      key={w.id}
      className="border p-3 rounded bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between"
    >
      <div className="flex-1">
        <strong>{w.title}</strong> – {w.duration} minuta
        <div className="mt-2 flex flex-wrap gap-2">
          {w.exercises && w.exercises.length > 0 ? (
            w.exercises.map((exercise) => {
              const video = exerciseOptions.find((ex) => ex.label === exercise);
              if (!video) return null;
              return (
                <Button
                  key={exercise}
                  text={`${exercise} Video`}
                  onClick={() => window.open(video.videoUrl.replace("embed/", "watch?v="), "_blank")}
                  variant="primary"
                />
              );
            })
          ) : (
            <p className="text-sm text-gray-500">Nema vezanih vežbi</p>
          )}
        </div>
      </div>

      {/* Delete dugme */}
      <div className="mt-4 md:mt-0 md:ml-4">
        <Button
          text="Obriši"
          onClick={() => handleDeleteWorkout(w.id)}
          variant="danger"
        />
      </div>
    </li>
  ))}
</ul>


          )}
        </div>
      )}

      {selectedExercises.length > 0 && (
        <div className="mt-8 bg-white p-4 rounded shadow">
          <h4 className="text-lg font-bold mb-2 text-gray-800">Pregled videa za vežbe:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedExercises.map((exercise) => {
              const video = exerciseOptions.find((ex) => ex.label === exercise);
              return (
                <div key={exercise}>
                  <p className="mb-1 font-semibold">{exercise}</p>
                  {video && (
                    <iframe
                      width="100%"
                      height="215"
                      src={video.videoUrl}
                      title={`Video za ${exercise}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}