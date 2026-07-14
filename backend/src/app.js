// backend/src/app.js

const http = require('http');
const { Server } = require("socket.io");
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs'); // Dosya sistemi modülünü ekle
require('dotenv').config({ path: './.env' });

// Rota (Route) dosyalarını import et
const authRoutes = require('./api/routes/auth.routes');
const userRoutes = require('./api/routes/user.routes');
const barberRoutes = require('./api/routes/barbers.routes');
const profileRoutes = require('./api/routes/profile.routes');
const appointmentRoutes = require('./api/routes/appointment.routes');
const serviceRoutes = require('./api/routes/service.routes');
const reportRoutes = require('./api/routes/report.routes');
const reviewRoutes = require('./api/routes/review.routes');
const barberGalleryRoutes = require('./api/routes/barberGallery.routes'); // Yeni galeri rotalarını import et
const initializeSocket = require('./sockets/socketManager');

const app = express();

// CORS Middleware'i: Frontend'in (localhost:5173) backend'e (localhost:5000) istek göndermesine izin verir.
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Body parser middleware'leri
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Yüklenen dosyaları (avatarlar, galeri fotoğrafları) statik olarak servis et
// __dirname, mevcut dosyanın bulunduğu dizindir (src). '..' ile bir üst dizine (backend) çıkıp 'uploads' klasörüne giriyoruz.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 'uploads' klasörünün var olduğundan emin ol
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Bilgi: 'uploads' klasörü başarıyla oluşturuldu.");
}

// API Rotaları
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profile/gallery', barberGalleryRoutes); // Yeni galeri rotalarını ekle

// HTTP sunucusunu ve Socket.IO'yu oluştur
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

// Socket.IO yöneticisini başlat
initializeSocket(io);

// io nesnesini controller'ların erişebilmesi için request'e ekle
app.set('io', io);

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
