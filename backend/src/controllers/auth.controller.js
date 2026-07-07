// backend/src/controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Gerekli alanlar var mı kontrol et
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
    }

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Yeni kullanıcıyı oluştur
    const newUser = await User.create({
      full_name,
      email,
      password_hash,
      role,
    });

    // Cevap dön (şifre hash'ini gönderme!)
    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu.',
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    // E-posta zaten varsa veritabanı "unique constraint" hatası verir
    if (error.code === '23505') {
        return res.status(409).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
    }
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Gerekli alanlar var mı kontrol et
    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre zorunludur.' });
    }

    // 2. Kullanıcıyı e-posta ile bul
    const user = await User.findByEmail(email);
    if (!user) {
      // Güvenlik için "Kullanıcı bulunamadı" demek yerine genel bir hata veriyoruz.
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // 3. Şifreleri karşılaştır
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // 4. JWT Oluştur
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token 1 saat geçerli olacak
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          message: 'Giriş başarılı.',
          token: token,
        });
      }
    );
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
};
