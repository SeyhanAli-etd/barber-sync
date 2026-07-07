// backend/src/app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });

const authRoutes = require('./api/routes/auth.routes');
const userRoutes = require('./api/routes/user.routes');
const barberRoutes = require('./api/routes/barbers.routes');
const profileRoutes = require('./api/routes/profile.routes');
const appointmentRoutes = require('./api/routes/appointment.routes');

const app = express();

// Middleware'ler
app.use(cors()); // Farklı portlardan gelen isteklere izin ver
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
