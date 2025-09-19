import React, { useEffect, useState } from "react";
import Button from "./Reusable/Button";


function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nutritionEntries, setNutritionEntries] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Greška pri učitavanju korisnika:", error);
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovog korisnika?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        const err = await response.json();
        alert(err.message || "Greška pri brisanju korisnika");
      }
    } catch (error) {
      console.error("Greška pri brisanju korisnika:", error);
    }
  };

  const fetchUserEntries = async (user) => {
    setSelectedUser(user);
    setEntriesLoading(true);
    try {
      const [nutritionRes, workoutsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/users/${user.id}/nutrition-entries`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }).then((res) => res.json()),
        fetch(`http://localhost:8000/api/users/${user.id}/workouts`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }).then((res) => res.json()),
      ]);

      setNutritionEntries(nutritionRes);
      setWorkouts(workoutsRes);
      setEntriesLoading(false);
    } catch (error) {
      console.error("Greška pri učitavanju unosa korisnika:", error);
      setEntriesLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="admin-dashboard text-center mt-10">Učitavanje korisnika...</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Email</th>
            <th>Uloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td onClick={() => fetchUserEntries(user)} style={{ cursor: "pointer", color: "#2563eb", textDecoration: "underline" }}>
                {user.name}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="text-center">
                <button className="action-btn" onClick={() => deleteUser(user.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="user-section">
          {entriesLoading ? (
            <p>Učitavanje unosa...</p>
          ) : (
            <>
              <div className="user-card">
                <h3>Nutrition Entries</h3>
                {nutritionEntries.length > 0 ? (
                  <ul>
                    {nutritionEntries.map((entry) => (
                      <li key={entry.id}>{entry.meal_type}: {entry.calories} kcal</li>
                    ))}
                  </ul>
                ) : <p>Nema unosa hrane.</p>}
              </div>

              <div className="user-card">
  <h3>Workouts</h3>
  {workouts.length > 0 ? (
    <ul>
      {workouts.map((workout) => (
        <li key={workout.id} className="mb-2">
          <strong>{workout.day}</strong>: {workout.title}{" "}
          {workout.duration && <span>({workout.duration} min)</span>}
        </li>
      ))}
    </ul>
  ) : (
    <p>Nema unosa treninga za ovog korisnika.</p>
  )}
</div>


            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
