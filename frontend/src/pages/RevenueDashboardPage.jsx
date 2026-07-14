import React, { useState, useEffect } from 'react';
import { getRevenueReport, getMonthlySummary } from '../services/reportService';
import RevenueChart from '../components/RevenueChart';
import './RevenueDashboardPage.css';

const StatCard = ({ title, amount, count }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p className="revenue-amount">{amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
    <p className="transaction-count">{count} işlem</p>
  </div>
);

const RevenueDashboardPage = () => {
  const [report, setReport] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [revenueReport, monthlySummary] = await Promise.all([
          getRevenueReport(),
          getMonthlySummary()
        ]);
        setReport(revenueReport);
        setMonthlyData(monthlySummary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Raporlar yükleniyor...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="list-page">
      <h2>Ciro Raporları</h2>
      {report && (
        <div className="revenue-grid">
          <StatCard 
            title="Bugünkü Ciro" 
            amount={parseFloat(report.daily.total_revenue)} 
            count={report.daily.transaction_count} 
          />
          <StatCard 
            title="Bu Ayki Ciro" 
            amount={parseFloat(report.monthly.total_revenue)} 
            count={report.monthly.transaction_count} 
          />
        </div>
      )}
      <RevenueChart monthlyData={monthlyData} />
    </div>
  );
};

export default RevenueDashboardPage;