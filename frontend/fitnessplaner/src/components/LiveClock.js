import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Osvežava se svakih 1s

    return () => clearInterval(interval); // Čisti interval kada se komponenta unmountuje
  }, []);

  const formattedTime = time.toLocaleTimeString();

  return (
    <div className="live-clock text-center mt-6 text-xl font-semibold text-gray-700">
      Trenutno vreme: {formattedTime}
    </div>
  );
};

export default LiveClock;
