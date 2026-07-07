// backend/src/api/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Token'ı header'dan al
  const authHeader = req.header('Authorization');

  // Header yoksa hata ver
  if (!authHeader) {
    return res.status(401).json({ message: 'Yetkilendirme reddedildi. Token bulunamadı.' });
  }

  // Token'ı "Bearer <token>" formatından ayır
  const token = authHeader.split(' ')[1];

  // Token yoksa (sadece "Bearer" yazıyorsa)
  if (!token) {
    return res.status(401).json({ message: 'Yetkilendirme reddedildi. Token formatı hatalı.' });
  }

  try {
    // 2. Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Doğrulanmış kullanıcı bilgisini request'e ekle
    req.user = decoded.user;
    
    // 4. Sonraki adıma geç
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token geçersiz.' });
  }
};