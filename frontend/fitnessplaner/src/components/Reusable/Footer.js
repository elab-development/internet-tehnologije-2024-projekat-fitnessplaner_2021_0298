import React from 'react';
import LiveClock from '../LiveClock';
import axios from 'axios';

export default function Footer({ onLogout, token }) {
  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/nutrition-hydration-summary/pdf', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // very important for PDF
      });

      // Kreiranje linka za preuzimanje
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `daily-summary.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Greška pri preuzimanju PDF-a.');
    }
  };

  return (
    <footer className="footer">
      <div>Fitness Planner &copy; {new Date().getFullYear()}</div>

      <div className="text-center">
        <LiveClock />
      </div>

      <div>
        <button
          onClick={handleDownloadPDF}
          className="download-pdf-button mr-4"
        >
          Preuzmi dnevni PDF
        </button>

        <button
          onClick={onLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </footer>
  );
}
