import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getRevenueReport } from '../services/reportService';

const StatCard = ({ title, revenue, count }) => (
  <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', flex: 1, minWidth: '200px' }}>
    <h3 style={{ marginTop: 0, color: '#666' }}>{title}</h3>
    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#17a2b8' }}>
      {revenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
    </p>
    <p style={{ margin: 0, color: '#888' }}>{count} işlem</p>
  </div>
);

const RevenueDashboardPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchReport = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const data = await getRevenueReport(token);
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [token]);

  if (loading) return <div>Raporlar yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>Hata: {error}</div>;

  return (
    <div>
      <h2>Ciro Raporları</h2>
      {report ? (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <StatCard
            title="Bugünkü Ciro"
            revenue={report.daily.total_revenue}
            count={report.daily.transaction_count}
          />
          <StatCard
            title="Bu Aylık Ciro"
            revenue={report.monthly.total_revenue}
            count={report.monthly.transaction_count}
          />
        </div>
      ) : (
        <p>Rapor verisi bulunamadı.</p>
      )}
    </div>
  );
};

export default RevenueDashboardPage;