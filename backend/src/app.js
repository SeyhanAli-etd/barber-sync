// backend/src/app.js

const http = require('http');
const { Server } = require("socket.io");
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });

const authRoutes = require('./api/routes/auth.routes');
const userRoutes = require('./api/routes/user.routes');
const barberRoutes = require('./api/routes/barbers.routes');
const profileRoutes = require('./api/routes/profile.routes');
const appointmentRoutes = require('./api/routes/appointment.routes');
const serviceRoutes = require('./api/routes/service.routes');
const reportRoutes = require('./api/routes/report.routes');
const initializeSocket = require('./sockets/socketManager');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Socket.IO için de sadece frontend'e izin ver
    methods: ["GET", "POST"],
  }
});

// CORS yapılandırması
const corsOptions = {
  origin: 'http://localhost:5173', // Sadece frontend'in erişimine izin ver
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware'ler
app.use(cors(corsOptions)); // Yapılandırılmış CORS'u kullan
app.use(express.json()); // Gelen JSON body'lerini parse et

// Ana Rota
app.get('/', (req, res) => {
  res.send('Barber-Sync API çalışıyor!');
});

// API Rotaları
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reports', reportRoutes);

// Socket.IO'yu başlat
initializeSocket(io);

// io nesnesini controller'ların erişebilmesi için request'e ekle
app.set('io', io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
