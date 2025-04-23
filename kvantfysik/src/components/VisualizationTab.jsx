// Fil: VisualizationTab.jsx
// Komponent som visualiserar tunnlingseffekten med en graf

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrera Chart.js komponenter
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VisualizationTab = () => {
  // Skapa data för visualiseringen
  const data = {
    labels: Array.from({ length: 200 }, (_, i) => (i - 100) / 10), // x-axel från -10 till 10
    datasets: [
      {
        label: 'Potentialbarriär',
        data: Array.from({ length: 200 }, (_, i) => {
          const x = (i - 100) / 10;
          return Math.abs(x) < 0.05 ? 5 : 0; // 5 eV barriär mellan -0.05 och 0.05
        }),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: true,
      },
      {
        label: 'Elektronens vågfunktion',
        data: Array.from({ length: 200 }, (_, i) => {
          const x = (i - 100) / 10;
          if (Math.abs(x) < 0.05) {
            // Inuti barriären - exponentiell avklingning
            return Math.exp(-Math.abs(x) * 10);
          } else {
            // Utanför barriären - sinusvåg
            return Math.sin(x * 5) * Math.exp(-Math.abs(x) * 0.5);
          }
        }),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Visualisering av tunnlingseffekten'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Energi (eV) / Vågfunktion'
        },
        min: -1,
        max: 6
      },
      x: {
        title: {
          display: true,
          text: 'Position (nm)'
        }
      }
    }
  };

  return (
    <div className="visualization-container">
      <h2>Visualisering av tunnlingseffekten</h2>
      <div className="visualization-description">
        <p>
          Grafen visar en schematisk representation av tunnlingseffekten:
        </p>
        <ul>
          <li>Den röda ytan representerar potentialbarriären (5 eV)</li>
          <li>Den blåa linjen representerar elektronens vågfunktion</li>
          <li>Notera hur vågfunktionen exponentiellt avklingar inuti barriären</li>
          <li>Vågfunktionen fortsätter på andra sidan barriären, vilket visar tunnlingseffekten</li>
        </ul>
      </div>
      <div className="chart-container">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default VisualizationTab; 