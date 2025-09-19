import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from './Reusable/Button';

export default function CoachDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDay, setEditDay] = useState('');
  const [editExercises, setEditExercises] = useState([]);

  const [newWorkout, setNewWorkout] = useState({
  title: '',
  workout_date: '',
  day: '',
  duration: '',
  exercises: [],
});

const [addingUserId, setAddingUserId] = useState(null); // čuvamo kod kog usera se dodaje


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/coach/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersWithTrainings = response.data.map(user => ({
        ...user,
        trainings: user.trainings || []
      }));

      setUsers(usersWithTrainings);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Greška pri učitavanju podataka');
      setLoading(false);
    }
  };


  const handleAddWorkout = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:8000/api/coach/add-workout",
      {
        user_id: userId,
        title: newWorkout.title,
        day: newWorkout.day,
        workout_date: newWorkout.workout_date || new Date().toISOString().split("T")[0], // ako nije unet datum, uzmi današnji
        duration: newWorkout.duration,
        exercises: newWorkout.exercises, // mora JSON string
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // update state da odmah prikaže novi trening
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, trainings: [...user.trainings, response.data.workout] }
          : user
      )
    );

    // reset forme
    setAddingUserId(null);
    setNewWorkout({ title: "", workout_date: "", day: "", duration: "", exercises: [] });
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Greška pri dodavanju treninga: " + JSON.stringify(err.response?.data));
  }
};



  const handleDelete = async (workoutId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state odmah
      setUsers(prev =>
        prev.map(user => ({
          ...user,
          trainings: user.trainings.filter(w => w.id !== workoutId)
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (workout) => {
    setEditingWorkoutId(workout.id);
    setEditTitle(workout.title);
    setEditDay(workout.day || '');
    setEditExercises(workout.exercises || []);
  };

  const addExercise = () => {
    setEditExercises([...editExercises, '']);
  };

  const handleExerciseChange = (index, value) => {
    const updated = [...editExercises];
    updated[index] = value;
    setEditExercises(updated);
  };

  const removeExercise = (index) => {
    setEditExercises(editExercises.filter((_, i) => i !== index));
  };

  const handleSave = async (workoutId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:8000/api/workouts/${workoutId}`,
        { title: editTitle, day: editDay, exercises: editExercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state odmah
      setUsers(prev =>
        prev.map(user => ({
          ...user,
          trainings: user.trainings.map(w =>
            w.id === workoutId ? response.data : w
          )
        }))
      );

      // Reset edit state
      setEditingWorkoutId(null);
      setEditTitle('');
      setEditDay('');
      setEditExercises([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="coach-dashboard">
      <h2>Pregled korisnika i njihovih treninga</h2>

      {users.length === 0 ? (
        <p>Nema korisnika sa treningom kod vas.</p>
      ) : (
        users.map(user => (
          <div key={user.id} className="user-card mb-6 border p-4 rounded shadow">
            <h3>{user.name} ({user.email})</h3>
            <ul>
              {user.trainings?.length > 0 ? (
                user.trainings.map(training => (
                  <li key={training.id} className="mb-3">
                    {editingWorkoutId === training.id ? (
                      <div className="border p-2 rounded bg-gray-50">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Naziv treninga"
                          className="border p-1 rounded w-full mb-1"
                        />
                        <input
                          type="text"
                          value={editDay}
                          onChange={(e) => setEditDay(e.target.value)}
                          placeholder="Dan"
                          className="border p-1 rounded w-full mb-1"
                        />
                        <div>
  <h4 className="text-sm font-semibold mb-1">Vežbe:</h4>
  {editExercises.map((ex, idx) => (
    <div key={idx} className="flex gap-2 mb-1">
      <select
        value={ex}
        onChange={(e) => handleExerciseChange(idx, e.target.value)}
        className="border p-1 rounded flex-1"
      >
        <option value="">Izaberi vežbu</option>
        <option value="Grudi">Grudi</option>
        <option value="Ledja">Ledja</option>
        <option value="Biceps">Biceps</option>
        <option value="Noge">Noge</option>
        <option value="Kardio">Kardio</option>
        <option value="Triceps">Triceps</option>
        <option value="Trbušnjaci">Trbušnjaci</option>
        <option value="Ramena">Ramena</option>
      </select>
      <button type="button" onClick={() => removeExercise(idx)} className="text-red-500">×</button>
    </div>
  ))}
  <button type="button" onClick={addExercise} className="text-blue-600 text-sm mb-2">Dodaj vežbu</button>
</div>

                        <div className="flex gap-2 mt-2">
                          <Button text="Sačuvaj" variant="primary" onClick={() => handleSave(training.id)} />
                          <Button text="Otkaži" variant="danger" onClick={() => setEditingWorkoutId(null)} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <strong>{training.title}</strong> – {training.day || 'Nema dana'}
                          {(() => {
  const exercises = Array.isArray(training.exercises)
    ? training.exercises
    : JSON.parse(training.exercises || "[]");

  return exercises.length > 0 ? (
    <ul className="pl-5 text-sm text-gray-600 list-disc">
      {exercises.map((exercise, idx) => (
        <li key={idx}>{exercise}</li>
      ))}
    </ul>
  ) : null;
})()}

                        </div>
                        <div className="flex gap-2">
                          <Button text="Izmeni" variant="primary" onClick={() => startEditing(training)} />
                          <Button text="Obriši" variant="danger" onClick={() => handleDelete(training.id)} />
                        </div>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li>Nema treninga</li>
              )}
            </ul>

                  <div className="mt-3">
  {addingUserId === user.id ? (
    <div className="border p-3 rounded bg-gray-50">
      <input
        type="text"
        placeholder="Naziv treninga"
        value={newWorkout.title}
        onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
        className="border p-1 rounded w-full mb-2"
      />
      <input
        type="datetime-local"
        value={newWorkout.workout_date}
        onChange={(e) => setNewWorkout({ ...newWorkout, workout_date: e.target.value })}
        className="border p-1 rounded w-full mb-2"
      />
      <input
        type="text"
        placeholder="Dan"
        value={newWorkout.day}
        onChange={(e) => setNewWorkout({ ...newWorkout, day: e.target.value })}
        className="border p-1 rounded w-full mb-2"
      />
      <input
        type="number"
        placeholder="Trajanje (min)"
        value={newWorkout.duration}
        onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
        className="border p-1 rounded w-full mb-2"
      />

      <h4 className="text-sm font-semibold mb-1">Vežbe:</h4>
      {newWorkout.exercises.map((ex, idx) => (
        <div key={idx} className="flex gap-2 mb-1">
          <select
            value={ex}
            onChange={(e) => {
              const updated = [...newWorkout.exercises];
              updated[idx] = e.target.value;
              setNewWorkout({ ...newWorkout, exercises: updated });
            }}
            className="border p-1 rounded flex-1"
          >
            <option value="">Izaberi vežbu</option>
            <option value="Grudi">Grudi</option>
            <option value="Ledja">Ledja</option>
            <option value="Biceps">Biceps</option>
            <option value="Noge">Noge</option>
            <option value="Kardio">Kardio</option>
            <option value="Triceps">Triceps</option>
            <option value="Trbušnjaci">Trbušnjaci</option>
            <option value="Ramena">Ramena</option>
          </select>
          <button
            type="button"
            onClick={() =>
              setNewWorkout({
                ...newWorkout,
                exercises: newWorkout.exercises.filter((_, i) => i !== idx),
              })
            }
            className="text-red-500"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setNewWorkout({ ...newWorkout, exercises: [...newWorkout.exercises, ''] })}
        className="text-blue-600 text-sm mb-2"
      >
        Dodaj vežbu
      </button>

      <div className="flex gap-2">
        <Button text="Sačuvaj" variant="primary" onClick={() => handleAddWorkout(user.id)} />
        <Button text="Otkaži" variant="danger" onClick={() => setAddingUserId(null)} />
      </div>
    </div>
  ) : (
    <Button text="Dodaj trening" variant="primary" onClick={() => setAddingUserId(user.id)} />
  )}
</div>


          </div>
        ))
      )}
    </div>
  );
}
