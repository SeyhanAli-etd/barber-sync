const User = require('../models/user.model');
const db = require('../config/db'); // Veritabanı havuzunu doğrudan kullanmak için

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

// @route   DELETE /api/users/me
// @desc    Delete current user's account
// @access  Private
exports.deleteMyAccount = async (req, res) => {
  // Not: İdeal olarak bu mantık User modelinin içinde bir transaction olarak yer almalıdır.
  // Ancak bu örnekte, controller içinde doğrudan DB havuzu kullanılarak implemente edilmiştir.
  const client = await db.connect();
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    await client.query('BEGIN');

    // 1. Kullanıcıyı anonimleştir ve silindi olarak işaretle
    const anonymizedEmail = `deleted_${Date.now()}_${userId}@deleted.com`;
    await client.query(
      `UPDATE users 
       SET full_name = 'Silinmiş Kullanıcı', 
           email = $1, 
           phone_number = NULL, 
           avatar_url = NULL, 
           password_hash = NULL, 
           deleted_at = NOW() 
       WHERE id = $2`,
      [anonymizedEmail, userId]
    );

    // 2. Role özgü verileri temizle
    if (userRole === 'barber') {
      // Berberin hizmetlerini pasif hale getir
      await client.query('UPDATE services SET is_active = false WHERE barber_id = $1', [userId]);
    }

    // 3. Hem berberin hem müşterinin gelecekteki tüm randevularını iptal et
    await client.query(
      `UPDATE appointments SET status = 'cancelled' WHERE (barber_id = $1 OR customer_id = $1) AND status IN ('pending', 'confirmed') AND appointment_time > NOW()`,
      [userId]
    );

    await client.query('COMMIT');
    res.status(204).send(); // No Content, başarıyla silindi
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Hesap silme hatası:', error);
    res.status(500).send('Sunucu Hatası');
  } finally {
    client.release();
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