import React, { useEffect, useState } from 'react';

const DailyMessage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const messages = [
      'Novi početak!',
      'Nastavi jako!',
      'Pola puta!',
      'Samo napred!',
      'Skoro si tu!',
      'Odmor zaslužen!',
      'Priprema za uspeh!',
    ];

    const today = new Date().getDay(); // 0 = Nedelja
    const index = today === 0 ? 6 : today - 1;

    setMessage(messages[index]);
  }, []);

  return (
    <div className="daily-message bg-yellow-100 text-yellow-800 border border-yellow-300 rounded p-4 mb-6 text-center shadow">
      <h3 className="text-lg font-semibold">{message}</h3>
    </div>
  );
};

export default DailyMessage;
