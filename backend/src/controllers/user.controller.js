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

// @route   PUT /api/users/me
// @desc    Update the current user's (customer's) profile
// @access  Private
exports.updateMyProfile = async (req, res) => {
  try {
    const { full_name, email, phone_number } = req.body;
    const user_id = req.user.id;

    const userData = {
      full_name: full_name || null,
      email: email || null,
      phone_number: phone_number || null,
    };

    // SADECE yeni bir dosya varsa avatarı güncelle
    if (req.file) {
      userData.avatar_url = `uploads/${req.file.filename}`;
    }

    const updatedUser = await User.update(user_id, userData);

    // Şifre hash'ini yanıttan çıkar
    const { password_hash, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Kullanıcı profili güncelleme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};