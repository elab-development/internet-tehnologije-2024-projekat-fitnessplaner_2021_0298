import React, { useState } from 'react';
import Button from './Reusable/Button';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('user');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // sačuvaj role i token ako backend vraća token
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        localStorage.setItem('role', role);

        // preusmeri korisnika na odgovarajući dashboard
        if (role === 'user') {
          navigate('/dashboard');
        } else if (role === 'coach') {
          navigate('/coach-dashboard');
        }
      } else {
        setError(data.message || 'Registracija nije uspela');
      }
    } catch (err) {
      console.error(err);
      setError('Greška na serveru');
    }
  };

  return (
    <div className="register-container">
      <h2>Registracija</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br/>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Potvrdi lozinku"
          value={password_confirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        /><br/>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
  <option value="user">Korisnik</option>
  <option value="coach">Trener</option>
</select>
        {/* <button type="submit">Registruj se</button> */}
        <Button type="submit" text="Registruj se" variant="primary" />
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Register;
