import { useState, useEffect } from 'react';

// Pretpostavka: osoba treba da unosi 1.6g proteina po kg telesne mase
export function useProteinCalculator(weightKg) {
  const [proteinGrams, setProteinGrams] = useState(0);

  useEffect(() => {
    if (weightKg > 0) {
      setProteinGrams((weightKg * 1.6).toFixed(1));
    } else {
      setProteinGrams(0);
    }
  }, [weightKg]);

  return proteinGrams;
}
