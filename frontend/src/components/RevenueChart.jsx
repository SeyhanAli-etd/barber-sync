import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './RevenueChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ monthlyData }) => {
  // Son 12 ayın etiketlerini (örn: "Ocak 2024") ve anahtarlarını (örn: "2024-01") oluştur
  const last12MonthsLabels = [...Array(12)].map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
  }).reverse();

  const last12MonthsKeys = [...Array(12)].map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
  }).reverse();

  const chartData = {
    labels: last12MonthsLabels,
    datasets: [
      {
        label: 'Aylık Ciro (TL)',
        data: last12MonthsKeys.map(monthKey => {
          const dataPoint = monthlyData.find(d => d.month === monthKey);
          return dataPoint ? parseFloat(dataPoint.total_revenue) : 0;
        }),
        backgroundColor: 'rgba(197, 164, 101, 0.6)',
        borderColor: 'rgba(197, 164, 101, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Son 12 Aylık Ciro Dağılımı',
        color: '#e8e6e3',
        font: { size: 18, family: "'Playfair Display', serif" },
      },
      tooltip: {
        backgroundColor: '#111214',
        titleColor: '#c5a465',
        bodyColor: '#e8e6e3',
        borderColor: '#2c2d30',
        borderWidth: 1,
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#9e9e9e' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      x: { ticks: { color: '#9e9e9e' }, grid: { display: false } },
    },
  };

  return (
    <div className="chart-container">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default RevenueChart;