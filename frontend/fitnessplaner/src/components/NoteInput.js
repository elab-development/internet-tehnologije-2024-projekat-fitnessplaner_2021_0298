import React, { useState, useEffect } from 'react';

const NoteInput = () => {
  const [note, setNote] = useState('');

  // Funkcija da proveri da li je beleška od danas
  const isToday = (dateString) => {
    const savedDate = new Date(dateString);
    const today = new Date();
    return (
      savedDate.getFullYear() === today.getFullYear() &&
      savedDate.getMonth() === today.getMonth() &&
      savedDate.getDate() === today.getDate()
    );
  };

  // Kad se komponenta učita - proveri da li već ima nešto u localStorage
  useEffect(() => {
    const savedNote = localStorage.getItem('note');
    const savedDate = localStorage.getItem('noteDate');

    if (savedNote && savedDate && isToday(savedDate)) {
      setNote(savedNote);
    } else {
      // Ako nije današnji datum, očisti stari unos
      localStorage.removeItem('note');
      localStorage.removeItem('noteDate');
    }
  }, []);

  // Čuvaj belešku svaki put kad se promeni
  useEffect(() => {
    localStorage.setItem('note', note);
    localStorage.setItem('noteDate', new Date().toISOString());
  }, [note]);

  return (
    <div className="note-input bg-white shadow p-4 rounded mb-6">
      <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
        Dnevna beleška:
      </label>
      <textarea
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Dodaj belešku o obroku, osećaju, napretku..."
        rows={4}
        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <p className="text-sm text-gray-500 mt-1">{note.length} karaktera</p>
    </div>
  );
};

export default NoteInput;
