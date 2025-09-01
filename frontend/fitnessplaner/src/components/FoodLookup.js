import React, { useState } from 'react';
import axios from 'axios';
import Button from './Reusable/Button'; // tvoj custom Button

export default function FoodLookup() {
  const [query, setQuery] = useState('');
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErr('');
    setResData(null);

    try {
      // Uzmi token iz localStorage
      const token = localStorage.getItem('token');

      const res = await axios.get('http://127.0.0.1:8000/api/external/nutrition', {
        params: { q: query },
        headers: { Authorization: `Bearer ${token}` }, // koristi token za autentifikaciju
      });

      setResData(res.data);
    } catch (error) {
      console.error(error);
      setErr('Greška pri pozivu eksternog servisa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-8">
      <h3 className="text-xl font-semibold mb-3">Proveri kalorije (Edamam)</h3>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder='npr. "jabuka" ili "apple"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <Button type="submit" text={loading ? 'Tražim...' : 'Pretraži'} variant="primary" disabled={loading} />
      </form>

      {err && <p className="text-red-600">{err}</p>}

      {resData && resData.found === false && (
        <p className="text-gray-700">Nema rezultata za: <strong>{resData.query}</strong></p>
      )}

      {resData && resData.found && (
        <div className="border rounded p-3">
          <p className="text-sm text-gray-500 mb-1">
            Upit: <strong>{resData.query}</strong> (normalizovano: {resData.normalized_query})
          </p>
          <h4 className="text-lg font-bold mb-2">{resData.label}</h4>
          <p className="text-sm text-gray-600 mb-2">Kategorija: {resData.category || '—'}</p>
          <ul className="list-disc pl-5">
            <li><strong>Kalorije:</strong> {resData.calories_kcal ?? '—'} kcal</li>
            <li><strong>Proteini:</strong> {resData.protein_g ?? '—'} g</li>
            <li><strong>Masti:</strong> {resData.fat_g ?? '—'} g</li>
            <li><strong>Ugljeni hidrati:</strong> {resData.carbs_g ?? '—'} g</li>
            <li><strong>Vlakna:</strong> {resData.fiber_g ?? '—'} g</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            *Vrednosti su tipično za 100 g. Za najtačnije rezultate unos koristi engleske nazive (npr. "apple").
          </p>
        </div>
      )}
    </div>
  );
}
