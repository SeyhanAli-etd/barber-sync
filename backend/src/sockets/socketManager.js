const jwt = require('jsonwebtoken');

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Bir istemci bağlandı: ${socket.id}`);

    // Kullanıcıyı kendi ID'si ile bir odaya al.
    // Gerçek bir uygulamada, bu token'ı doğrulamak daha güvenli olur.
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;
        socket.join(userId);
        console.log(`Kullanıcı ${userId}, kendi odasına katıldı.`);
      } catch (error) {
        console.log('Geçersiz token ile socket bağlantı denemesi.');
      }
    }

    socket.on('disconnect', () => {
      console.log(`İstemci bağlantısı kesildi: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;