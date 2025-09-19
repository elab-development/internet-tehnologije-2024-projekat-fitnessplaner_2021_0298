import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

export default function DailyCaloriesChart({ token }) {
  const [chartData, setChartData] = useState([['Datum', 'Kalorije']]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/nutrition-daily-calories',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.map(item => {
          // Razbijemo string "YYYY-MM-DD" na delove
          const [year, month, day] = item.date.split('-').map(Number);
          // Kreiramo pravi Date objekat
          const dateObj = new Date(year, month - 1, day);
          return [dateObj, Number(item.total_calories)]; // kalorije kao broj
        });

        setChartData([['Datum', 'Kalorije'], ...data]);
      } catch (error) {
        console.error('Greška pri učitavanju podataka za graf:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h3>Dnevni unos kalorija za trenutni mesec</h3>
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData}
        options={{
          hAxis: {
            title: 'Datum',
            format: 'dd MMM', // lep prikaz datuma
          },
          vAxis: { title: 'Kalorije' },
          legend: { position: 'bottom' },
        }}
      />
    </div>
  );
}
