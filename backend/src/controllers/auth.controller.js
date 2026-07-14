const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  // Basic validation
  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
  }

  try {
    // Check if user already exists
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      full_name,
      email,
      password_hash,
      role,
    });

    // Don't return password hash
    const { password_hash: _, ...userToReturn } = newUser;

    res.status(201).json(userToReturn);
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Lütfen e-posta ve şifrenizi girin.' });
  }

  try {
    // Check for user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // User matched, create JWT payload
    const payload = {
      id: user.id,
      role: user.role,
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Return the token
    res.json({ token });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).send('Sunucu Hatası');
  }
};