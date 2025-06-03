import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import './AuditCharts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AuditCharts = ({ data }) => {
  const labels = data.map(item => item.name);

  const violationsData = {
    labels,
    datasets: [
      {
        label: 'Violations',
        data: data.map(item => item.violations),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const scoreData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Compliance Score',
        data: data.map(item => item.score),
        fill: false,
        borderColor: 'rgba(54, 162, 235, 0.8)',
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="audit-charts">
      <div className="chart-card">
        <h3>Violations per Audit</h3>
        <Bar data={violationsData} />
      </div>

      <div className="chart-card">
        <h3>Compliance Score Over Time</h3>
        <Line data={scoreData} />
      </div>
    </div>
  );
};

export default AuditCharts;
