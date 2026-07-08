import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth(); // Artık token'ı merkezi AuthContext'ten alıyoruz

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Sadece kullanıcı giriş yapmışsa (token varsa) socket bağlantısı kur
    if (token) {
      const socket = io('http://localhost:5000', {
        auth: {
          token: token,
        },
      });

      socket.on('connect', () => {
        console.log('Socket.IO sunucusuna başarıyla bağlandı:', socket.id);
      });

      // Backend'den gelen 'appointment_update' olayını dinle
      socket.on('appointment_update', (data) => {
        console.log('Yeni bildirim alındı:', data);
        // Bildirime benzersiz bir ID ekleyerek state'e ekliyoruz
        const newNotification = { ...data, id: Date.now() };
        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      });

      socket.on('disconnect', () => {
        console.log('Socket.IO bağlantısı kesildi.');
      });

      // Component unmount olduğunda veya token değiştiğinde bağlantıyı temizle
      return () => {
        socket.disconnect();
      };
    }
  }, [token]); // Bu effect, token değiştiğinde yeniden çalışır

  // Bir bildirimi kapatmak için fonksiyon
  const dismissNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );
  };

  const value = { notifications, dismissNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;