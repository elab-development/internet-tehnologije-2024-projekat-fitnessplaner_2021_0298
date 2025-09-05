import React, { useState, useEffect } from 'react';


const NoteInput = () => {
  const [note, setNote] = useState('');

  const isToday = (dateString) => {
    const savedDate = new Date(dateString);
    const today = new Date();
    return (
      savedDate.getFullYear() === today.getFullYear() &&
      savedDate.getMonth() === today.getMonth() &&
      savedDate.getDate() === today.getDate()
    );
  };

  useEffect(() => {
    const savedNote = localStorage.getItem('note');
    const savedDate = localStorage.getItem('noteDate');

    if (savedNote && savedDate && isToday(savedDate)) {
      setNote(savedNote);
    } else {
      localStorage.removeItem('note');
      localStorage.removeItem('noteDate');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('note', note);
    localStorage.setItem('noteDate', new Date().toISOString());
  }, [note]);

  return (
    <div className="note-input">
      <label htmlFor="note">Dnevna beleška:</label>
      <textarea
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Dodaj belešku o obroku, osećaju, napretku..."
      />
      <p>{note.length} karaktera</p>
    </div>
  );
};

export default NoteInput;
