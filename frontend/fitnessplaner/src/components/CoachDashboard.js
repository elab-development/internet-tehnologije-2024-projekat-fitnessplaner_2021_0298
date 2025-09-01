import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CoachDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8000/api/coach/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      // Ako backend ne šalje trainings, inicijalizujemo prazan array
      const usersWithTrainings = response.data.map(user => ({
        ...user,
        trainings: user.trainings || []
      }));
      setUsers(usersWithTrainings);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Greška pri učitavanju podataka');
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div className="coach-dashboard">
      <h2>Pregled korisnika i njihovih treninga</h2>
      
      {users.length === 0 ? (
        <p>Nema korisnika sa treningom kod vas.</p>
      ) : (
        users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name} ({user.email})</h3>
            <ul>
              {user.trainings?.length > 0 ? (
                user.trainings.map(training => (
                  <li key={training.id}>
                    <strong>{training.title}</strong> – {training.day || 'Nema dana'}
                  </li>
                ))
              ) : (
                <li>Nema treninga</li>
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
