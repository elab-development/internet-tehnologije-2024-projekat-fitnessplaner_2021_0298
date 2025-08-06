import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login'); // registracija uspešna → vodi korisnika na login
      } else {
        setError(data.message || 'Registracija nije uspela');
      }
    } catch (err) {
      setError('Greška na serveru');
    }
  };

  return (
    <div>
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
        <button type="submit">Registruj se</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Register;
