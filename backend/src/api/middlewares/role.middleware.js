// backend/src/api/middlewares/role.middleware.js

/**
 * Creates a middleware that checks if the logged-in user has one of the specified roles.
 * @param {string|string[]} roles - A single role or an array of roles to allow.
 * @returns {function} Express middleware function.
 */
module.exports = function(roles) {
  return function(req, res, next) {
    // This middleware must run AFTER the auth.middleware, so req.user should exist.
    if (!req.user || !req.user.role) {
      return res.status(500).json({ message: 'Sunucu yapılandırma hatası: Rol kontrolü için kullanıcı bilgisi bulunamadı.' });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (allowedRoles.includes(req.user.role)) {
      return next(); // User has the required role, proceed.
    }

    return res.status(403).json({ message: 'Erişim reddedildi. Bu işlemi yapmak için yetkiniz yok.' });
  };
};