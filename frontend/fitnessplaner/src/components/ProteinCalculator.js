import React, { useState } from 'react';
import { useProteinCalculator } from '../hooks/useProteinCalculator';

export default function ProteinCalculator() {
  const [weight, setWeight] = useState('');
  const proteinIntake = useProteinCalculator(Number(weight));

  return (
    <div className="protein-calculator">
      <h2>Protein kalkulator</h2>
      <input
        type="number"
        placeholder="Unesite težinu u kg"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <p className="mt-2">
        Preporučeni dnevni unos proteina: <strong>{proteinIntake} g</strong>
      </p>
    </div>
  );
}
