import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationDisplay = () => {
  const { notifications, dismissNotification } = useNotifications();

  // Bildirim yoksa hiçbir şey gösterme
  if (notifications.length === 0) {
    return null;
  }

  return (
    // Basit bir stil ile bildirimleri sağ üst köşede gösterelim
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }}>
      {notifications.map((notif) => (
        <div key={notif.id} style={{ background: '#28a745', color: 'white', padding: '1rem', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: 0, padding: 0 }}>{notif.message}</p>
          <button onClick={() => dismissNotification(notif.id)} style={{ marginTop: '10px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
            Kapat
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;