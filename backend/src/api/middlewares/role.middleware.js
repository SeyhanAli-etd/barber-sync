// backend/src/api/middlewares/role.middleware.js

// Bu, rol tabanlı yetkilendirme yapan bir middleware'dir.
// Örn: roleMiddleware('barber') şeklinde kullanılır.
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // authMiddleware'in daha önce çalıştığını ve req.user'ı ayarladığını varsayıyoruz.
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
    }

    // Kullanıcının rolü uygunsa, bir sonraki adıma geç.
    next();
  };
};

module.exports = roleMiddleware;