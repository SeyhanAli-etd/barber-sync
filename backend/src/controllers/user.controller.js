const User = require('../models/user.model');

// @route   GET /api/users/me
// @desc    Get current user's info
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the authMiddleware
    // We don't want to send the password hash
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    // Omit password_hash from the response
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Kullanıcı bilgisi getirme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};