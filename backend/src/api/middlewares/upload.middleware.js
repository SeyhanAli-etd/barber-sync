const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Mutlak path: nereden çalıştırılırsa çalıştırılsın hep backend/uploads'a yazar
// Bu dosya `backend/src/api/middlewares` içinde olduğu için 3 seviye yukarı çıkıyoruz.
const uploadsDir = path.join(__dirname, '..', '..', '..', 'uploads');

// Eğer 'uploads' klasörü yoksa, oluştur.
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Yüklenen dosyaların nereye kaydedileceğini ve nasıl adlandırılacağını belirler
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Artık her zaman mutlak ve doğru yolu kullanacak.
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Dosya adını benzersiz bir UUID ile oluşturur ve orijinal uzantısını korur
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Sadece resim dosyalarına izin verir
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB dosya boyutu limiti
});

module.exports = upload;